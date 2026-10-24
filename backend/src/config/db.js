const mongoose = require("mongoose");

const MongoUrl =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGOURL ||
  "mongodb+srv://rvsrkvamsi_db_user:WSVvMlZvE7ncrwCU@data.rpngaxu.mongodb.net/?appName=Data";

async function connectDB() {
  try {
    await mongoose.connect(MongoUrl);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

connectDB();

module.exports = connectDB;