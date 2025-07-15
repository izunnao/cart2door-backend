import { CONFIG_CLIENT_BASE_URL } from "../../config.js";

export const emailFooterTemp = (userId: string, company_address: string = 'Sample address') => `
<div class="footer" style="padding: 1.5rem; text-align: center; color: #64748B; font-size: 0.875rem; border-top: 1px solid #E2E8F0;">
    <div style="margin-bottom: 1rem;">
        <a href="${CONFIG_CLIENT_BASE_URL}/unsubscribe?e=${userId}" style="color: #64748B; text-decoration: underline; margin: 0 0.5rem;">Unsubscribe</a>
        <span style="color: #E2E8F0;">|</span>
        <a href="${CONFIG_CLIENT_BASE_URL}/privacy" style="color: #64748B; text-decoration: underline; margin: 0 0.5rem;">Privacy Policy</a>
        <span style="color: #E2E8F0;">|</span>
        <a href="${CONFIG_CLIENT_BASE_URL}/terms" style="color: #64748B; text-decoration: underline; margin: 0 0.5rem;">Terms of Service</a>
    </div>
    <p style="margin: 0;">© ${new Date().getFullYear()} Cart2Door. All rights reserved.</p>
    <p style="margin: 0.5rem 0 0; font-size: 0.75rem; color: #94A3B8;">
        ${company_address}
    </p>
</div>
`;