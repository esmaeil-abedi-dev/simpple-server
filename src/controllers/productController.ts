// nvm use 23.11.0
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../config/prisma";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, category, quantity, image } = req.body;

    if (!name || !description || !price || !category) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: category,
      },
    });

    if (!categoryExists) {
      res.status(404);
      throw new Error("Category not found");
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 0,
        image,
        category: {
          connect: {
            id: category,
          },
        },
      },
    });

    res.status(201).json(product);
  }
);

// @desc    Get all products (with pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.size as string) || 10;
  const skip = (page - 1) * pageSize;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: pageSize,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.count(),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(total / pageSize),
    total,
  });
});

// @desc    Get all products without pagination
// @route   GET /api/products/allproducts
// @access  Public
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  }
);

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  }
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, category, quantity, image } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Check if category exists
    if (category) {
      const categoryExists = await prisma.category.findUnique({
        where: {
          id: category,
        },
      });

      if (!categoryExists) {
        res.status(404);
        throw new Error("Category not found");
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: name || product.name,
        description: description || product.description,
        price: price ? parseFloat(price) : product.price,
        quantity: quantity ? parseInt(quantity) : product.quantity,
        image: image || product.image,
        ...(category && {
          category: {
            connect: {
              id: category,
            },
          },
        }),
      },
    });

    res.json(updatedProduct);
  }
);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Delete product reviews first
    await prisma.review.deleteMany({
      where: {
        productId: req.params.id,
      },
    });

    // Delete product
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "Product removed" });
  }
);

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { rating, comment } = req.body;

    if (!rating) {
      res.status(400);
      throw new Error("Please provide a rating");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        reviews: true,
      },
    });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Check if user already reviewed the product
    const alreadyReviewed = product.reviews.some(
      (review: any) => review.userId === req.user.id
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this product");
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || "",
        user: {
          connect: {
            id: req.user.id,
          },
        },
        product: {
          connect: {
            id: req.params.id,
          },
        },
      },
    });

    // Update product rating
    const updatedReviews = await prisma.review.findMany({
      where: {
        productId: req.params.id,
      },
    });

    const totalRating = updatedReviews.reduce(
      (acc: number, item: any) => acc + item.rating,
      0
    );
    const avgRating = totalRating / updatedReviews.length;

    await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        rating: avgRating,
        numReviews: updatedReviews.length,
      },
    });

    res.status(201).json({ message: "Review added" });
  }
);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      take: 5,
      orderBy: {
        rating: "desc",
      },
      include: {
        category: true,
      },
    });

    res.json(products);
  }
);

// @desc    Get new products
// @route   GET /api/products/sort/new
// @access  Public
export const getNewProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    res.json(products);
  }
);

// @desc    Get filtered products
// @route   POST /api/products/filtered
// @access  Public
export const getFilteredProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { categories, price } = req.body;

    const filterConditions: any = {};

    // Filter by categories
    if (categories && categories.length > 0) {
      filterConditions.categoryId = {
        in: categories,
      };
    }

    // Filter by price range
    if (price && price.length === 2) {
      filterConditions.price = {
        gte: parseFloat(price[0]),
        lte: parseFloat(price[1]),
      };
    }

    const products = await prisma.product.findMany({
      where: filterConditions,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  }
);
