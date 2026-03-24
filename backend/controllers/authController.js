import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";

const normalizeLoginId = (value) => String(value || "").trim().toLowerCase();

// ------------------------
// 登录 login
// ------------------------
export const login = async (req, res) => {
  const { username, email, password } = req.body;
  const loginId = normalizeLoginId(email || username);

  if (!loginId || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE LOWER(TRIM(username))=? OR LOWER(TRIM(email))=?",
      [loginId, loginId]
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username=?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    return res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------------
// 注册 register（防崩溃）
// ------------------------
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const finalEmail = normalizeLoginId(email || username);
  const finalUsername = String(username || email || "").trim();
  const normalizedUsername = normalizeLoginId(finalUsername);

  if (!finalUsername || !finalEmail || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    // 检查用户是否已存在
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE LOWER(TRIM(username))=? OR LOWER(TRIM(email))=?",
      [normalizedUsername, finalEmail]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [finalUsername, finalEmail, hashed]
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );

    return res.json({ message: "User registered" });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
