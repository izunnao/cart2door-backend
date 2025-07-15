import { TemplatePayloadType } from "../types.js";

export const templatePayloads = {
  registrationSuccess: (user: TemplatePayloadType['registrationSuccess']) => ({
    name: user.name,
    verificationLink: user.verificationLink || '#',
    year: new Date().getFullYear()
  }),

};