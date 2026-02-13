import asyncHandler from "express-async-handler";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Total bookings
  const totalBookings = await Booking.countDocuments();

  // Bookings this month
  const monthlyBookings = await Booking.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  // Total revenue
  const revenueAgg = await Booking.aggregate([
    { $match: { paymentStatus: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  // Monthly revenue
  const monthlyRevenueAgg = await Booking.aggregate([
    {
      $match: {
        paymentStatus: "confirmed",
        createdAt: { $gte: startOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

  // Occupancy calculation (today)
  const totalRooms = await Room.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: "$totalRooms" } } },
  ]);
  const totalRoomCount = totalRooms[0]?.total || 1;

  const occupiedToday = await Booking.countDocuments({
    paymentStatus: "confirmed",
    checkIn: { $lte: today },
    checkOut: { $gt: today },
  });
  const occupancyRate = Math.round((occupiedToday / totalRoomCount) * 100);

  // Pending bookings
  const pendingBookings = await Booking.countDocuments({
    paymentStatus: "awaiting_payment",
  });

  // Recent bookings
  const recentBookings = await Booking.find()
    .populate("room", "name category")
    .sort({ createdAt: -1 })
    .limit(10);

  // Booking status breakdown
  const statusBreakdown = await Booking.aggregate([
    { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
  ]);

  // Category breakdown
  const categoryBreakdown = await Booking.aggregate([
    {
      $lookup: {
        from: "rooms",
        localField: "room",
        foreignField: "_id",
        as: "roomDetails",
      },
    },
    { $unwind: "$roomDetails" },
    {
      $group: {
        _id: "$roomDetails.category",
        count: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalBookings,
        monthlyBookings,
        totalRevenue,
        monthlyRevenue,
        occupancyRate,
        pendingBookings,
        totalRooms: totalRoomCount,
      },
      recentBookings,
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      categoryBreakdown,
    },
  });
});

// ========== ROOM MANAGEMENT ==========

/**
 * @desc    Get all rooms (admin)
 * @route   GET /api/admin/rooms
 * @access  Private
 */
export const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/**
 * @desc    Create new room
 * @route   POST /api/admin/rooms
 * @access  Private
 */
export const createRoom = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    pricePerNight,
    images,
    totalRooms,
    maxGuests,
    amenities,
    category,
  } = req.body;

  const room = await Room.create({
    name,
    description,
    pricePerNight,
    images: images || [],
    totalRooms,
    maxGuests,
    amenities: amenities || [],
    category,
  });

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

/**
 * @desc    Update room
 * @route   PUT /api/admin/rooms/:id
 * @access  Private
 */
export const updateRoom = asyncHandler(async (req, res) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

/**
 * @desc    Delete room
 * @route   DELETE /api/admin/rooms/:id
 * @access  Private
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Check for active bookings
  const activeBookings = await Booking.countDocuments({
    room: room._id,
    paymentStatus: { $in: ["awaiting_payment", "confirmed"] },
  });

  if (activeBookings > 0) {
    res.status(400);
    throw new Error("Cannot delete room with active bookings");
  }

  await room.deleteOne();

  res.json({
    success: true,
    message: "Room deleted successfully",
  });
});

/**
 * @desc    Update room discount
 * @route   PUT /api/admin/rooms/:id/discount
 * @access  Private
 */
export const updateRoomDiscount = asyncHandler(async (req, res) => {
  const { isActive, percentage, startDate, endDate } = req.body;

  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  room.seasonalDiscount = {
    isActive: isActive || false,
    percentage: percentage || 0,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
  };

  await room.save();

  res.json({
    success: true,
    message: "Discount updated successfully",
    data: room,
  });
});

// ========== BOOKING MANAGEMENT ==========

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/admin/bookings
 * @access  Private
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const {
    status,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = req.query;

  let query = {};

  // Filter by status
  if (status) {
    query.paymentStatus = status;
  }

  // Search by guest name, email, or booking reference
  if (search) {
    query.$or = [
      { guestName: { $regex: search, $options: "i" } },
      { guestEmail: { $regex: search, $options: "i" } },
      { bookingReference: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by date range
  if (startDate || endDate) {
    query.checkIn = {};
    if (startDate) query.checkIn.$gte = new Date(startDate);
    if (endDate) query.checkIn.$lte = new Date(endDate);
  }

  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .populate("room", "name category images")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: bookings,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit),
    },
  });
});

/**
 * @desc    Update booking status
 * @route   PUT /api/admin/bookings/:id/status
 * @access  Private
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (
    !["awaiting_payment", "confirmed", "cancelled", "expired"].includes(status)
  ) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const booking = await Booking.findById(req.params.id).populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.paymentStatus = status;
  if (status === "confirmed") {
    booking.confirmedAt = new Date();
    booking.verificationCode = undefined;
  }
  await booking.save();

  res.json({
    success: true,
    message: `Booking status updated to ${status}`,
    data: booking,
  });
});

/**
 * @desc    Get single booking details
 * @route   GET /api/admin/bookings/:id
 * @access  Private
 */
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.json({
    success: true,
    data: booking,
  });
});

/**
 * @desc    Get verification code for a pending booking
 * @route   GET /api/admin/bookings/:id/verification-code
 * @access  Private
 */
export const getVerificationCode = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.paymentStatus !== "awaiting_payment") {
    res.status(400);
    throw new Error("Can only view code for awaiting payment bookings");
  }

  if (!booking.verificationCode) {
    res.status(400);
    throw new Error("No verification code available for this booking");
  }

  // Check if expired
  if (booking.isExpired) {
    res.status(400);
    throw new Error("This booking has expired");
  }

  res.json({
    success: true,
    message: "Verification code retrieved",
    data: {
      verificationCode: booking.verificationCode,
      expiresAt: booking.expiresAt,
      bookingReference: booking.bookingReference,
      guestEmail: booking.guestEmail,
    },
  });
});
