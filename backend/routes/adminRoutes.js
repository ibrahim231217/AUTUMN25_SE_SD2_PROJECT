const express = require("express");
const {
  getAllUsers,
  getAllDoctors,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getAllPatients,
  deleteDoctorAccount,
  getDashboardStats,
  getAllBookings,
  addAdmin,
  deletePatientAccount,
} = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware, isAdmin);

// New doctor approval system endpoints
// @route   GET /api/admin/users - Get all users with stats
router.get("/users", getAllUsers);

// @route   GET /api/admin/doctors - Get all approved doctors
router.get("/doctors", getAllDoctors);

// @route   GET /api/admin/pending-doctors - Get pending doctors
router.get("/pending-doctors", getPendingDoctors);

// @route   PUT /api/admin/approve-doctor/:id - Approve a doctor
router.put("/approve-doctor/:id", approveDoctor);

// @route   DELETE /api/admin/reject-doctor/:id - Reject pending doctor
router.delete("/reject-doctor/:id", rejectDoctor);

// @route   GET /api/admin/patients - Get all patients
router.get("/patients", getAllPatients);

// @route   DELETE /api/admin/doctor/:id - Delete approved doctor
router.delete("/doctor/:id", deleteDoctorAccount);

// @route   DELETE /api/admin/patient/:id - Delete patient
router.delete("/patient/:id", deletePatientAccount);

// @route   GET /api/admin/statistics - Get dashboard statistics
router.get("/statistics", getDashboardStats);

// @route   GET /api/admin/bookings - Get all bookings
router.get("/bookings", getAllBookings);

// Legacy endpoints (deprecated but kept for compatibility)
// @route   POST /api/admin/add-admin
router.post("/add-admin", addAdmin);

module.exports = router;
