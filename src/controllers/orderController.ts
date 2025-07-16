// nvm use 23.11.0
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../config/prisma";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Get product details and calculate prices
  let totalPrice = 0;
  const orderItemsData = [];

  for (const item of orderItems) {
    const product = await prisma.product.findUnique({
      where: {
        id: item._id,
      },
    });

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item._id}`);
    }

    // Check if quantity is available
    if (product.quantity < item.qty) {
      res.status(400);
      throw new Error(`Not enough ${product.name} in stock`);
    }

    // Calculate item price
    const itemPrice = product.price * item.qty;
    totalPrice += itemPrice;

    orderItemsData.push({
      name: product.name,
      qty: item.qty,
      price: product.price,
      productId: product.id,
    });

    // Update product quantity
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        quantity: product.quantity - item.qty,
      },
    });
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      user: {
        connect: {
          id: req.user.id,
        },
      },
      orderItems: {
        create: orderItemsData,
      },
      shippingAddress,
      paymentMethod,
      totalPrice,
    },
    include: {
      orderItems: true,
    },
  });

  res.status(201).json(order);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      orderItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
export const getUserOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(orders);
  }
);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (order) {
      // Check if the order belongs to the logged in user or admin
      if (req.user.isAdmin || order.userId === req.user.id) {
        res.json(order);
      } else {
        res.status(401);
        throw new Error("Not authorized");
      }
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  }
);

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (order) {
      // Update order
      const updatedOrder = await prisma.order.update({
        where: {
          id: req.params.id,
        },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  }
);

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (order) {
      // Update order
      const updatedOrder = await prisma.order.update({
        where: {
          id: req.params.id,
        },
        data: {
          isDelivered: true,
          deliveredAt: new Date(),
        },
      });

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  }
);

// @desc    Get total sales
// @route   GET /api/orders/total-sales
// @access  Private/Admin
export const getTotalSales = asyncHandler(
  async (req: Request, res: Response) => {
    const totalSales = await prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        isPaid: true,
      },
    });

    const orderCount = await prisma.order.count({
      where: {
        isPaid: true,
      },
    });

    res.json({
      totalSales: totalSales._sum.totalPrice || 0,
      orderCount,
    });
  }
);

// @desc    Get total sales by date
// @route   GET /api/orders/total-sales-by-date
// @access  Private/Admin
export const getTotalSalesByDate = asyncHandler(
  async (req: Request, res: Response) => {
    // Get orders from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await prisma.order.findMany({
      where: {
        isPaid: true,
        paidAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        totalPrice: true,
        paidAt: true,
      },
    });

    // Group orders by date
    const salesByDate: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      salesByDate[dateStr] = 0;
    }

    orders.forEach((order: any) => {
      if (order.paidAt) {
        const dateStr = order.paidAt.toISOString().split("T")[0];
        if (salesByDate[dateStr] !== undefined) {
          salesByDate[dateStr] += order.totalPrice;
        }
      }
    });

    // Convert to array for frontend
    const result = Object.keys(salesByDate)
      .map((date) => ({
        date,
        sales: salesByDate[date],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json(result);
  }
);
