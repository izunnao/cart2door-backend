import { GBPsign } from "../../utils/constants.js";
import { TemplatePayloadType } from "../types.js";
import { emailFooterTemp } from "./footer.temp.notification.js";

export const orderCreatedEmail = (variables: TemplatePayloadType['orderCreated']) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #F8FAFC; margin: 0; padding: 0; color: #0F172A; }
        .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #2E6EFF; padding: 24px; text-align: center; color: white; }
        .content { padding: 32px; }
        .order-card { background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin: 24px 0; }
        .order-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .order-label { color: #64748B; }
        .order-value { font-weight: 500; }
        .item-card { display: flex; flex-direction: column; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; }
        .footer { padding: 24px; text-align: center; color: #64748B; font-size: 14px; border-top: 1px solid #E2E8F0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 20px; font-weight: 600;">Order Confirmation</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Thank you for your purchase!</p>
        </div>
        
        <div class="content">
            <p style="margin: 0 0 16px;">Dear ${variables.customerName},</p>
            
            <p style="margin: 0 0 16px;">We've received your order #${variables.orderId} placed on ${variables.orderDate}. Here's what you ordered:</p>
            
            ${variables.items.map(item => `
                <div class="item-card">
                    <p style="margin: 0 0 4px; font-weight: 500;">${item.name}</p>
                    
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748B;">Qty: ${item.quantity}</span>
                    
                        <span style="font-weight: 500;">$${item.price.toFixed(2)}</span>
                    </div>
                </div>
            `).join(' ')}
            
            <div class="order-card">
                <div class="order-row">
                    <span class="order-label">Order Total:</span>
                    <span class="order-value"> ${GBPsign}${variables.orderTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <h3 style="margin: 24px 0 8px; font-size: 16px;">Shipping Address</h3>
            <p style="margin: 0 0 4px;">${variables.shippingAddress.street}</p>
            <p style="margin: 0;">${variables.shippingAddress.city}, ${variables.shippingAddress.state}</p>
            
            <p style="margin: 16px 0 0;">
                Need help? Contact our support team at 
                <a href="mailto:${variables.supportEmail}" style="color: #2E6EFF; text-decoration: none;">${variables.supportEmail}</a>
            </p>
        </div>
        
        ${emailFooterTemp('', 'Random address')}
    </div>
</body>
</html>
`;