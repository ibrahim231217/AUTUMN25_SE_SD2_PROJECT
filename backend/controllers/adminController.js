const User = require("../models/User");
const Booking = require("../models/Booking");

// @desc    Add new admin
// @route   POST /api/admin/add-admin
// @access  Private (Admin)
const addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
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

    // Create admin
    const admin = await User.create({
      username,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin added successfully",
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add new doctor
// @route   POST /api/admin/add-doctor
// @access  Private (Admin)
const addDoctor = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      speciality,
      experience,
      description,
      profileImage,
    } = req.body;

    // Validation
    if (!username || !email || !password || !speciality) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields (username, email, password, speciality)",
      });
    }

    // Validate speciality
    const validSpecialities = [
      "Dermatologist",
      "Pathologist",
      "Neurologist",
      "Cardiologist",
      "Endocrinologist",
    ];
    if (!validSpecialities.includes(speciality)) {
      return res.status(400).json({
        success: false,
        message: "Invalid speciality",
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

    // Create doctor
    const doctor = await User.create({
      username,
      email,
      password,
      role: "doctor",
      speciality,
      experience: experience || 0,
      description: description || "",
      profileImage: profileImage || "",
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: {
        id: doctor._id,
        username: doctor.username,
        email: doctor.email,
        role: doctor.role,
        speciality: doctor.speciality,
        experience: doctor.experience,
        description: doctor.description,
        profileImage: doctor.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (Admin)
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("patientId", "username email")
      .populate("doctorId", "username email speciality")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update doctor details
// @route   PATCH /api/admin/update-doctor/:id
// @access  Private (Admin)
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      speciality,
      experience,
      description,
      profileImage,
    } = req.body;

    // Find doctor
    const doctor = await User.findOne({ _id: id, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check for duplicate username or email (excluding current doctor)
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: id },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : []),
        ],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username or email already exists",
        });
      }
    }

    // Update fields
    if (username) doctor.username = username;
    if (email) doctor.email = email;
    if (speciality) {
      const validSpecialities = [
        "Dermatologist",
        "Pathologist",
        "Neurologist",
        "Cardiologist",
        "Endocrinologist",
      ];
      if (!validSpecialities.includes(speciality)) {
        return res.status(400).json({
          success: false,
          message: "Invalid speciality",
        });
      }
      doctor.speciality = speciality;
    }
    if (experience !== undefined) doctor.experience = experience;
    if (description !== undefined) doctor.description = description;
    if (profileImage !== undefined) doctor.profileImage = profileImage;

    await doctor.save();

    const updatedDoctor = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/delete-doctor/:id
// @access  Private (Admin)
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await User.findOne({ _id: id, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Delete all bookings associated with this doctor
    await Booking.deleteMany({ doctorId: id });

    // Delete doctor
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addAdmin,
  addDoctor,
  getDoctors,
  getAllBookings,
  updateDoctor,
  deleteDoctor,
};
