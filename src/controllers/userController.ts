// nvm use 23.11.0
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { generateToken, setCookieWithToken } from "../utils/jwt";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, confirm_Password } = req.body;

    // Validation
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    if (password !== confirm_Password) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    if (user) {
      // Generate token
      const token = generateToken(user.id);

      // Set JWT cookie
      setCookieWithToken(res, token);

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
);

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Check if user exists and password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate token
    const token = generateToken(user.id);

    // Set JWT cookie
    setCookieWithToken(res, token);

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (user) {
      const { username, email, password } = req.body;

      // Update user data
      const updatedUserData: any = {
        username: username || user.username,
        email: email || user.email,
      };

      // If password is provided, hash it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedUserData.password = await bcrypt.hash(password, salt);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: updatedUserData,
      });

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin (temporarily made public)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log("Getting all users...");
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    res.json(users);
  } catch (error: any) {
    console.error("Error in getUsers:", error.message);
    console.error("Error details:", error);
    res.status(500).json({
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (user) {
    const { username, email, isAdmin } = req.body;

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        username: username || user.username,
        email: email || user.email,
        isAdmin: typeof isAdmin !== "undefined" ? isAdmin : user.isAdmin,
      },
    });

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (user) {
    // Can't delete yourself
    if (user.id === req.user.id) {
      res.status(400);
      throw new Error("Cannot delete your own account");
    }

    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Change user role
// @route   PATCH /api/users/role/:id
// @access  Private/Admin
export const changeUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (user) {
      const { isAdmin } = req.body;

      // Update user role
      const updatedUser = await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isAdmin: typeof isAdmin !== "undefined" ? isAdmin : user.isAdmin,
        },
      });

      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);
