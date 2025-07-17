import { retry } from '../utils/retry.js';
import { TemplatePayloadType } from './types.js';
import { zeptomailer } from './utils.js';
import { templateContexts } from './utils/context.temp.notification.js';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  context: keyof TemplatePayloadType;
  payload: Record<string, string | number>
}

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
    await zeptomailer.sendMail({
      from: 'Cart2Door',
      to,
      subject,
      html: template,
    });
  } catch (error) {

    await retry(async () => await sendMail({
      to,
      subject,
      context,
      payload
    }), 3, 1000)

    console.error(error)
  }
};