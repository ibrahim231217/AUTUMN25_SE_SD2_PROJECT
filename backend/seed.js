const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    // Delete existing admins (fresh start)
    await User.deleteMany({ role: "admin" });

    // Create three admin accounts
    const admins = [
      {
        username: "admin1",
        email: "admin1@hospital.com",
        password: "Admin@123456",
        role: "admin",
      },
      {
        username: "admin2",
        email: "admin2@hospital.com",
        password: "Admin@234567",
        role: "admin",
      },
      {
        username: "admin3",
        email: "admin3@hospital.com",
        password: "Admin@345678",
        role: "admin",
      },
    ];

    // Create admins one by one to trigger password hashing
    for (const adminData of admins) {
      await User.create(adminData);
    }

    console.log("✅ Successfully created 3 admin accounts!");
    console.log("\n📋 Admin Credentials:");
    console.log("═══════════════════════════════════════");
    console.log("Admin 1:");
    console.log("  Username: admin1");
    console.log("  Password: Admin@123456");
    console.log("  Email: admin1@hospital.com");
    console.log("───────────────────────────────────────");
    console.log("Admin 2:");
    console.log("  Username: admin2");
    console.log("  Password: Admin@234567");
    console.log("  Email: admin2@hospital.com");
    console.log("───────────────────────────────────────");
    console.log("Admin 3:");
    console.log("  Username: admin3");
    console.log("  Password: Admin@345678");
    console.log("  Email: admin3@hospital.com");
    console.log("═══════════════════════════════════════\n");
    console.log("💡 To login as admin:");
    console.log("   1. Go to /login");
    console.log("   2. Select 'Admin' role");
    console.log("   3. Enter username and password (no email needed)");
    console.log("   4. You'll be redirected to admin dashboard\n");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
