const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected for seeding..."))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Create initial admin
const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("Admin already exists:");
            console.log("Username:", existingAdmin.username);
            console.log("Email:", existingAdmin.email);
            console.log("\nUse these credentials to login as admin.");
            process.exit(0);
        }

        // Create new admin
        const admin = await User.create({
            username: "admin",
            email: "admin@medicare.com",
            password: "admin123", // Will be hashed automatically by the User model
            role: "admin",
        });

        console.log("✅ Admin account created successfully!");
        console.log("\n📋 Admin Credentials:");
        console.log("Username: admin");
        console.log("Email: admin@medicare.com");
        console.log("Password: admin123");
        console.log("\n⚠️  Please change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
