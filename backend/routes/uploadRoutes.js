const express = require("express");
const { uploadProfileImage } = require("../controllers/uploadController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/upload/profile-image
router.post("/profile-image", uploadProfileImage);

module.exports = router;
