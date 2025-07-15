
import { CONFIG_ZEPTO_FROM_ADDRESS } from '../config.js';
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
    const info = await zeptomailer.sendMail({
      from: CONFIG_ZEPTO_FROM_ADDRESS,
      to,
      subject,
      html: template,
    });


    console.log(info)

    // return info; // contains Message-ID etc.

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