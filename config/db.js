const mongoose = require("mongoose");

const dburl = process.env.DB_URL || "mongodb://127.0.0.1:27017/ShivrJ"; // Fallback for local dev

async function connectDB() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = { connectDB };
