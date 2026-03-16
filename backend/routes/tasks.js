import express from "express";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.put("/:id/status", authMiddleware, updateTaskStatus);

export default router;