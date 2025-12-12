const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Check if user is doctor
const isDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Doctor privileges required.",
    });
  }
  next();
};

// Check if user is patient
const isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Patient privileges required.",
    });
  }
  next();
};

module.exports = { authMiddleware, isAdmin, isDoctor, isPatient };
