import axios, { AxiosError } from "axios";
import { CONFIG_PAYSTACK_API_URL, CONFIG_PAYSTACK_SECRET_KEY } from "../config.js";
import AppError, { throwErrorOn } from "./AppError.js";
import { extractErrorMessage } from "./error.js";
import { PaymentStatus } from "@prisma/client";
import { logger } from "./logger.js";



export const initializeTransaction = async (
    email: string,
    amount: number,
    callbackUrl: string,
    orderId: string
) => {

    logger.info(`initializeTransaction - params :, ${email}, ${amount}, ${callbackUrl}, ${orderId}`)


    try {
        const response = await axios.post(
            `${CONFIG_PAYSTACK_API_URL}/transaction/initialize`,
            {
                email,
                amount: Math.ceil(amount * 100), // Convert to kobo and must not have decimal (Paystack uses smallest currency unit)
                callback_url: callbackUrl,
                metadata: {
                    orderId     // order id is collected and used from metadata in transaction verification
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${CONFIG_PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        logger.info(`initializeTransaction: ${JSON.stringify(response.data.data)}`)

        return response.data.data; // Contains access_code and authorization_url
    } catch (error: any) {
        logger.error(`initializeTransaction: ${JSON.stringify(error.response.data)}`)
        throwErrorOn(true, 400, `Failed to initialize transaction: ${extractErrorMessage(error)}`);
    }
};

export const verifyTransaction = async (reference: string): Promise<{ status: string, customer: any, gateway_response: string, metadata: Record<string, string> }> => {
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

        console.log('refrence ..  ', response.data.data);

        return { status: response.data.data.status, metadata: response.data.data.metadata, customer: response.data.data.customer, gateway_response: response.data.data.gateway_response }; // Contains transaction status and details
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
