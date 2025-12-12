const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password, role, speciality, experience } = req.body;

    // Validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate role
    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be patient or doctor",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    // Doctor-specific validation
    if (role === "doctor" && !speciality) {
      return res.status(400).json({
        success: false,
        message: "Doctor must have a speciality",
      });
    }

    // Create user object
    const userData = {
      username,
      email,
      password,
      role,
    };

    // Add doctor-specific fields
    if (role === "doctor") {
      userData.speciality = speciality;
      userData.experience = experience || 0;
      userData.isApproved = false; // Doctors need admin approval
    }

    // Create user
    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          speciality: user.speciality,
          experience: user.experience,
          isApproved: user.isApproved,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validation
    if (!password || (!email && !username)) {
      return res.status(400).json({
        success: false,
        message: "Please provide email/username and password",
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password",
      });
    }

    // Check if doctor is approved
    if (user.role === "doctor" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Doctor account is pending admin approval. Please wait for approval.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          speciality: user.speciality,
          experience: user.experience,
          description: user.description,
          profileImage: user.profileImage,
          isApproved: user.isApproved,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, login };
