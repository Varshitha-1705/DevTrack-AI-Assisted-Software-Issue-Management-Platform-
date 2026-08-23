const express = require("express");

const {
  createTicket,
  getTickets,
  analyzeTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// PROTECTED TICKET ROUTES
// =========================

router.post("/", protect, createTicket);

router.get("/", protect, getTickets);

// =========================
// AI ANALYSIS
// =========================

router.post("/:id/analyze", protect, analyzeTicket);

// =========================
// UPDATE TICKET
// =========================

router.put("/:id", protect, updateTicket);

// =========================
// DELETE TICKET
// =========================

router.delete("/:id", protect, deleteTicket);

module.exports = router;