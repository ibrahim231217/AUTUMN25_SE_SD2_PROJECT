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
// @route   GET /api/patient/doctors?category=Cardiologist
// @access  Private (Patient)
const getDoctors = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = { role: "doctor" };

    if (category && category !== "All") {
      filter.speciality = category;
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
// @route   GET /api/patient/bookings
// @access  Private (Patient)
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ patientId: req.user._id })
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

module.exports = {
  getProfile,
  getDoctors,
  bookAppointment,
  getBookings,
};
