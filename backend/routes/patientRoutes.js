const express = require("express");
const {
  getProfile,
  getDoctors,
  bookAppointment,
  getBookings,
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

module.exports = router;
