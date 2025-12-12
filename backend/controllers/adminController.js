const User = require("../models/User");
const Booking = require("../models/Booking");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const pendingDoctors = await User.countDocuments({
      role: "doctor",
      isApproved: false,
    });
    const approvedDoctors = await User.countDocuments({
      role: "doctor",
      isApproved: true,
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      stats: {
        totalPatients,
        totalDoctors,
        pendingDoctors,
        approvedDoctors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all approved doctors
// @route   GET /api/admin/doctors
// @access  Admin only
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isApproved: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Approved doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all pending doctors (awaiting approval)
// @route   GET /api/admin/pending-doctors
// @access  Admin only
const getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await User.find({
      role: "doctor",
      isApproved: false,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Pending doctors fetched successfully",
      data: pendingDoctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve a doctor
// @route   PUT /api/admin/approve-doctor/:id
// @access  Admin only
const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and validate doctor exists
    const doctor = await User.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if user is actually a doctor
    if (doctor.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "User is not a doctor",
      });
    }

    // Check if already approved
    if (doctor.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Doctor is already approved",
      });
    }

    // Approve the doctor
    doctor.isApproved = true;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject a doctor (delete pending doctor)
// @route   DELETE /api/admin/reject-doctor/:id
// @access  Admin only
const rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and validate doctor exists
    const doctor = await User.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if user is actually a doctor
    if (doctor.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "User is not a doctor",
      });
    }

    // Can only reject pending doctors
    if (doctor.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an already approved doctor",
      });
    }

    // Delete the doctor
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor application rejected and deleted",
      data: { deletedDoctorId: id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Admin only
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({
      role: "patient",
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/admin/doctor/:id
// @access  Admin only
const deleteDoctorAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and validate doctor exists
    const doctor = await User.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if user is actually a doctor
    if (doctor.role !== "doctor") {
      return res.status(400).json({
        success: false,
        message: "User is not a doctor",
      });
    }

    // Delete all bookings for this doctor
    await Booking.deleteMany({ doctorId: id });

    // Delete the doctor
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor and associated bookings deleted successfully",
      data: { deletedDoctorId: id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/statistics
// @access  Admin only
const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({
      role: "doctor",
      isApproved: true,
    });
    const pendingDoctors = await User.countDocuments({
      role: "doctor",
      isApproved: false,
    });
    const totalAppointments = await Booking.countDocuments();

    // Get appointments for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await Booking.countDocuments({
      appointmentTime: { $gte: today, $lt: tomorrow },
    });

    res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        totalPatients,
        totalDoctors,
        pendingDoctors,
        totalAppointments,
        appointmentsToday,
      },
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
// @access  Admin only
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

// Legacy: Add new admin
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

// Legacy: Add new doctor
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

// Legacy: Get doctors
// @desc    Get all doctors
// @route   GET /api/admin/doctors (legacy endpoint - returns all doctors)
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

// Legacy: Update doctor
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

// @desc    Delete a patient
// @route   DELETE /api/admin/patient/:id
// @access  Admin only
const deletePatientAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and validate patient exists
    const patient = await User.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check if user is actually a patient
    if (patient.role !== "patient") {
      return res.status(400).json({
        success: false,
        message: "User is not a patient",
      });
    }

    // Delete all bookings for this patient
    await Booking.deleteMany({ patientId: id });

    // Delete the patient
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Patient and associated bookings deleted successfully",
      data: { deletedPatientId: id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
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
  getDoctors,
  updateDoctor,
  deletePatientAccount,
};
