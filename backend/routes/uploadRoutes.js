const express = require("express");
const { uploadProfileImage, uploadFile } = require("../controllers/uploadController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/upload/profile-image
router.post("/profile-image", uploadProfileImage);

// @route   POST /api/upload (generic file upload)
router.post("/", uploadFile);

module.exports = router;
