import { fxRateAlertEmail } from "../templates/fxRateAlertMail.temp.notification.js";
import { orderCreatedEmail } from "../templates/orderCreated.temp.notification.js";
import { orderStatusUpdateEmail } from "../templates/orderStatusUpdate.temp.notification.js";
import { registrationSuccessEmail } from "../templates/registrationSuccess.temp.notification.js";
import { TemplatePayloadType } from "../types.js";

export const templateContexts: Record<keyof TemplatePayloadType, (value: any) => string> = {
  registrationSuccess: (data: TemplatePayloadType['registrationSuccess']) =>
    registrationSuccessEmail(data.name, data.id, data.verificationLink),
  fxRateAlertEmailI: (data: TemplatePayloadType['fxRateAlertEmailI']) => fxRateAlertEmail(data),
  orderStatusUpdate: (data: TemplatePayloadType['orderStatusUpdate']) => orderStatusUpdateEmail(data),
  orderCreated: (data: TemplatePayloadType['orderCreated']) => orderCreatedEmail(data)
};