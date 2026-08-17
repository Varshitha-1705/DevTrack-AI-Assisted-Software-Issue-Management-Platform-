const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(
      "MongoDB URI type:",
      process.env.MONGO_URI?.split(":")[0]
    );

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;