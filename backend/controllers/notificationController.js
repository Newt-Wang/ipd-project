import pool from "../db.js";

export const getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const [notifications] = await pool.query(
      `SELECT id, task_id, channel, title, message, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );
    res.json(notifications);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markNotificationRead = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("markNotificationRead error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

