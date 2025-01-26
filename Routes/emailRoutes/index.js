const express = require("express");
const router = express.Router();
// const Email = require("../models/Email");
const Email = require("../../Schema/emailSchema");

router.post("/schedule-email", async (req, res) => {
  try {
    console.log(req.body,"show the request body here now....")
    const { to, subject, body, scheduledAt } = req.body;

    // Validate scheduled time
    if (new Date(scheduledAt) < new Date()) {
      return res
        .status(400)
        .json({ error: "Scheduled time cannot be in the past" });
    }

    const email = new Email({
      to,
      subject,
      body,
      scheduledAt: new Date(scheduledAt),
    });

    await email.save();
    res.status(201).json({ message: "Email scheduled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error scheduling email" });
  }
});

router.get("/scheduled-emails", async (req, res) => {
  try {
    const emails = await Email.find().sort({ scheduledAt: 1 }); // Sort by scheduled date
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ error: "Error fetching scheduled emails" });
  }
});

module.exports = router;
