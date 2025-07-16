// nvm use 23.11.0
import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient
const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

// Save the PrismaClient in global object in development to prevent multiple instances
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

// Handle connection errors
if (process.env.NODE_ENV !== "production") {
  prisma
    .$connect()
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((error: Error) => {
      console.error("Failed to connect to the database:", error);
    });
}

export default prisma;
