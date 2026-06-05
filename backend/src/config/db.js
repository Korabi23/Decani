const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment variables.");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error; // E kalojmë gabimin te server.js që ta ndalojmë serverin
  }
}

module.exports = { connectDB };
