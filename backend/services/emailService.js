import nodemailer from 'nodemailer';
import { getEmailTimestamp } from '../utils/timeZoneHelper.js';

// 1. Configure Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false 
  } 
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Ethereal Connection Error:", error.message);
  } else {
    console.log("✅ Email Server is ready to take messages (Ethereal)");
  }
});

/**
 * Sends a formatted booking confirmation email.
 */
export const sendBookingEmail = async (user, booking) => {
  // Defensive check: ensure user email exists
  if (!user?.email) {
    console.error("❌ Cannot send email: User email is missing.");
    return;
  }

  const formattedTime = getEmailTimestamp(booking.slotStartTime, booking.timezone);
  
  const cancelLink = `${process.env.FRONTEND_URL}/cancel/${booking._id}`;
  const rescheduleLink = `${process.env.FRONTEND_URL}/reschedule/${booking._id}`;

  const mailOptions = {
    from: '"Climatiq Scheduler" <noreply@climatiq.io>',
    to: user.email,
    subject: `Confirmed: Meeting with Victoire Serruys`,
    html: `
      <div style="font-family: sans-serif; color: #1a3a5a; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; border-radius: 8px;">
        <h2 style="color: #1a3a5a; margin-bottom: 24px;">Booking confirmed</h2>
        <p>Hi ${user.firstName || 'there'},</p>
        <p>Your meeting has been scheduled. An invitation has also been sent to your calendar.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 30px 0;">
          <p style="margin: 0; font-weight: bold; font-size: 16px;">${formattedTime}</p>
          <p style="margin: 5px 0 0 0; color: #64748b;">📍 ${booking.location}</p>
        </div>

        <div style="margin-top: 40px; display: flex;">
          <a href="${rescheduleLink}" style="background-color: #4a617c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; margin-right: 10px;">Reschedule</a>
          <a href="${cancelLink}" style="background-color: white; color: #4a617c; padding: 12px 24px; text-decoration: none; border: 1px solid #cbd5e1; border-radius: 4px; font-weight: bold; font-size: 14px;">Cancel</a>
        </div>

        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 40px 0 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">You received this because a meeting was booked via Climatiq Scheduler.</p>
      </div>
    `
  };

  try {
    console.log(`Attempting to send email to ${user.email}...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log("----------------------------------------------");
    console.log("✅ SUCCESS: Email sent to Ethereal!");
    console.log("📧 Message ID:", info.messageId);
    
    // THIS IS YOUR INBOX: Click this link in the terminal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("🔗 VIEW EMAIL HERE ->", previewUrl);
    console.log("----------------------------------------------");
    
    return info;
  } catch (error) {
    console.error("❌ NODEMAILER ERROR:", error.message);
    // Log more details for debugging connection issues
    if (error.code === 'EAUTH') console.error("Check your MAIL_USER and MAIL_PASS in .env");
    throw error;
  }
};