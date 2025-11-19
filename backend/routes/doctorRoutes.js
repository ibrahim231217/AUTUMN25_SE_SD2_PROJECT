const express = require("express");
const {
  getBookings,
  updateBookingStatus,
  updateProfile,
} = require("../controllers/doctorController");
const { authMiddleware, isDoctor } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication and doctor role
router.use(authMiddleware, isDoctor);

// @route   GET /api/doctor/bookings
router.get("/bookings", getBookings);

// @route   PATCH /api/doctor/update-status/:id
router.patch("/update-status/:id", updateBookingStatus);

// @route   PATCH /api/doctor/update-profile
router.patch("/update-profile", updateProfile);

module.exports = router;
