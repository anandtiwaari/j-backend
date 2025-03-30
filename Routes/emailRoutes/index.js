const express = require("express");
const router = express.Router();
// const Email = require("../models/Email");
const Email = require("../../Schema/emailSchema");
const validateToken = require("../../Middleware/validateToken");
const upload = require("../../Middleware/multer");
const cloudinary = require("../../Middleware/Cloudinary");

router.post("/schedule-email", validateToken, upload.single("image"), async (req, res) => {
  try {
    console.log(req.userId, "show the request user here now ............");
    console.log(req.body, "show the request body here now....");
    console.log(req?.file, "req?.imagereq?.imagereq?.image")
    const { to, subject, body, scheduledAt } = req.body;
    let responseCloudinary
    try {
      if (req?.file?.path) {
        console.time('cloudinary-upload');
        responseCloudinary = await cloudinary.uploader.upload(req.file.path, {
          folder: "emails",
          public_id: 'shoes',
          use_filename: true,
          unique_filename: false,
          timeout: 120000, // 2 minutes
        });
        console.timeEnd('cloudinary-upload');
        console.log("Upload successful:", responseCloudinary);
        // responseCloudinary = await cloudinary.uploader.upload(req?.file?.path);
        // console.log(responseCloudinary, "show the response cloudinary here now....");
      }
    } catch (error) {
      console.log(error, "errrrrr")
    }


    // Validate scheduled time
    if (new Date(scheduledAt) < new Date()) {
      return res
        .status(400)
        .json({ error: "Scheduled time cannot be in the past" });
    }

    const email = new Email({
      to: JSON.parse(to),
      subject,
      body,
      scheduledAt: new Date(scheduledAt),
      userId: req.userId,
      imageUrl: responseCloudinary?.url,
    });
    // userId:

    await email.save();
    res.status(201).json({ message: "Email scheduled successfully" });
  } catch (error) {
    console.log(error, "show the error here")
    res.status(500).json({ error: "Error scheduling email" });
  }
});

router.get("/scheduled-emails", validateToken, async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.userId }).sort({
      scheduledAt: 1,
    }); // Sort by scheduled date
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ error: "Error fetching scheduled emails" });
  }
});

// this one is the analytics route here

router.get("/analytics", validateToken, async (req, res) => {
  try {
    // Ensure userId is available
    if (!req.userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No user ID provided" });
    }

    // Fetch total counts in parallel for better performance
    const [totalSent, totalPending, totalFailed] = await Promise.all([
      Email.countDocuments({ userId: req.userId, status: "sent" }),
      Email.countDocuments({ userId: req.userId, status: "pending" }),
      Email.countDocuments({ userId: req.userId, status: "failed" }),
    ]);

    // Fetch emails sent over time
    const emailsOverTime = await Email.aggregate([
      { $match: { userId: req.userId, status: "sent" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalSent,
      totalPending,
      totalFailed,
      emailsOverTime,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
