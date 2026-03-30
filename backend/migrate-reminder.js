import pool from "./db.js";

async function migrate() {
  try {
    // 添加 reminder_at 字段
    await pool.query(`
      ALTER TABLE tasks
      ADD COLUMN IF NOT EXISTS reminder_at DATETIME DEFAULT NULL
    `).catch(() => {
      // MySQL < 8.0.16 不支持 IF NOT EXISTS，用另一种方式
      return pool.query(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tasks' AND COLUMN_NAME = 'reminder_at'
      `).then(([rows]) => {
        if (rows.length === 0) {
          return pool.query(`ALTER TABLE tasks ADD COLUMN reminder_at DATETIME DEFAULT NULL`);
        }
        console.log("Column reminder_at already exists");
      });
    });

    // 添加 reminder_notified 字段
    await pool.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tasks' AND COLUMN_NAME = 'reminder_notified'
    `).then(([rows]) => {
      if (rows.length === 0) {
        return pool.query(`ALTER TABLE tasks ADD COLUMN reminder_notified TINYINT(1) DEFAULT 0`);
      }
      console.log("Column reminder_notified already exists");
    });

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
