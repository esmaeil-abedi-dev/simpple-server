// nvm use 23.11.0
import express from "express";
import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getTotalSales,
  getTotalSalesByDate,
} from "../controllers/orderController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// Private routes
router.post("/", protect, createOrder);
router.get("/mine", protect, getUserOrders);
router.get("/:id", protect, getOrderById);

// Admin routes
router.get("/", protect, admin, getOrders);
router.put("/:id/pay", protect, admin, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.get("/total-sales", protect, admin, getTotalSales);
router.get("/total-sales-by-date", protect, admin, getTotalSalesByDate);

export default router;
