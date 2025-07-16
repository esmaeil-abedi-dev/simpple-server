// nvm use 23.11.0
import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/:id", getCategoryById);

// Admin routes
router.post("/", protect, admin, createCategory);
router.put("/:categoryId", protect, admin, updateCategory);
router.delete("/:categoryId", protect, admin, deleteCategory);

export default router;
