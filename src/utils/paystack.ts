import axios from "axios";
import { CONFIG_PAYSTACK_API_URL, CONFIG_PAYSTACK_SECRET_KEY } from "../config.js";
import AppError, { throwErrorOn } from "./AppError.js";
import { converGBPToNaira, getPublicFXRate } from "./general.js";
import { extractErrorMessage } from "./error.js";
import { PaymentStatus } from "@prisma/client";



export const initializeTransaction = async (
    email: string,
    amount: number,
    reference: string,
    callbackUrl: string
) => {
    try {
        const fxRate = await getPublicFXRate()

        const response = await axios.post(
            `${CONFIG_PAYSTACK_API_URL}/transaction/initialize`,
            {
                email,
                amount: converGBPToNaira(amount, fxRate as number) * 100, // Convert to kobo (Paystack uses smallest currency unit)
                reference,
                callback_url: callbackUrl,
            },
            {
                headers: {
                    Authorization: `Bearer ${CONFIG_PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.data; // Contains access_code and authorization_url
    } catch (error) {
        throwErrorOn(true, 400, `Failed to initialize transaction: ${extractErrorMessage(error)}`);
    }
};

export const verifyTransaction = async (reference: string): Promise<{ status: string, customer: any, gateway_response: string }> => {
    try {
        const response = await axios.get(
            `${CONFIG_PAYSTACK_API_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${CONFIG_PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return { status: response.data.data.status, customer: response.data.data.customer, gateway_response: response.data.data.gateway_response }; // Contains transaction status and details
    } catch (error: unknown) {
        const mainError = error as { message: string }
        throw new AppError(400, mainError.message);
    }
};

// export const saveTransactionStatus = async (
//     orderId: string,
//     reference: string,
//     status: string
// ) => {
//     await prisma.order.update({
//         where: { id: orderId },
//         data: {
//             transactionReference: reference,
//             transactionStatus: status,
//         },
//     });
// };



export const getInternalPaymentStatus = (paystackStatus: string): PaymentStatus => {
    if (paystackStatus === 'success') return PaymentStatus.success
    if (paystackStatus === 'pending') return PaymentStatus.pending
    if (paystackStatus === 'abandoned') return PaymentStatus.abandoned
    return PaymentStatus.failed
}