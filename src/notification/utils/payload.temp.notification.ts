import { TemplatePayloadType } from "../types.js";

export const templatePayloads = {
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
};