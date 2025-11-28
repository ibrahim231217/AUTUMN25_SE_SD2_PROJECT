const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor ID is required"],
    },
    category: {
      type: String,
      enum: [
        "Dermatologist",
        "Pathologist",
        "Neurologist",
        "Cardiologist",
        "Endocrinologist",
      ],
      required: [true, "Category is required"],
    },
    appointmentTime: {
      type: Date,
      required: [true, "Appointment time is required"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ patientId: 1, doctorId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
