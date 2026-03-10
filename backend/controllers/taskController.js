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

// 新建任务（增加 priority）
export const createTask = async (req, res) => {
  const userId = req.user.id;
  const { title, description, priority = "Medium" } = req.body;

  try {
    await pool.query(
      "INSERT INTO tasks (title, description, priority, user_id) VALUES (?, ?, ?, ?)",
      [title, description, priority, userId]
    );
    res.json({ message: "Task created" });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 更新任务（增加 priority）
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, completed, priority = "Medium" } = req.body;

  try {
    await pool.query(
      "UPDATE tasks SET title=?, description=?, completed=?, priority=? WHERE id=? AND user_id=?",
      [title, description, completed, priority, id, userId]
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
