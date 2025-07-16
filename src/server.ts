// nvm use 23.11.0
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { logger } from "./utils/logger";

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

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Log when the request is received
  logger.info(`Request received: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.headers["x-request-id"] || "unknown",
  });

  // Log when the response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode < 400 ? "info" : "warn";

    logger[level](
      `Request completed: ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`,
      {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        requestId: req.headers["x-request-id"] || "unknown",
      }
    );
  });

  next();
});

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
  logger.info("Health check requested", { ip: req.ip });

  const healthInfo = {
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? "configured" : "not configured",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
  };

  res.status(200).json(healthInfo);
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

    // Log the error with request context
    logger.error(`Error handling request: ${err.message}`, err, {
      path: req.path,
      method: req.method,
      statusCode,
      requestId: req.headers["x-request-id"] || "unknown",
    });

    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }
);

// Start the server only in development mode
// In production (on Vercel), the server will be imported by api/index.js
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    logger.info(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`,
      {
        port: PORT,
        nodeEnv: process.env.NODE_ENV,
      }
    );
  });
} else {
  logger.info("Server initialized in production mode (serverless)", {
    vercelEnv: process.env.VERCEL_ENV,
  });
}

export default app;
