import { emailFooterTemp } from "./footer.temp.notification.js";

export const registrationSuccessEmail = (userName: string, otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Platform!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      background-color: #F8FAFC;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .header {
      background-color: #2E6EFF;
      padding: 2rem;
      text-align: center;
      color: white;
    }

    .content {
      padding: 2rem;
      color: #0F172A;
    }

    .otp-box {
      display: inline-block;
      padding: 16px 24px;
      background-color: #F1F5F9;
      color: #0F172A;
      font-size: 1.5rem;
      font-weight: 600;
      border-radius: 8px;
      letter-spacing: 2px;
      margin: 1.5rem 0;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2E6EFF;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 1rem 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 1.5rem; font-weight: 700;">Welcome Aboard!</h1>
      <p style="margin: 0.5rem 0 0; opacity: 0.9;">Your registration was successful</p>
    </div>

    <div class="content">
      <p style="margin: 0 0 1rem;">Hello ${userName},</p>

      <p style="margin: 0 0 1rem;">Thank you for registering with us! We're excited to have you as part of our community.</p>

      <p style="margin: 0 0 1rem;">Use the following One-Time Password (OTP) to verify your email address:</p>

      <div style="text-align: center;">
        <div class="otp-box">${otp}</div>
      </div>

      <p style="margin: 1rem 0;">OTP will expire within 10 minutes, if not used</p>

      <div style="text-align: center; margin: 2rem 0;">
        <a href="https://www.cart2door.ng/login" class="button">Get Started</a>
      </div>

      <p style="margin: 1.5rem 0 0; font-size: 0.875rem; color: #64748B;">
        If you didn't request this registration, contact support: support@cart2door.ng
      </p>
    </div>

    ${emailFooterTemp()}
  </div>
</body>
</html>
`;
