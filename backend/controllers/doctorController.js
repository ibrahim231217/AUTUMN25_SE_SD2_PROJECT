const Booking = require("../models/Booking");
const User = require("../models/User");

// @desc    Get doctor's bookings
// @route   GET /api/doctor/bookings
// @access  Private (Doctor)
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ doctorId: req.user._id })
      .populate("patientId", "username email")
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

// @desc    Update booking status (accept/reject)
// @route   PATCH /api/doctor/update-status/:id
// @access  Private (Doctor)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (!status || !["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "rejected"',
      });
    }

    // Find booking
    const booking = await Booking.findOne({
      _id: id,
      doctorId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you do not have permission to update it",
      });
    }

    // Update status
    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("patientId", "username email")
      .populate("doctorId", "username email speciality");

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update doctor profile
// @route   PATCH /api/doctor/update-profile
// @access  Private (Doctor)
const updateProfile = async (req, res) => {
  try {
    const { description, speciality, experience, profileImage } = req.body;

    const updateData = {};

    if (description !== undefined) updateData.description = description;
    if (speciality !== undefined) {
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
      updateData.speciality = speciality;
    }
    if (experience !== undefined) {
      if (experience < 0) {
        return res.status(400).json({
          success: false,
          message: "Experience cannot be negative",
        });
      }
      updateData.experience = experience;
    }
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedDoctor = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBookings,
  updateBookingStatus,
  updateProfile,
};
