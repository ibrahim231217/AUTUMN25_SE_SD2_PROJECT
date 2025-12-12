const express = require("express");
const {
  getProfile,
  getDoctors,
  bookAppointment,
  getBookings,
  updateProfile,
  updatePassword,
  cancelBooking,
  updateBooking,
} = require("../controllers/patientController");
const { authMiddleware, isPatient } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication and patient role
router.use(authMiddleware, isPatient);

// @route   GET /api/patient/profile
router.get("/profile", getProfile);

// @route   GET /api/patient/doctors
router.get("/doctors", getDoctors);

// @route   POST /api/patient/book
router.post("/book", bookAppointment);

// @route   GET /api/patient/bookings
router.get("/bookings", getBookings);

// @route   PATCH /api/patient/update-profile
router.patch("/update-profile", updateProfile);

// @route   PATCH /api/patient/update-password
router.patch("/update-password", updatePassword);

// @route   PATCH /api/patient/booking/:id/cancel
router.patch("/booking/:id/cancel", cancelBooking);

// @route   PATCH /api/patient/booking/:id
router.patch("/booking/:id", updateBooking);

module.exports = router;
