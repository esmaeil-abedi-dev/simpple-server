// nvm use 23.11.0
import express from "express";
import { uploadImage } from "../controllers/uploadController";
import { protect } from "../middleware/authMiddleware";
import uploadMiddleware from "../middleware/uploadMiddleware";

const router = express.Router();

router.post("/", protect, uploadMiddleware.single("image"), uploadImage);

export default router;
