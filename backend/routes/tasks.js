import express from "express";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, getNotifications } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/notifications", authMiddleware, getNotifications);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.put("/:id/status", authMiddleware, updateTaskStatus);

export default router;