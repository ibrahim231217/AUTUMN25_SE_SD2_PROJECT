const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedDatabase = async () => {
  try {
    console.log("✅ Database is ready!");
    console.log("📝 You can now:");
    console.log("   1. Sign up as a patient");
    console.log("   2. Sign up as a doctor (add to doctor list automatically)");
    console.log("   3. Patient books appointments with doctors");
    console.log("   4. Doctor accepts/rejects appointments");
    console.log("\n🚀 Start the application to begin!");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
