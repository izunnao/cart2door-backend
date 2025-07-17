import { fxRateAlertEmail } from "../templates/fxRateAlertMail.temp.notification.js";
import { registrationSuccessEmail } from "../templates/registrationSuccess.temp.notification.js";
import { TemplatePayloadType } from "../types.js";

export const templateContexts: Record<keyof TemplatePayloadType, (value: any) => string> = {
  registrationSuccess: (data: TemplatePayloadType['registrationSuccess']) =>
    registrationSuccessEmail(data.name, data.id, data.verificationLink),

  fxRateAlertEmailI: (data: TemplatePayloadType['fxRateAlertEmailI']) => 
                fxRateAlertEmail({ 
                      apiUrl: data.apiUrl, 
                      errorMessage: data.errorMessage, 
                      retryCount: data.retryCount, 
                      timestamp: data.timestamp 
                    }),

  // orderSuccess: (order: {
  //   id: string;
  //   amount: number;
  //   date: string;
  //   items: Array<{ name: string; quantity: number }>
  // }) => ({
  //   orderId: order.id,
  //   orderAmount: order.amount.toFixed(2),
  //   orderDate: order.date,
  //   items: order.items.map(item =>
  //     `<li>${item.name} (Qty: ${item.quantity})</li>`
  //   ).join(''),
  //   supportEmail: 'support@yourdomain.com'
  // }),

  // orderStatusChange: (order: {
  //   id: string;
  //   newStatus: string;
  //   trackingNumber?: string;
  //   customerName: string;
  // }) => ({
  //   customerName: order.customerName,
  //   orderId: order.id,
  //   newStatus: order.newStatus,
  //   trackingInfo: order.trackingNumber
  //     ? `Tracking #: ${order.trackingNumber}`
  //     : 'Tracking number will be available soon',
  //   contactUs: 'contact@yourdomain.com'
  // })
};