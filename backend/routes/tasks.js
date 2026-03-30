import express from "express";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, getNotifications, getDueReminders, markReminderNotified } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/notifications", authMiddleware, getNotifications);
router.get("/reminders", authMiddleware, getDueReminders);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.put("/:id/status", authMiddleware, updateTaskStatus);
router.put("/:id/reminder-notified", authMiddleware, markReminderNotified);

export default router;