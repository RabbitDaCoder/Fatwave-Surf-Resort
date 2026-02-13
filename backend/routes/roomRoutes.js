import express from "express";
import {
  getRooms,
  getRoomBySlug,
  checkAvailability,
} from "../controllers/roomController.js";

const router = express.Router();

// Public routes
router.get("/", getRooms);
router.get("/:slug", getRoomBySlug);
router.get("/:slug/availability", checkAvailability);

export default router;
