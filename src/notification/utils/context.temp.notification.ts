import { fxRateAlertEmail } from "../templates/fxRateAlertMail.temp.notification.js";
import { orderCreatedEmail } from "../templates/orderCreated.temp.notification.js";
import { orderStatusUpdateEmail } from "../templates/orderStatusUpdate.temp.notification.js";
import { registrationSuccessEmail } from "../templates/registrationSuccess.temp.notification.js";
import { verifyOtpSuccessEmail } from "../templates/verifyOtp.temp.notification.js";
import { TemplatePayloadType } from "../types.js";

export const templateContexts: Record<keyof TemplatePayloadType, (value: any) => string> = {
  registrationSuccess: (data: TemplatePayloadType['registrationSuccess']) =>
    registrationSuccessEmail(data.name, data.otp),
  fxRateAlertEmailI: (data: TemplatePayloadType['fxRateAlertEmailI']) => fxRateAlertEmail(data),
  orderStatusUpdate: (data: TemplatePayloadType['orderStatusUpdate']) => orderStatusUpdateEmail(data),
  orderCreated: (data: TemplatePayloadType['orderCreated']) => orderCreatedEmail(data),
  verifyOtpSucess: (data: TemplatePayloadType['verifyOtpSucess']) => verifyOtpSuccessEmail(data.firstName)
};