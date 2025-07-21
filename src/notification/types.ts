export type TemplatePayloadType = {
    registrationSuccess: {
        name: string,
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
}