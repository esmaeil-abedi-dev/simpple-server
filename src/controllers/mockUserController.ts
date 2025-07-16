// nvm use 23.11.0
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Mock data
const mockUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "john",
    email: "john@example.com",
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    username: "jane",
    email: "jane@example.com",
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// @desc    Get all users (mock implementation)
// @route   GET /api/users
// @access  Public (for testing)
export const mockGetUsers = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Getting mock users...");
    res.json(mockUsers);
  }
);

// @desc    Get user by ID (mock implementation)
// @route   GET /api/users/:id
// @access  Public (for testing)
export const mockGetUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = mockUsers.find((u) => u.id === req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

// @desc    Auth user & get token (mock implementation)
// @route   POST /api/users/auth
// @access  Public
export const mockAuthUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = mockUsers.find((u) => u.email === email);

    // Simulate successful authentication (any password will work)
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: "mock-jwt-token-123456789",
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
);
