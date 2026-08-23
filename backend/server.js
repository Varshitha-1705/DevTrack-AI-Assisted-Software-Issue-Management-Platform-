const express = require("express");
const cors = require("cors");
require("dotenv").config({ override: true });

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// AUTH ROUTES
// =========================

app.use("/api/auth", authRoutes);

// =========================
// CONNECT MONGODB
// =========================

connectDB();

// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DevTrack Backend is running successfully!",
  });
});

// =========================
// PROTECTED TEST ROUTE
// =========================

app.get("/api/auth/me", protect, (req, res) => {
  res.json({
    success: true,
    message: "Authentication successful",
    user: req.user,
  });
});

// =========================
// TICKET ROUTES
// =========================

app.use("/api/tickets", ticketRoutes);

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DevTrack backend running on port ${PORT}`);
});