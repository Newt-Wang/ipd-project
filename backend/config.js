import dotenv from "dotenv";

const envResult = dotenv.config();
if (envResult.error) {
  dotenv.config({ path: ".env.example" });
}

const asBool = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return String(value).trim().toLowerCase() === "true";
};

export default {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    // password: process.env.DB_PASSWORD || "123456",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "task_manager",
  },

  jwtSecret: process.env.JWT_SECRET || "MY_SECRET_KEY_123456",
  email: {
    enabled: asBool(process.env.EMAIL_ENABLED, false),
    host: process.env.EMAIL_HOST || "smtp.qq.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: asBool(process.env.EMAIL_SECURE, true),
    user: process.env.EMAIL_USER || "2627418408@qq.com",
    pass: process.env.EMAIL_PASS || "urixqcdrlmnoebjd",
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "Task Manager <2627418408@qq.com>",
  },
};
