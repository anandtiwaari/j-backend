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
        html: `
        <h2>Hello,</h2>
        <p>This is a test email with an embedded image.</p>
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" alt="Inline Image" width="150"/>
      `,
        attachments: [
          {
            filename: "example.pdf", // File name that will appear in the email
            path: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80", // Path to the file
          },
        ],
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

// NEW CODE HERE NOW

// const cron = require("node-cron");
// const nodemailer = require("nodemailer");
// const Email = require("../Schema/emailSchema");

// // Nodemailer transporter (use env variables in production)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "anandt607@gmail.com",
//     pass: "gnsg dmef btkm ztwv",
//   },
// });

// cron.schedule("* * * * *", async () => {
//   console.log("Checking for scheduled emails...");

//   const now = new Date();
//   const maxRetries = 3; // Set a retry limit

//   try {
//     // Use findOneAndUpdate to lock the email for processing
//     const email = await Email.findOneAndUpdate(
//       {
//         scheduledAt: { $lte: now },
//         status: "pending",
//         attempts: { $lt: maxRetries }, // Retry max 3 times
//       },
//       {
//         $set: { status: "processing", lastAttemptedAt: now },
//         $inc: { attempts: 1 },
//       },
//       { new: true }
//     );

//     if (!email) {
//       console.log("No pending emails to send.");
//       return;
//     }

//     console.log(`Sending email to: ${email.to}`);

//     await transporter.sendMail({
//       from: "anandt607@gmail.com",
//       to: email.to,
//       subject: email.subject,
//       text: email.body,
//     });

//     // Update email status after successful send
//     await Email.findByIdAndUpdate(email._id, { status: "sent" });
//     console.log(`Email sent to ${email.to}`);
//   } catch (error) {
//     console.error("Error sending email:", error);

//     if (email) {
//       await Email.findByIdAndUpdate(email._id, { status: "failed" });
//     }
//   }
// });
