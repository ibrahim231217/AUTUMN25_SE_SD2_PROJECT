const path = require("path");
const fs = require("fs");

// @desc    Upload profile image
// @route   POST /api/upload/profile-image
// @access  Private (Any authenticated user)
const uploadProfileImage = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.files || !req.files.profileImage) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image file",
            });
        }

        const file = req.files.profileImage;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image file (JPEG, PNG, or GIF)",
            });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "Image size should not exceed 5MB",
            });
        }

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, "..", "uploads", "profiles");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const fileExtension = path.extname(file.name);
        const fileName = `${req.user._id}_${Date.now()}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Move file to uploads directory
        await file.mv(filePath);

        // Return the file URL
        const fileUrl = `/uploads/profiles/${fileName}`;

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                url: fileUrl,
                filename: fileName,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Upload any file (for prescriptions, documents, etc.)
// @route   POST /api/upload
// @access  Private (Any authenticated user)
const uploadFile = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.files || !req.files.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        const file = req.files.file;

        // Validate file type (images and PDFs)
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "application/pdf"
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image (JPEG, PNG, GIF) or PDF file",
            });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: "File size should not exceed 5MB",
            });
        }

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, "..", "uploads", "prescriptions");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const fileExtension = path.extname(file.name);
        const fileName = `${req.user._id}_${Date.now()}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Move file to uploads directory
        await file.mv(filePath);

        // Return the file URL
        const fileUrl = `/uploads/prescriptions/${fileName}`;

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            url: fileUrl,
            filename: fileName,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadProfileImage,
    uploadFile,
};
