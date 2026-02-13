import express from "express";
import {
  createBooking,
  getBookingByReference,
  sendReceipt,
  downloadReceipt,
  confirmBookingWithCode,
} from "../controllers/bookingController.js";

const router = express.Router();

// Public routes
router.post("/", createBooking);
router.post("/confirm", confirmBookingWithCode);
router.get("/:bookingReference", getBookingByReference);
router.get("/:bookingReference/receipt", downloadReceipt);
router.post("/send-receipt", sendReceipt);

export default router;
