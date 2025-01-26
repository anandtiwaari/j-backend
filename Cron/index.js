const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Email = require("../Schema/emailSchema");

// Set up the transporter for nodemailer (SMTP configuration)
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: "anandt607@gmail.com",
    pass: "gnsg dmef btkm ztwv",
  },
});

// Cron job to check for scheduled emails
cron.schedule("* * * * *", async () => {
  // Runs every minute
  const now = new Date();

  const emails = await Email.find({
    scheduledAt: { $lte: now },
    status: "pending",
  });

  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: "anandt607@gmail.com",
        to: email.to,
        subject: email.subject,
        text: email.body,
      });

      email.status = "sent";
      await email.save();
      console.log(`Email sent to ${email.to}`);
    } catch (error) {
      email.status = "failed";
      await email.save();
      console.error(`Failed to send email to ${email.to}`);
    }
  }
});
