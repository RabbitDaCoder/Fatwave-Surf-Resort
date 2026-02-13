import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find admin by email
  const admin = await Admin.findOne({ email });

  if (!admin) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check password
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    success: true,
    data: {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
});

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");

  res.json({
    success: true,
    data: admin,
  });
});

/**
 * @desc    Register new admin (for initial setup only)
 * @route   POST /api/auth/register
 * @access  Public (should be disabled in production)
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if any admin exists
  const adminCount = await Admin.countDocuments();

  if (adminCount > 0 && process.env.NODE_ENV === "production") {
    res.status(403);
    throw new Error("Admin registration is disabled");
  }

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });

  if (existingAdmin) {
    res.status(400);
    throw new Error("Admin already exists with this email or username");
  }

  // Create admin
  const admin = await Admin.create({
    username,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
});
