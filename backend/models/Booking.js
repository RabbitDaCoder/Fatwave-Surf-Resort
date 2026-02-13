import mongoose from "mongoose";
import crypto from "crypto";

/**
 * Booking Schema for Fatwave Surf Resort
 * Uses verification codes for manual payment confirmation
 */
const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      index: true,
      // Auto-generated in pre-save hook
    },
    verificationCode: {
      type: String,
      unique: true,
      sparse: true, // Allows null values after confirmation
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room selection is required"],
    },
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
      maxlength: [100, "Guest name cannot exceed 100 characters"],
    },
    guestEmail: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    nights: {
      type: Number,
      required: true,
      min: [1, "Minimum 1 night stay"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["awaiting_payment", "confirmed", "cancelled", "expired"],
      default: "awaiting_payment",
    },
    expiresAt: {
      type: Date,
      // Auto-generated in pre-save hook (6 hours from creation)
    },
    confirmedAt: {
      type: Date,
    },
    specialRequests: {
      type: String,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    receiptSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Virtual: Check if booking is expired
 */
bookingSchema.virtual("isExpired").get(function () {
  return (
    this.paymentStatus === "awaiting_payment" && new Date() > this.expiresAt
  );
});

/**
 * Generate unique booking reference
 * Format: FW-YYYY-NNNNN (e.g., FW-2026-00045)
 */
async function generateBookingReference() {
  const year = new Date().getFullYear();
  const prefix = `FW-${year}`;

  // Find the last booking of the current year
  const lastBooking = await mongoose
    .model("Booking")
    .findOne({ bookingReference: new RegExp(`^${prefix}`) })
    .sort({ bookingReference: -1 });

  let sequenceNumber = 1;

  if (lastBooking) {
    const lastSequence = parseInt(lastBooking.bookingReference.split("-")[2]);
    sequenceNumber = lastSequence + 1;
  }

  return `${prefix}-${String(sequenceNumber).padStart(5, "0")}`;
}

/**
 * Generate unique verification code (8 hex characters)
 */
function generateVerificationCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

/**
 * Pre-save middleware: Generate booking reference, verification code, and expiration
 */
bookingSchema.pre("save", async function (next) {
  // Generate booking reference if new document
  if (this.isNew && !this.bookingReference) {
    this.bookingReference = await generateBookingReference();
  }

  // Generate verification code if new document
  if (this.isNew && !this.verificationCode) {
    this.verificationCode = generateVerificationCode();
  }

  // Set expiration time if new document (6 hours)
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);
  }

  // Calculate nights
  if (this.checkIn && this.checkOut) {
    const checkIn = new Date(this.checkIn);
    const checkOut = new Date(this.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  next();
});

/**
 * Pre-save validation: Check-out date must be after check-in date
 */
bookingSchema.pre("save", function (next) {
  if (this.checkOut <= this.checkIn) {
    next(new Error("Check-out date must be after check-in date"));
  }
  next();
});

/**
 * Instance method: Confirm booking
 */
bookingSchema.methods.confirmBooking = function () {
  this.paymentStatus = "confirmed";
  this.verificationCode = undefined; // Remove code after confirmation
  this.confirmedAt = new Date();
  return this.save();
};

/**
 * Instance method: Mark as expired
 */
bookingSchema.methods.markAsExpired = function () {
  this.paymentStatus = "expired";
  this.verificationCode = undefined;
  return this.save();
};

/**
 * Static method: Find expired bookings
 */
bookingSchema.statics.findExpired = function () {
  return this.find({
    paymentStatus: "awaiting_payment",
    expiresAt: { $lt: new Date() },
  });
};

/**
 * Static method: Check room availability for date range
 */
bookingSchema.statics.checkAvailability = async function (
  roomId,
  checkIn,
  checkOut,
  excludeBookingId = null,
) {
  const query = {
    room: roomId,
    paymentStatus: { $in: ["awaiting_payment", "confirmed"] },
    $or: [
      { checkIn: { $lt: checkOut, $gte: checkIn } },
      { checkOut: { $gt: checkIn, $lte: checkOut } },
      { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await this.countDocuments(query);
  const Room = mongoose.model("Room");
  const room = await Room.findById(roomId);

  return {
    isAvailable: conflictingBookings < (room?.totalRooms || 0),
    bookedCount: conflictingBookings,
    totalRooms: room?.totalRooms || 0,
  };
};

// Indexes for efficient querying
bookingSchema.index({ guestEmail: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ expiresAt: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
