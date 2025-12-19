/**
 * Migration script to add Patient IDs and Doctor IDs to existing users
 * Run this once to update all existing users in the database
 */

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const addUserIds = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✓ Connected to MongoDB");

        // Get all patients without patientId
        const patients = await User.find({
            role: "patient",
            $or: [{ patientId: null }, { patientId: { $exists: false } }]
        });

        console.log(`\nFound ${patients.length} patients without IDs`);

        // Update patients
        for (let i = 0; i < patients.length; i++) {
            const patientId = `P-${String(i + 1).padStart(4, '0')}`;
            await User.findByIdAndUpdate(patients[i]._id, { patientId });
            console.log(`✓ Updated ${patients[i].username} with ID: ${patientId}`);
        }

        // Get all doctors without doctorId
        const doctors = await User.find({
            role: "doctor",
            $or: [{ doctorId: null }, { doctorId: { $exists: false } }]
        });

        console.log(`\nFound ${doctors.length} doctors without IDs`);

        // Update doctors
        for (let i = 0; i < doctors.length; i++) {
            const doctorId = `D-${String(i + 1).padStart(4, '0')}`;
            await User.findByIdAndUpdate(doctors[i]._id, { doctorId });
            console.log(`✓ Updated Dr. ${doctors[i].username} with ID: ${doctorId}`);
        }

        console.log("\n✓ Migration completed successfully!");
        console.log(`Total updated: ${patients.length + doctors.length} users`);

        await mongoose.connection.close();
        console.log("✓ Database connection closed");
        process.exit(0);
    } catch (error) {
        console.error("✗ Migration failed:", error);
        process.exit(1);
    }
};

// Run migration
addUserIds();
