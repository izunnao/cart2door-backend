import nodemailer from 'nodemailer';
import { CONFIG_ZEPTO_SMTP_HOST, CONFIG_ZEPTO_SMTP_PASSWORD, CONFIG_ZEPTO_SMTP_PORT, CONFIG_ZEPTO_SMTP_USERNAME } from '../config.js';

export const zeptomailer = nodemailer.createTransport({
  host: CONFIG_ZEPTO_SMTP_HOST,
  port: Number(CONFIG_ZEPTO_SMTP_PORT),
  secure: false,
  auth: {
    user: CONFIG_ZEPTO_SMTP_USERNAME,
    pass: CONFIG_ZEPTO_SMTP_PASSWORD,
  },
});