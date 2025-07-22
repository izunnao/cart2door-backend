import { emailFooterTemp } from "./footer.temp.notification.js";

export const verifyOtpSuccessEmail = (firstName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification Successful</title>
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
      <h1 style="margin: 0; font-size: 1.5rem; font-weight: 700;">OTP Verification Successful!</h1>
      <p style="margin: 0.5rem 0 0; opacity: 0.9;">Your account is now verified</p>
    </div>

    <div class="content">
      <p style="margin: 0 0 1rem;">Hello ${firstName},</p>

      <p style="margin: 0 0 1rem;">We're excited to confirm that your one-time password (OTP) verification was successful.</p>

      <p style="margin: 0 0 1rem;">Your account is now fully verified. Start shopping or manage your orders now!</p>

      <div style="text-align: center; margin: 2rem 0;">
        <a href="https://www.cart2door.ng/login" class="button">Login</a>
      </div>

      <p style="margin: 1.5rem 0 0; font-size: 0.875rem; color: #64748B;">
        If you did not initiate this verification, please contact our support team at <a href="mailto:support@cart2door.ng" style="color: #2E6EFF; text-decoration: none;">support@cart2door.ng</a>.
      </p>
    </div>

    ${emailFooterTemp()}
  </div>
</body>
</html>
`;