import { retry } from '../utils/retry.js';
import { TemplatePayloadType } from './types.js';
import { zeptomailer } from './utils.js';
import { templateContexts } from './utils/context.temp.notification.js';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  context: keyof TemplatePayloadType;
  payload: Record<string, any>
}

// because I am not throwing error, I can call this function after response has been sent
export const sendMail = async ({
  to,
  subject,
  context,
  payload
}: SendMailOptions) => {
  const template = templateContexts[context](payload)

  if (!template) {
    console.error('Template does not exist for ', context);
    return;
  }

  try {
    await retry(async () =>
      await zeptomailer.sendMail({
        from: 'Cart2Door - NoReply <no-reply@cart2door.ng>',
        to,
        subject,
        html: template,
      }), 3, 1000
    )
  } catch (error) {
    console.log(' Mailing error ', error)
  }
};
