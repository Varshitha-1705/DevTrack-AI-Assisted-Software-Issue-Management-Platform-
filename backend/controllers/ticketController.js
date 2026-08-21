const Ticket = require("../models/Ticket");

// =========================
// CREATE TICKET
// =========================

const createTicket = async (req, res) => {
  try {
    const { title, description, category, severity } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      severity,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

// =========================
// GET ALL TICKETS
// =========================

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

// =========================
// AI ANALYSIS
// =========================

const analyzeTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const text = `${ticket.title} ${ticket.description}`.toLowerCase();

    // Category detection
    let category = ticket.category || "bug";

    if (
      text.includes("security") ||
      text.includes("hack") ||
      text.includes("password") ||
      text.includes("unauthorized")
    ) {
      category = "security";
    } else if (
      text.includes("feature") ||
      text.includes("add") ||
      text.includes("new functionality")
    ) {
      category = "feature";
    } else if (
      text.includes("improve") ||
      text.includes("enhancement") ||
      text.includes("performance")
    ) {
      category = "improvement";
    } else {
      category = "bug";
    }

    // Severity detection
    let severity = ticket.severity || "medium";

    if (
      text.includes("critical") ||
      text.includes("crash") ||
      text.includes("down") ||
      text.includes("data loss")
    ) {
      severity = "critical";
    } else if (
      text.includes("security") ||
      text.includes("payment") ||
      text.includes("cannot login") ||
      text.includes("not working")
    ) {
      severity = "high";
    } else if (
      text.includes("slow") ||
      text.includes("minor") ||
      text.includes("small")
    ) {
      severity = "low";
    } else {
      severity = "medium";
    }

    // Priority detection
    let priority = "medium";

    if (severity === "critical") {
      priority = "urgent";
    } else if (severity === "high") {
      priority = "high";
    } else if (severity === "low") {
      priority = "low";
    }

    // Team detection
    let suggestedTeam = "Backend Engineering";

    if (
      text.includes("login") ||
      text.includes("button") ||
      text.includes("page") ||
      text.includes("ui") ||
      text.includes("frontend") ||
      text.includes("css") ||
      text.includes("react")
    ) {
      suggestedTeam = "Frontend Engineering";
    } else if (
      text.includes("api") ||
      text.includes("server") ||
      text.includes("database") ||
      text.includes("mongodb") ||
      text.includes("backend")
    ) {
      suggestedTeam = "Backend Engineering";
    } else if (
      text.includes("deploy") ||
      text.includes("docker") ||
      text.includes("pipeline") ||
      text.includes("server down")
    ) {
      suggestedTeam = "DevOps";
    } else if (
      text.includes("test") ||
      text.includes("testing") ||
      text.includes("qa")
    ) {
      suggestedTeam = "QA Engineering";
    } else if (
      text.includes("security") ||
      text.includes("hack") ||
      text.includes("unauthorized")
    ) {
      suggestedTeam = "Security";
    }

    // Suggested action
    let suggestedAction =
      "Investigate the issue, reproduce the problem and implement an appropriate fix.";

    if (suggestedTeam === "Frontend Engineering") {
      suggestedAction =
        "Reproduce the issue in the UI, inspect the frontend component and fix the related interaction or rendering logic.";
    } else if (suggestedTeam === "Backend Engineering") {
      suggestedAction =
        "Inspect the API and backend logs, reproduce the issue and verify the affected service or database operation.";
    } else if (suggestedTeam === "DevOps") {
      suggestedAction =
        "Check deployment, infrastructure and service logs to identify the underlying operational issue.";
    } else if (suggestedTeam === "QA Engineering") {
      suggestedAction =
        "Create a reproducible test case, verify the failure and validate the fix with regression testing.";
    } else if (suggestedTeam === "Security") {
      suggestedAction =
        "Investigate the security impact, identify the vulnerability and apply the appropriate security fix.";
    }

    const analysis = {
      category,
      severity,
      priority,
      suggestedTeam,
      suggestedAction,
      analyzedAt: new Date(),
    };

    // Save AI analysis to ticket
    ticket.category = category;
    ticket.severity = severity;
    ticket.priority = priority;
    ticket.assignedTo = suggestedTeam;
    ticket.aiAnalysis = analysis;

    await ticket.save();

    res.json({
      success: true,
      message: "Ticket analyzed successfully",
      analysis,
      ticket,
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze ticket",
      error: error.message,
    });
  }
};

// =========================
// UPDATE TICKET
// =========================

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

// =========================
// DELETE TICKET
// =========================

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      message: "Ticket deleted successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  analyzeTicket,
  updateTicket,
  deleteTicket,
};