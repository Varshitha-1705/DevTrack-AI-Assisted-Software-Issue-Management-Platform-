const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["bug", "feature", "security", "performance", "other"],
      default: "other",
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },

    assignedTo: {
      type: String,
      default: null,
    },

    aiAnalysis: {
  category: {
    type: String,
    default: null,
  },

  severity: {
    type: String,
    default: null,
  },

  priority: {
    type: String,
    default: null,
  },

  suggestedTeam: {
    type: String,
    default: null,
  },

  suggestedAction: {
    type: String,
    default: null,
  },

  analyzedAt: {
    type: Date,
    default: null,
  },
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);