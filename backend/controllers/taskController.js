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

// 新建任务（增加 priority 和 due_date）
export const createTask = async (req, res) => {
  const userId = req.user.id;
  const { title, description, priority = "Medium", due_date } = req.body;

  // 转换日期格式：将 ISO 格式的日期字符串转换为 MySQL datetime 格式
  let formattedDueDate = null;
  if (due_date) {
    const date = new Date(due_date);
    formattedDueDate = date.toISOString().slice(0, 19).replace('T', ' ');
  }

  try {
    await pool.query(
      "INSERT INTO tasks (title, description, priority, due_date, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, priority, formattedDueDate, userId]
    );
    res.json({ message: "Task created" });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 更新任务（增加 priority 和 due_date）
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, completed, priority = "Medium", due_date } = req.body;

  // 转换日期格式：将 ISO 格式的日期字符串转换为 MySQL datetime 格式
  let formattedDueDate = null;
  if (due_date) {
    const date = new Date(due_date);
    formattedDueDate = date.toISOString().slice(0, 19).replace('T', ' ');
  }

  try {
    await pool.query(
      "UPDATE tasks SET title=?, description=?, completed=?, priority=?, due_date=? WHERE id=? AND user_id=?",
      [title, description, completed, priority, formattedDueDate, id, userId]
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