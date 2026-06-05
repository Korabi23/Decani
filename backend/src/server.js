require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");

// Ndryshimi kryesor: Railway injekton portin tek process.env.PORT
// Nëse nuk ka port, përdor 4000 si opsion të dytë
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    // 1. Lidhu me databazën
    await connectDB(MONGO_URI);
    
    // 2. Nise serverin
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Gabim fatal gjatë nisjes së serverit:", err.message);
    process.exit(1);
  }
};

startServer();