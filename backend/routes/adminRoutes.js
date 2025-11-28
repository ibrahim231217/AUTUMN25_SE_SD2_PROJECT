const express = require("express");
const {
  addAdmin,
  addDoctor,
  getDoctors,
  getAllBookings,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware, isAdmin);

// @route   POST /api/admin/add-admin
router.post("/add-admin", addAdmin);

// @route   POST /api/admin/add-doctor
router.post("/add-doctor", addDoctor);

// @route   GET /api/admin/doctors
router.get("/doctors", getDoctors);

// @route   GET /api/admin/bookings
router.get("/bookings", getAllBookings);

// @route   PATCH /api/admin/update-doctor/:id
router.patch("/update-doctor/:id", updateDoctor);

// @route   DELETE /api/admin/delete-doctor/:id
router.delete("/delete-doctor/:id", deleteDoctor);

module.exports = router;
