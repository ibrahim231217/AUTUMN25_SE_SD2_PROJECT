const User = require("../models/User");
const Booking = require("../models/Booking");

// @desc    Get patient profile
// @route   GET /api/patient/profile
// @access  Private (Patient)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/patient/doctors?category=Cardiologist&search=john
// @access  Private (Patient)
const getDoctors = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = { role: "doctor", isApproved: true };

    if (category && category !== "All") {
      filter.speciality = category;
    }

    // Add search by name
    if (search) {
      filter.username = { $regex: search, $options: "i" };
    }

    const doctors = await User.find(filter)
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

// @desc    Book an appointment
// @route   POST /api/patient/book
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, category, appointmentTime, message } = req.body;

    // Validation
    if (!doctorId || !category || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if doctor is approved
    if (!doctor.isApproved) {
      return res.status(403).json({
        success: false,
        message: "This doctor is not approved yet",
      });
    }

    // Check if appointment time is in the future
    const appointmentDate = new Date(appointmentTime);
    if (appointmentDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment time must be in the future",
      });
    }

    // Create booking
    const booking = await Booking.create({
      patientId: req.user._id,
      doctorId,
      category,
      appointmentTime: appointmentDate,
      message: message || "",
      status: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("patientId", "username email")
      .populate("doctorId", "username email speciality");

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get patient's bookings
// @route   GET /api/patient/bookings?status=pending&startDate=2024-01-01&endDate=2024-12-31
// @access  Private (Patient)
const getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let filter = { patientId: req.user._id };

    // Filter by status
    if (status && status !== "all") {
      filter.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.appointmentTime = {};
      if (startDate) {
        filter.appointmentTime.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.appointmentTime.$lte = end;
      }
    }

    const bookings = await Booking.find(filter)
      .populate("doctorId", "username email speciality experience profileImage")
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

// @desc    Update patient profile
// @route   PATCH /api/patient/update-profile
// @access  Private (Patient)
const updateProfile = async (req, res) => {
  try {
    const { username, email, profileImage } = req.body;

    const updateData = {};

    // Check for duplicate username or email (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: req.user._id },
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

    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedPatient = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update patient password
// @route   PATCH /api/patient/update-password
// @access  Private (Patient)
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/patient/booking/:id/cancel
// @access  Private (Patient)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find booking
    const booking = await Booking.findOne({
      _id: id,
      patientId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you do not have permission to cancel it",
      });
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Update status to cancelled
    booking.status = "cancelled";
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("patientId", "username email")
      .populate("doctorId", "username email speciality");

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update/reschedule a booking
// @route   PATCH /api/patient/booking/:id
// @access  Private (Patient)
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentTime, message } = req.body;

    // Find booking
    const booking = await Booking.findOne({
      _id: id,
      patientId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you do not have permission to update it",
      });
    }

    // Check if booking can be updated
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a cancelled booking",
      });
    }

    if (booking.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a rejected booking",
      });
    }

    // Update fields
    if (appointmentTime) {
      const newAppointmentDate = new Date(appointmentTime);
      if (newAppointmentDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Appointment time must be in the future",
        });
      }
      booking.appointmentTime = newAppointmentDate;
      // Reset status to pending if it was accepted
      if (booking.status === "accepted") {
        booking.status = "pending";
      }
    }

    if (message !== undefined) {
      booking.message = message;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("patientId", "username email")
      .populate("doctorId", "username email speciality");

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  getDoctors,
  bookAppointment,
  getBookings,
  updateProfile,
  updatePassword,
  cancelBooking,
  updateBooking,
};
