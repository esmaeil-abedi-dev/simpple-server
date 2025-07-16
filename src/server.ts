// nvm use 23.11.0
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// Import routes
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import uploadRoutes from "./routes/uploadRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true,
  })
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? "configured" : "not configured",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Simpple Server API is running",
    version: "1.0.0",
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// 404 - Route not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
