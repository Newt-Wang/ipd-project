import pool from "../db.js";

// 获取任务
export const getTasks = async (req, res) => {
  const userId = req.user.id;
  const [tasks] = await pool.query(
    "SELECT * FROM tasks WHERE user_id = ?",
    [userId]
  );
  res.json(tasks);
};

// 新建任务（增加 priority、due_date 和 reminder_at）
export const createTask = async (req, res) => {
  const userId = req.user.id;
  const { title, description, priority = "Medium", category = "Work", due_date, reminder_at } = req.body;

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toISOString().slice(0, 19).replace('T', ' ');
  };

  try {
    await pool.query(
      "INSERT INTO tasks (title, description, priority, category, due_date, reminder_at, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, priority, category, formatDate(due_date), formatDate(reminder_at), userId]
    );
    res.json({ message: "Task created" });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 更新任务（增加 priority、due_date 和 reminder_at）
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, completed, priority = "Medium", category = "Work", due_date, reminder_at } = req.body;

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toISOString().slice(0, 19).replace('T', ' ');
  };

  try {
    await pool.query(
      "UPDATE tasks SET title=?, description=?, completed=?, priority=?, category=?, due_date=?, reminder_at=? WHERE id=? AND user_id=?",
      [title, description, completed, priority, category, formatDate(due_date), formatDate(reminder_at), id, userId]
    );
    res.json({ message: "Task updated" });
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 删除任务
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await pool.query(
      "DELETE FROM tasks WHERE id=? AND user_id=?",
      [id, userId]
    );
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 获取未完成超过1天的任务通知
export const getNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const [tasks] = await pool.query(
      `SELECT id, title, created_at FROM tasks
       WHERE user_id = ? AND completed = 0
       AND created_at <= DATE_SUB(NOW(), INTERVAL 1 DAY)`,
      [userId]
    );
    res.json(tasks);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 更新任务完成状态
export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { completed } = req.body;

  try {
    await pool.query(
      "UPDATE tasks SET completed=? WHERE id=? AND user_id=?",
      [completed, id, userId]
    );
    res.json({ message: "Task status updated" });
  } catch (err) {
    console.error("updateTaskStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 获取到期提醒（reminder_at <= 当前时间 且未完成 且 reminder_notified = 0）
export const getDueReminders = async (req, res) => {
  const userId = req.user.id;
  try {
    const [tasks] = await pool.query(
      `SELECT id, title, reminder_at FROM tasks
       WHERE user_id = ? AND completed = 0
       AND reminder_at IS NOT NULL
       AND reminder_at <= NOW()
       AND reminder_notified = 0`,
      [userId]
    );
    res.json(tasks);
  } catch (err) {
    console.error("getDueReminders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 标记提醒已发送
export const markReminderNotified = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    await pool.query(
      "UPDATE tasks SET reminder_notified = 1 WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    res.json({ message: "Reminder marked as notified" });
  } catch (err) {
    console.error("markReminderNotified error:", err);
    res.status(500).json({ message: "Server error" });
  }
};