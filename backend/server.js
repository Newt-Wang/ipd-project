import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import notificationRoutes from "./routes/notifications.js";
import {
  ensureReminderSchema,
  startReminderScheduler,
} from "./services/reminderService.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

const boot = async () => {
  try {
    await ensureReminderSchema();
    startReminderScheduler();
    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  } catch (err) {
    console.error("Server boot failed:", err);
    process.exit(1);
  }
};

boot();
