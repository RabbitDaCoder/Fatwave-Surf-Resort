import mongoose from "mongoose";
import slugify from "slugify";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      maxlength: [100, "Room name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Room description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price cannot be negative"],
    },
    images: [
      {
        type: String,
      },
    ],
    totalRooms: {
      type: Number,
      required: [true, "Total rooms is required"],
      min: [1, "Must have at least 1 room"],
    },
    maxGuests: {
      type: Number,
      required: [true, "Max guests is required"],
      min: [1, "Must accommodate at least 1 guest"],
    },
    amenities: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["surf-room", "villa", "beachfront", "dorm"],
        message: "Category must be surf-room, villa, beachfront, or dorm",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seasonalDiscount: {
      isActive: {
        type: Boolean,
        default: false,
      },
      percentage: {
        type: Number,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
        default: 0,
      },
      startDate: Date,
      endDate: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug before saving
roomSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Virtual for calculating current price with discount
roomSchema.virtual("currentPrice").get(function () {
  const now = new Date();
  if (
    this.seasonalDiscount.isActive &&
    this.seasonalDiscount.startDate <= now &&
    this.seasonalDiscount.endDate >= now
  ) {
    const discountAmount =
      (this.pricePerNight * this.seasonalDiscount.percentage) / 100;
    return this.pricePerNight - discountAmount;
  }
  return this.pricePerNight;
});

// Ensure virtuals are included in JSON
roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

const Room = mongoose.model("Room", roomSchema);

export default Room;
