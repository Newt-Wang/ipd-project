import pool from "../db.js";
import nodemailer from "nodemailer";
import config from "../config.js";

const REMINDER_CHECK_INTERVAL_MS = 60 * 1000;
let timer = null;
let mailTransporter = null;

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const getMailer = () => {
  if (!config.email.enabled) return null;
  if (!config.email.host || !config.email.user || !config.email.pass) return null;

  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  return mailTransporter;
};

const sendEmail = async ({ to, subject, text }) => {
  if (!isEmail(to)) {
    throw new Error(`Invalid recipient email: ${to}`);
  }

  const transporter = getMailer();
  if (!transporter) {
    throw new Error("Email transport is not configured or disabled");
  }

  await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    text,
  });
};

export const ensureReminderSchema = async () => {
  const [userEmailColumn] = await pool.query(
    `
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'users'
      AND column_name = 'email'
    LIMIT 1
    `
  );

  if (userEmailColumn.length === 0) {
    await pool.query("ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL");
  }

  const [emailIndex] = await pool.query(
    `
    SELECT 1
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'users'
      AND index_name = 'idx_users_email_unique'
    LIMIT 1
    `
  );

  if (emailIndex.length === 0) {
    await pool.query(
      "ALTER TABLE users ADD UNIQUE INDEX idx_users_email_unique (email)"
    );
  }

  await pool.query(
    "UPDATE users SET email = username WHERE email IS NULL OR email = ''"
  );

  const [taskReminderMinutesColumn] = await pool.query(
    `
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'tasks'
      AND column_name = 'reminder_minutes_before'
    LIMIT 1
    `
  );

  if (taskReminderMinutesColumn.length === 0) {
    await pool.query(
      "ALTER TABLE tasks ADD COLUMN reminder_minutes_before INT DEFAULT 0"
    );
  }

  const [taskReminderSentAtColumn] = await pool.query(
    `
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'tasks'
      AND column_name = 'reminder_sent_at'
    LIMIT 1
    `
  );

  if (taskReminderSentAtColumn.length === 0) {
    await pool.query("ALTER TABLE tasks ADD COLUMN reminder_sent_at DATETIME NULL");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      task_id INT NOT NULL,
      channel VARCHAR(20) NOT NULL DEFAULT 'in_app',
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_read_created (user_id, is_read, created_at),
      INDEX idx_task_id (task_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
};

const createInAppNotification = async (task) => {
  const dueTime = new Date(task.due_date).toLocaleString();
  const title = `Task reminder: ${task.title}`;
  const message = `Your task "${task.title}" is due at ${dueTime}.`;

  await pool.query(
    `INSERT INTO notifications (user_id, task_id, channel, title, message)
     VALUES (?, ?, 'in_app', ?, ?)`,
    [task.user_id, task.id, title, message]
  );
};

const createEmailNotification = async (task) => {
  const to = task.user_email;
  if (!isEmail(to)) {
    console.warn(`Skip email reminder for task ${task.id}: invalid email "${to}"`);
    return false;
  }

  if (!getMailer()) {
    console.warn(
      `Skip email reminder for task ${task.id}: email transport is not configured or disabled`
    );
    return false;
  }

  const dueTime = new Date(task.due_date).toLocaleString();
  const subject = `Task reminder: ${task.title}`;
  const text = [
    `Hello,`,
    ``,
    `This is a reminder for your task: ${task.title}`,
    `Due time: ${dueTime}`,
    `Reminder offset: ${task.reminder_minutes_before} minutes before due`,
    ``,
    `Task Manager`,
  ].join("\n");

  await sendEmail({ to, subject, text });

  await pool.query(
    `INSERT INTO notifications (user_id, task_id, channel, title, message)
     VALUES (?, ?, 'email', ?, ?)`,
    [task.user_id, task.id, subject, `Email sent to ${to}`]
  );

  return true;
};

export const processDueReminders = async () => {
  const [tasks] = await pool.query(
    `
    SELECT t.id, t.user_id, t.title, t.due_date, t.reminder_minutes_before, u.email AS user_email
    FROM tasks t
    LEFT JOIN users u ON u.id = t.user_id
    WHERE t.completed = 0
      AND t.due_date IS NOT NULL
      AND t.reminder_minutes_before > 0
      AND t.reminder_sent_at IS NULL
      AND DATE_SUB(t.due_date, INTERVAL t.reminder_minutes_before MINUTE) <= NOW()
    `
  );

  for (const task of tasks) {
    await createInAppNotification(task);
    try {
      await createEmailNotification(task);
    } catch (err) {
      console.error(`Email notification failed for task ${task.id}:`, err.message);
    }
    await pool.query(
      "UPDATE tasks SET reminder_sent_at = NOW() WHERE id = ?",
      [task.id]
    );
  }
};

export const startReminderScheduler = () => {
  if (timer) return;

  processDueReminders().catch((err) => {
    console.error("Initial reminder scan failed:", err);
  });

  timer = setInterval(() => {
    processDueReminders().catch((err) => {
      console.error("Reminder scheduler error:", err);
    });
  }, REMINDER_CHECK_INTERVAL_MS);
};

