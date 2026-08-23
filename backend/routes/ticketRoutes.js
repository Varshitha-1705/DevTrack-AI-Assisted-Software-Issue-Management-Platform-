const express = require("express");

const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protected ticket routes
router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

module.exports = router;