const express = require("express");
const {
  getProfile,
  getBookings,
  getPendingAppointments,
  updateBookingStatus,
  scheduleNextDay,
  updateProfile,
} = require("../controllers/doctorController");
const { authMiddleware, isDoctor } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication and doctor role
router.use(authMiddleware, isDoctor);

// @route   GET /api/doctor/profile
router.get("/profile", getProfile);

// @route   GET /api/doctor/bookings
router.get("/bookings", getBookings);

// @route   GET /api/doctor/pending-appointments
router.get("/pending-appointments", getPendingAppointments);

// @route   PATCH /api/doctor/update-status/:id
router.patch("/update-status/:id", updateBookingStatus);

// @route   PATCH /api/doctor/schedule-next-day/:id
router.patch("/schedule-next-day/:id", scheduleNextDay);

// @route   PATCH /api/doctor/update-profile
router.patch("/update-profile", updateProfile);

module.exports = router;
