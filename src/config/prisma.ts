// nvm use 23.11.0
import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create PrismaClient instance
const prisma =
  global.prisma ||
  new PrismaClient({
    datasourceUrl:
      process.env.NODE_ENV === "production"
        ? process.env.PRISMA_DATABASE_URL
        : process.env.POSTGRES_URL,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

// Save PrismaClient in global object in development
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

// Handle connection errors
if (process.env.NODE_ENV !== "production") {
  prisma
    .$connect()
    .then(() => {
      console.log("Successfully connected to PostgreSQL database");
    })
    .catch((error: Error) => {
      console.error("Failed to connect to the database:", error);
    });
}

export default prisma;
