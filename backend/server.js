const express = require("express");
const cors = require("cors");
require("dotenv").config({ override: true });

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DevTrack Backend is running successfully!",
  });
});

// Ticket routes
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DevTrack backend running on port ${PORT}`);
});