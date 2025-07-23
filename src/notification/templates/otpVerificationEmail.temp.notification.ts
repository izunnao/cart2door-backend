import { emailFooterTemp } from "./footer.temp.notification.js";

export const otpVerificationEmail = (firstName: string, otp: string, expiryMinutes: number = 10) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
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

    .otp-container {
      background-color: #F1F5F9;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: center;
    }

    .otp-code {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 0.5rem;
      color: #0F172A;
      margin: 1rem 0;
      padding: 0 1rem;
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

    .warning-text {
      color: #DC2626;
      font-size: 0.875rem;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 1.5rem; font-weight: 700;">Verify Your Email</h1>
      <p style="margin: 0.5rem 0 0; opacity: 0.9;">Secure your Cart2Door account</p>
    </div>

    <div class="content">
      <p style="margin: 0 0 1rem;">Hello ${firstName},</p>

      <p style="margin: 0 0 1rem;">To complete your email verification, please use the following One-Time Password (OTP):</p>

      <div class="otp-container">
        <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: #64748B;">Your verification code</p>
        <div class="otp-code">${otp}</div>
        <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #64748B;">Valid for ${expiryMinutes} minutes</p>
      </div>

      <p class="warning-text">Do not share this code with anyone. Cart2Door will never ask for your OTP.</p>

      <p style="margin: 1.5rem 0 0; font-size: 0.875rem; color: #64748B;">
        If you didn't request this verification, please secure your account by contacting our support team immediately at 
        <a href="mailto:support@cart2door.ng" style="color: #2E6EFF;">support@cart2door.ng</a>
      </p>
    </div>

    ${emailFooterTemp()}
  </div>
</body>
</html>
`;