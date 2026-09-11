const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const isConfigured =
  process.env.EMAIL_USER &&
  process.env.EMAIL_USER !== "your_email@gmail.com" &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== "your_gmail_app_password";

if (!isConfigured) {
  console.warn("\n[Mailer Warning] EMAIL_USER or EMAIL_PASS in backend/.env is not configured with real credentials.");
  console.warn("Emails will not be sent via Gmail SMTP until valid App Passwords are provided. OTP will be printed to server console in dev mode.\n");
}

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



const sendOTPEmail = async (toEmail, otp) => {

  try {

    const mailOptions = {

      from: `"DataSheet Hub" <${process.env.EMAIL_USER}>`,

      to: toEmail,

      subject: "Password Reset OTP",

      html: `
        <div style="font-family: Arial, sans-serif;">

          <h2>Password Reset Request</h2>

          <p>
            You requested to change your password.
          </p>

          <p>Your OTP is:</p>

          <h1 style="
            letter-spacing: 8px;
            color: #2563eb;
          ">
            ${otp}
          </h1>

          <p>
            This OTP will expire in 10 minutes.
          </p>

          <p>
            Do not share this OTP with anyone.
          </p>

        </div>
      `,
    };


    const info = await transporter.sendMail(mailOptions);

    console.log("OTP EMAIL SENT SUCCESSFULLY");

    console.log("Sent to:", toEmail);

    console.log("Message ID:", info.messageId);

    return {
      success: true,
      info,
    };

  } catch (error) {

    console.error(
      "OTP EMAIL ERROR:",
      error
    );

    throw error;
  }
};


module.exports = {
  sendOTPEmail,
  transporter,
};