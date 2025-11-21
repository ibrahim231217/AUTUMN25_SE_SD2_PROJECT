const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedDoctors = async () => {
  try {
    // Clear existing doctors
    await User.deleteMany({ role: "doctor" });

    const doctors = [
      {
        username: "Dr. Sharma",
        email: "dr.sharma@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Cardiologist",
        experience: 15,
        description:
          "Experienced cardiologist with expertise in heart diseases and cardiac care.",
      },
      {
        username: "Dr. Patel",
        email: "dr.patel@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Dermatologist",
        experience: 12,
        description:
          "Specialist in skin diseases and dermatological treatments.",
      },
      {
        username: "Dr. Singh",
        email: "dr.singh@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Neurologist",
        experience: 18,
        description:
          "Expert in neurological disorders and brain health management.",
      },
      {
        username: "Dr. Verma",
        email: "dr.verma@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Pathologist",
        experience: 10,
        description: "Experienced pathologist for accurate lab diagnoses.",
      },
      {
        username: "Dr. Gupta",
        email: "dr.gupta@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Endocrinologist",
        experience: 14,
        description:
          "Specialist in hormonal disorders and endocrine system diseases.",
      },
      {
        username: "Dr. Kumar",
        email: "dr.kumar@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Cardiologist",
        experience: 11,
        description:
          "Dedicated cardiologist with advanced cardiac care techniques.",
      },
      {
        username: "Dr. Nair",
        email: "dr.nair@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Dermatologist",
        experience: 9,
        description: "Compassionate dermatologist for skin and hair care.",
      },
      {
        username: "Dr. Menon",
        email: "dr.menon@hospital.com",
        password: "doctor123",
        role: "doctor",
        speciality: "Neurologist",
        experience: 16,
        description:
          "Renowned neurologist specializing in complex neurological cases.",
      },
    ];

    const createdDoctors = await User.insertMany(doctors);
    console.log(`✅ Successfully seeded ${createdDoctors.length} doctors`);

    // Create a sample patient for testing
    const existingPatient = await User.findOne({
      email: "patient@hospital.com",
    });
    if (!existingPatient) {
      await User.create({
        username: "John Doe",
        email: "patient@hospital.com",
        password: "patient123",
        role: "patient",
      });
      console.log("✅ Created sample patient account");
    }

    console.log("\n📋 Sample Credentials:");
    console.log("Patient - Email: patient@hospital.com, Password: patient123");
    console.log("Doctor - Email: dr.sharma@hospital.com, Password: doctor123");
    console.log("Admin - Email: admin@hospital.com, Password: admin123");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDoctors();
