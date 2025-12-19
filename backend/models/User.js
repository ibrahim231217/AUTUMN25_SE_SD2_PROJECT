const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    // Unique IDs for patients and doctors
    patientId: {
      type: String,
      unique: true,
      sparse: true, // Only patients will have this
    },
    doctorId: {
      type: String,
      unique: true,
      sparse: true, // Only doctors will have this
    },
    // Doctor-specific fields
    speciality: {
      type: String,
      enum: [
        "Dermatologist",
        "Pathologist",
        "Neurologist",
        "Cardiologist",
        "Endocrinologist",
        "",
      ],
      default: "",
    },
    experience: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: function () {
        // Admins and patients are always approved
        // Only doctors need approval
        return this.role !== "doctor";
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate unique IDs before saving
userSchema.pre("save", async function (next) {
  // Generate ID for new users only
  if (this.isNew) {
    try {
      if (this.role === "patient" && !this.patientId) {
        const count = await this.constructor.countDocuments({ role: "patient" });
        this.patientId = String(count + 1).padStart(4, '0'); // Just numbers: 0001
      } else if (this.role === "doctor" && !this.doctorId) {
        const count = await this.constructor.countDocuments({ role: "doctor" });
        this.doctorId = String(count + 1).padStart(4, '0'); // Just numbers: 0001
      }
    } catch (error) {
      return next(error);
    }
  }

  // Hash password if modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide password in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
