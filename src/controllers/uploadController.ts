// nvm use 23.11.0
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import path from "path";

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  res.json({
    message: "Image uploaded successfully",
    image: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});
