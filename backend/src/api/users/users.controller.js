// FILE: src/api/users/users.controller.js

import prisma from "../../config/prisma.js";

/**
 * Get all users with optional role filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
  try {
    const { role = 'FARMER', page = 1, limit = 10 } = req.query;

    // Build where clause for filtering - default to FARMER role
    const where = {};
    if (role && ["ADMIN", "FARMER"].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    } else {
      where.role = 'FARMER'; // Default to FARMER if invalid role
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * Get current user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          milkCollections: true,
          payments: true,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

/**
 * Get user profile by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          milkCollections: true,
          payments: true,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * Get milk collections for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserMilkCollections = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build where clause for filtering
    const where = { userId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get milk collections with pagination
    const [milkCollections, totalCount] = await Promise.all([
      prisma.milkCollection.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.milkCollection.count({ where }),
    ]);

    // Calculate summary statistics
    const summary = await prisma.milkCollection.aggregate({
      where,
      _sum: {
        quantity: true,
      },
      _avg: {
        fatPercentage: true,
        snf: true,
      },
      _count: true,
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      milkCollections,
      summary: {
        totalQuantity: summary._sum.quantity || 0,
        averageFat: summary._avg.fatPercentage || 0,
        averageSnf: summary._avg.snf || 0,
        totalRecords: summary._count,
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get user milk collections error:", error);
    res.status(500).json({ error: "Failed to fetch milk collections" });
  }
};

/**
 * Get payment history for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Build where clause for filtering
    const where = { userId };

    if (status && ["PENDING", "PAID"].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get payments with pagination
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.payment.count({ where }),
    ]);

    // Calculate summary statistics
    const summary = await prisma.payment.aggregate({
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const statusSummary = await prisma.payment.groupBy({
      by: ["status"],
      where: { userId },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      payments,
      summary: {
        totalAmount: summary._sum.amount || 0,
        totalRecords: summary._count,
        statusBreakdown: statusSummary.reduce((acc, item) => {
          acc[item.status] = {
            count: item._count,
            amount: item._sum.amount || 0,
          };
          return acc;
        }, {}),
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get user payments error:", error);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

/**
 * Create a new user (Admin only - does NOT issue JWT token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Validate role if provided
    const validRoles = ["ADMIN", "FARMER"];
    const userRole = role && validRoles.includes(role) ? role : "FARMER";

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // Hash password
    const { default: bcrypt } = await import("bcryptjs");
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Added await here

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // NOTE: We do NOT issue a JWT token here because the admin is already logged in
    // This prevents overwriting the admin's session
    res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Build update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone; // Allow clearing phone with null/empty string

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            milkCollections: true,
            payments: true,
            expenses: true,
          },
        },
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent deleting user with existing records (optional - you can modify this logic)
    const hasRecords =
      existingUser._count.milkCollections > 0 ||
      existingUser._count.payments > 0 ||
      existingUser._count.expenses > 0;

    if (hasRecords) {
      return res.status(400).json({
        error:
          "Cannot delete user with existing milk collections, payments, or expenses. Please delete associated records first.",
        details: existingUser._count,
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User deleted successfully",
      deletedUserId: id,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export {
  getAllUsers,
  getCurrentUser,
  getUserById,
  createUser,
  getUserMilkCollections,
  getUserPayments,
  updateUser,
  deleteUser,
};
