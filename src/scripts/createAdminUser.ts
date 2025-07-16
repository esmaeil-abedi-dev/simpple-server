// nvm use 23.11.0
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await prisma.user.findUnique({
      where: {
        email: "admin@example.com",
      },
    });

    if (adminExists) {
      console.log("Admin user already exists:", adminExists.email);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
      },
    });

    console.log("Admin user created:", admin.email);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdminUser();
