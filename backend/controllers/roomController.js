import asyncHandler from "express-async-handler";
import Room from "../models/Room.js";

/**
 * @desc    Get all active rooms
 * @route   GET /api/rooms
 * @access  Public
 */
export const getRooms = asyncHandler(async (req, res) => {
  const { category, guests, minPrice, maxPrice, search } = req.query;

  let query = { isActive: true };

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by max guests
  if (guests) {
    query.maxGuests = { $gte: parseInt(guests) };
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = parseInt(minPrice);
    if (maxPrice) query.pricePerNight.$lte = parseInt(maxPrice);
  }

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const rooms = await Room.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/**
 * @desc    Get single room by slug
 * @route   GET /api/rooms/:slug
 * @access  Public
 */
export const getRoomBySlug = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ slug: req.params.slug, isActive: true });

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.json({
    success: true,
    data: room,
  });
});

/**
 * @desc    Check room availability
 * @route   GET /api/rooms/:slug/availability
 * @access  Public
 */
export const checkAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    res.status(400);
    throw new Error("Please provide check-in and check-out dates");
  }

  const room = await Room.findOne({ slug: req.params.slug, isActive: true });

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Import Booking model to check existing bookings
  const Booking = (await import("../models/Booking.js")).default;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Count overlapping confirmed bookings
  const overlappingBookings = await Booking.countDocuments({
    room: room._id,
    status: { $in: ["pending", "confirmed"] },
    $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }],
  });

  const availableRooms = room.totalRooms - overlappingBookings;
  const isAvailable = availableRooms > 0;

  res.json({
    success: true,
    data: {
      isAvailable,
      availableRooms,
      totalRooms: room.totalRooms,
      currentPrice: room.currentPrice,
    },
  });
});
