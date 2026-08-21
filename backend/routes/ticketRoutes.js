const express = require("express");

const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  analyzeTicket,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);

router.post("/:id/analyze", analyzeTicket);

router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

module.exports = router;