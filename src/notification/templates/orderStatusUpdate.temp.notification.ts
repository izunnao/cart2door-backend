import { TemplatePayloadType } from "../types.js";

export const orderStatusUpdateEmail = ({ orderId, customerName, newStatus, orderDate, orderTotal, supportEmail }: TemplatePayloadType['orderStatusUpdate']) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F8FAFC;
            margin: 0;
            padding: 0;
            color: #0F172A;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background-color: #2E6EFF;
            padding: 24px;
            text-align: center;
            color: white;
        }
        
        .content {
            padding: 32px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            background-color: #2E6EFF;
            color: white;
            border-radius: 20px;
            font-weight: 500;
            font-size: 14px;
            margin: 8px 0;
            text-transform: capitalize;
        }
        
        .order-card {
            background-color: #F8FAFC;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
        }
        
        .order-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .order-label {
            color: #64748B;
        }
        
        .order-value {
            font-weight: 500;
        }
        
        .footer {
            padding: 24px;
            text-align: center;
            color: #64748B;
            font-size: 14px;
            border-top: 1px solid #E2E8F0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 20px; font-weight: 600;">Order Status Update</h1>
        </div>
        
        <div class="content">
            <p style="margin: 0 0 16px;">Dear ${customerName},</p>
            
            <p style="margin: 0 0 16px;">The status of your order has been updated:</p>
            
            <div class="status-badge">${newStatus}</div>
            
            <div class="order-card">
                <div class="order-row">
                    <span class="order-label">Order ID:</span>
                    <span class="order-value">${orderId}</span>
                </div>
                <div class="order-row">
                    <span class="order-label">Order Date:</span>
                    <span class="order-value">${orderDate}</span>
                </div>
                <div class="order-row">
                    <span class="order-label">Order Total:</span>
                    <span class="order-value">$${orderTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <p style="margin: 16px 0;">
                You'll receive another notification when your order status changes again. 
                Track your order anytime through your account dashboard.
            </p>
            
            <p style="margin: 16px 0 0;">
                Need help? Contact our support team at 
                <a href="mailto:${supportEmail}" style="color: #2E6EFF; text-decoration: none;">${supportEmail}</a>
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} Cart2Door. All rights reserved.</p>
            <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                123 Business Rd, Lagos, Nigeria
            </p>
        </div>
    </div>
</body>
</html>
`;