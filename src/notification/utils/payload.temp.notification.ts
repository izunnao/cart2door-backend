import { TemplatePayloadType } from "../types.js";


type TemplateFunctions = {
  [K in keyof TemplatePayloadType]: (data: TemplatePayloadType[K]) => TemplatePayloadType[K];
};

export const templatePayloads: TemplateFunctions = {
  registrationSuccess: (data: TemplatePayloadType['registrationSuccess']): TemplatePayloadType['registrationSuccess'] => ({
    name: data.name,
    id: data.id,
    verificationLink: data.verificationLink || '#',
  }),
  fxRateAlertEmailI: (data: TemplatePayloadType['fxRateAlertEmailI']): TemplatePayloadType['fxRateAlertEmailI'] => ({
    apiUrl: data.apiUrl,
    errorMessage: data.errorMessage,
    retryCount: data.retryCount,
    timestamp: data.timestamp
  }),
  orderStatusUpdate: (data: TemplatePayloadType['orderStatusUpdate']): TemplatePayloadType['orderStatusUpdate'] => ({
    orderId: data.orderId,
    customerName: data.customerName,
    newStatus: data.newStatus,
    orderDate: data.orderDate,
    orderTotal: data.orderTotal,
    supportEmail: data.supportEmail,
  }),
  orderCreated: (data: TemplatePayloadType['orderCreated']): TemplatePayloadType['orderCreated'] => ({
    customerName: data.customerName,
    items: data.items,
    orderDate: data.orderDate,
    orderId: data.orderId,
    orderTotal: data.orderTotal,
    shippingAddress: data.shippingAddress,
    supportEmail: data.supportEmail
  })
};