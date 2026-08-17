const express = require("express");

const {
  createTicket,
  getTickets,
  analyzeTicketWithAI,
} = require("../controllers/ticketController");

const router = express.Router();

// Create a ticket
router.post("/", createTicket);

// Get all tickets
router.get("/", getTickets);

// Analyze a ticket using AI
router.post("/:id/analyze", analyzeTicketWithAI);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

module.exports = router;