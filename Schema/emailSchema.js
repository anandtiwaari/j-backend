const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    to: {
      type: [String],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    userId: {
      type: String,
      // required: true,
    },
    imageUrl: { type: String, default: null }, // Add this field
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
