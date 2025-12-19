// Run this script to update existing user IDs to numbers only
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const updateUserIds = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✓ Connected to MongoDB");

        // Update all patients
        const patients = await User.find({ role: "patient" });
        console.log(`\nUpdating ${patients.length} patients...`);

        for (let i = 0; i < patients.length; i++) {
            const newId = String(i + 1).padStart(4, '0');
            await User.findByIdAndUpdate(patients[i]._id, { patientId: newId });
            console.log(`✓ ${patients[i].username}: ${patients[i].patientId} → ${newId}`);
        }

        // Update all doctors
        const doctors = await User.find({ role: "doctor" });
        console.log(`\nUpdating ${doctors.length} doctors...`);

        for (let i = 0; i < doctors.length; i++) {
            const newId = String(i + 1).padStart(4, '0');
            await User.findByIdAndUpdate(doctors[i]._id, { doctorId: newId });
            console.log(`✓ Dr. ${doctors[i].username}: ${doctors[i].doctorId} → ${newId}`);
        }

        console.log("\n✅ All IDs updated to numbers only!");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("✗ Update failed:", error);
        process.exit(1);
    }
};

updateUserIds();
