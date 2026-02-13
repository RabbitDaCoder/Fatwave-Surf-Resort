import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getDashboard,
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomDiscount,
  getAllBookings,
  updateBookingStatus,
  getBookingById,
  getVerificationCode,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes are protected
router.use(protect);

// Dashboard
router.get("/dashboard", getDashboard);

// Rooms management
router.get("/rooms", getAllRooms);
router.post("/rooms", createRoom);
router.put("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);
router.put("/rooms/:id/discount", updateRoomDiscount);

// Bookings management
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingById);
router.put("/bookings/:id/status", updateBookingStatus);
router.get("/bookings/:id/verification-code", getVerificationCode);

export default router;
