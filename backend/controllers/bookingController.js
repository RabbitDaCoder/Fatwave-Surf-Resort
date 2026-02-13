import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import {
  sendBookingConfirmationEmail,
  sendNewBookingNotification,
  sendReceiptEmail,
} from "../services/emailService.js";
import { generateReceiptPDF } from "../services/pdfService.js";
import { calculateNights } from "../utils/helpers.js";

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Public
 */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    roomId,
    guestName,
    email,
    guestEmail,
    checkIn,
    checkOut,
    guests,
    specialRequests,
  } = req.body;

  // Support both 'email' and 'guestEmail' field names
  const emailAddress = email || guestEmail;

  // Handle guests as number or object {adults, children}
  let guestCount;
  if (typeof guests === "object" && guests !== null) {
    guestCount = (guests.adults || 0) + (guests.children || 0);
  } else {
    guestCount = guests;
  }

  // Validate required fields with specific error messages
  const missingFields = [];
  if (!roomId) missingFields.push("roomId");
  if (!guestName) missingFields.push("guestName");
  if (!emailAddress) missingFields.push("email");
  if (!checkIn) missingFields.push("checkIn");
  if (!checkOut) missingFields.push("checkOut");
  if (!guestCount) missingFields.push("guests");

  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Find the room
  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Validate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    res.status(400);
    throw new Error("Check-in date cannot be in the past");
  }

  if (checkOutDate <= checkInDate) {
    res.status(400);
    throw new Error("Check-out date must be after check-in date");
  }

  // Validate guests
  if (guestCount > room.maxGuests) {
    res.status(400);
    throw new Error(`This room accommodates maximum ${room.maxGuests} guests`);
  }

  // Check availability using the static method
  const availability = await Booking.checkAvailability(
    room._id,
    checkInDate,
    checkOutDate,
  );

  if (!availability.isAvailable) {
    res.status(400);
    throw new Error("No rooms available for selected dates");
  }

  // Calculate total price
  const nights = calculateNights(checkInDate, checkOutDate);
  const pricePerNight = room.currentPrice;
  const totalPrice = pricePerNight * nights;

  // Create booking (verificationCode and bookingReference auto-generated)
  const booking = await Booking.create({
    room: room._id,
    guestName,
    guestEmail: emailAddress,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights,
    guests: guestCount,
    totalPrice,
    specialRequests: specialRequests || "",
  });

  // Populate room details
  await booking.populate("room");

  // Send notification emails (non-blocking)
  sendNewBookingNotification(booking, room).catch((err) =>
    console.error("Admin email error:", err),
  );

  res.status(201).json({
    success: true,
    message:
      "Booking created successfully. Please complete payment to confirm.",
    data: booking,
  });
});

/**
 * @desc    Get booking by reference number
 * @route   GET /api/bookings/:bookingReference
 * @access  Public
 */
export const getBookingByReference = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    bookingReference: req.params.bookingReference.toUpperCase(),
  }).populate("room");

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
 * @desc    Confirm booking with verification code
 * @route   POST /api/bookings/confirm
 * @access  Public
 */
export const confirmBookingWithCode = asyncHandler(async (req, res) => {
  const { verificationCode, email } = req.body;

  if (!verificationCode || !email) {
    res.status(400);
    throw new Error("Verification code and email are required");
  }

  const codeUpper = verificationCode.toUpperCase().trim();
  const emailLower = email.toLowerCase().trim();

  // Find booking with this verification code
  const booking = await Booking.findOne({
    verificationCode: codeUpper,
  }).populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Invalid verification code. Please check and try again.");
  }

  // Validate email matches
  if (booking.guestEmail.toLowerCase() !== emailLower) {
    res.status(400);
    throw new Error(
      "Email does not match the booking. Please check and try again.",
    );
  }

  // Check if booking already confirmed
  if (booking.paymentStatus === "confirmed") {
    res.status(400);
    throw new Error("This booking has already been confirmed.");
  }

  // Check if booking expired
  if (booking.isExpired || booking.paymentStatus === "expired") {
    res.status(400);
    throw new Error("This booking has expired. Please create a new booking.");
  }

  // Check if booking cancelled
  if (booking.paymentStatus === "cancelled") {
    res.status(400);
    throw new Error("This booking has been cancelled.");
  }

  // Confirm the booking using instance method
  await booking.confirmBooking();

  // Generate PDF and send confirmation email
  try {
    const pdfBuffer = await generateReceiptPDF(booking, booking.room);
    await sendReceiptEmail(booking, booking.room, pdfBuffer);
    booking.receiptSent = true;
    await booking.save();
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }

  // Send confirmation email
  sendBookingConfirmationEmail(booking, booking.room).catch((err) =>
    console.error("Confirmation email error:", err),
  );

  res.json({
    success: true,
    message:
      "Booking confirmed successfully! A confirmation email has been sent.",
    data: booking,
  });
});

/**
 * @desc    Send receipt email
 * @route   POST /api/bookings/send-receipt
 * @access  Public
 */
export const sendReceipt = asyncHandler(async (req, res) => {
  const { bookingReference } = req.body;

  if (!bookingReference) {
    res.status(400);
    throw new Error("Booking reference is required");
  }

  const booking = await Booking.findOne({
    bookingReference: bookingReference.toUpperCase(),
  }).populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Generate PDF
  const pdfBuffer = await generateReceiptPDF(booking, booking.room);

  // Send email with PDF
  const emailSent = await sendReceiptEmail(booking, booking.room, pdfBuffer);

  if (emailSent) {
    booking.receiptSent = true;
    await booking.save();

    res.json({
      success: true,
      message: "Receipt sent successfully to " + booking.guestEmail,
    });
  } else {
    res.status(500);
    throw new Error("Failed to send receipt email");
  }
});

/**
 * @desc    Download PDF receipt
 * @route   GET /api/bookings/:bookingReference/receipt
 * @access  Public
 */
export const downloadReceipt = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    bookingReference: req.params.bookingReference.toUpperCase(),
  }).populate("room");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Generate PDF
  const pdfBuffer = await generateReceiptPDF(booking, booking.room);

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Fatwave_Reservation_${booking.bookingReference}.pdf`,
  );

  res.send(pdfBuffer);
});
