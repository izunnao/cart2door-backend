export type TemplatePayloadType = {
    registrationSuccess: {
        name: string,
        otp: string
    },
    otpVerification: {
        firstName: string,
        otp: string,
        expiryMinutes?: number
    },
    fxRateAlertEmailI: {
        timestamp: string,
        apiUrl: string,
        errorMessage: string,
        retryCount: number
    },
    orderStatusUpdate: {
        orderId: string,
        customerName: string,
        newStatus: string,
        orderDate: string,
        orderTotal: number,
        supportEmail: string,
    },
    orderCreated: {
        orderId: string;
        orderNumber: number;
        customerName: string;
        orderDate: string;
        orderTotal: number;
        supportEmail: string;
        items: {
            name: string;
            quantity: number;
            price: number;
        }[];
        shippingAddress: {
            street: string;
            city: string;
            state: string;
        };
    },
    verifyOtpSucess: {
        firstName: string
    }
}