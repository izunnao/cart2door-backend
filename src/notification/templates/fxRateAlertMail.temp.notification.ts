import { TemplatePayloadType } from "../types.js";

export const fxRateAlertEmail = (alertData: TemplatePayloadType['fxRateAlertEmailI']) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FX Rate Service Disruption</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F8FAFC;
            margin: 0;
            padding: 0;
            line-height: 1.6;
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
            padding: 1.5rem 2rem;
            color: white;
        }
        
        .content {
            padding: 2rem;
        }
        
        .alert-title {
            color: hsl(var(--destructive));
            font-weight: 700;
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
        }
        
        .details {
            background-color: hsl(var(--muted));
            padding: 1.25rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            border-left: 4px solid hsl(var(--destructive));
        }
        
        .details-title {
            font-weight: 600;
            margin: 0 0 0.75rem 0;
            color: hsl(var(--destructive));
        }
        
        .action-list {
            padding-left: 1.25rem;
        }
        
        .action-list li {
            margin-bottom: 0.5rem;
        }
        
        .signature {
            margin-top: 1.5rem;
            border-top: 1px solid #E2E8F0;
            padding-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Service Disruption Alert</h1>
        </div>
        
        <div class="content">
            <h2 class="alert-title">FX Rate Service Disruption</h2>
            
            <p>Our system was unable to fetch the latest foreign exchange rates.</p>
            
            <div class="details">
                <h3 class="details-title">Failure Details</h3>
                <p><strong>Time:</strong> ${alertData.timestamp}</p>
                <p><strong>API Endpoint:</strong> ${alertData.apiUrl}</p>
                <p><strong>Error:</strong> ${alertData.errorMessage}</p>
                <p><strong>Attempts:</strong> ${alertData.retryCount}</p>
            </div>
            
            <h3 style="font-weight: 600; margin: 1.5rem 0 0.75rem 0;">Recommended Actions</h3>
            <ul class="action-list">
                <li>Check API service status</li>
                <li>Verify API credentials/quotas</li>
                <li>Review error logs for details</li>
                <li>Implement fallback rates if available</li>
            </ul>
            
            <p style="color: #64748B; font-size: 0.875rem; margin: 1.5rem 0 0;">
                This is an automated alert. Please investigate promptly.
            </p>
            
            <div class="signature">
                <p style="margin: 0;">Regards,</p>
                <p style="margin: 0.25rem 0 0;">Technical Team</p>
            </div>
        </div>
    </div>
</body>
</html>
`