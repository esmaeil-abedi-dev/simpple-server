// nvm use 23.11.0
import express from "express";
import {
  createProduct,
  getProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getNewProducts,
  getFilteredProducts,
} from "../controllers/productController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/allproducts", getAllProducts);
router.get("/top", getTopProducts);
router.get("/sort/new", getNewProducts);
router.post("/filtered", getFilteredProducts);
router.get("/:id", getProductById);

// Private routes
router.post("/:id/reviews", protect, createProductReview);

// Admin routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
