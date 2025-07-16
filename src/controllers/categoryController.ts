// nvm use 23.11.0
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../config/prisma";

// @desc    Create a new category
// @route   POST /api/category
// @access  Private/Admin
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Please provide a category name");
    }

    // Check if category already exists
    const categoryExists = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists");
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json(category);
  }
);

// @desc    Get all categories
// @route   GET /api/category/categories
// @access  Public
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(categories);
  }
);

// @desc    Get a category by ID
// @route   GET /api/category/:id
// @access  Public
export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        products: true,
      },
    });

    if (category) {
      res.json(category);
    } else {
      res.status(404);
      throw new Error("Category not found");
    }
  }
);

// @desc    Update a category
// @route   PUT /api/category/:categoryId
// @access  Private/Admin
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Please provide a category name");
    }

    const category = await prisma.category.findUnique({
      where: {
        id: req.params.categoryId,
      },
    });

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    // Check if another category with the same name exists
    const categoryExists = await prisma.category.findFirst({
      where: {
        AND: [
          {
            name: {
              equals: name,
              mode: "insensitive",
            },
          },
          {
            id: {
              not: req.params.categoryId,
            },
          },
        ],
      },
    });

    if (categoryExists) {
      res.status(400);
      throw new Error("Category with this name already exists");
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: {
        id: req.params.categoryId,
      },
      data: {
        name,
      },
    });

    res.json(updatedCategory);
  }
);

// @desc    Delete a category
// @route   DELETE /api/category/:categoryId
// @access  Private/Admin
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: {
        id: req.params.categoryId,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    // Check if category has products
    if (category.products.length > 0) {
      res.status(400);
      throw new Error("Cannot delete category with products");
    }

    // Delete category
    await prisma.category.delete({
      where: {
        id: req.params.categoryId,
      },
    });

    res.json({ message: "Category removed" });
  }
);
