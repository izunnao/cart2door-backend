
import { zeptomailer } from './utils.js';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  template: string;              // file name without extension
  context: Record<string, any>;  // data for template
}

export const sendMail = async ({
  to,
  subject,
  template,
  context,
}: SendMailOptions) => {
  const html = `<h3>Hello {{customerName}},</h3>
<p>Thank you for your order <strong>#{{orderId}}</strong>.</p>
<p>Total: ₦{{total}}</p>
`;

  const info = await zeptomailer.sendMail({
    from: process.env.ZEPTO_FROM_ADDRESS,
    to,
    subject,
    html,
  });

  return info; // contains Message-ID etc.
};