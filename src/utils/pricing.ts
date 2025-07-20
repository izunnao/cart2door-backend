import { DELIVERY_FEE_RATE_GBP, HANDLING_FEE_GBP, MINIMUM_ORDER_GBP } from "./constants.js";

export const validateMinimumOrder = (subtotal: number): boolean => {
    return subtotal >= MINIMUM_ORDER_GBP;
};

export const getRemainingAmount = (subtotal: number): number => {
    return Math.max(0, MINIMUM_ORDER_GBP - subtotal);
};
                                               //internal fx rate
export const getDeliveryFeeNGN = (state: string, fxRate: number) => {
    const rate = DELIVERY_FEE_RATE_GBP[state]

    if (!rate) {
        return 0
    }

    return DELIVERY_FEE_RATE_GBP[state] * fxRate
}


export const getHandlingFeeNGN = (handlingFeeGBP: number, fxRate: number) => {
    return handlingFeeGBP * fxRate
}


// use on both the frontend and backend
export const calcOrderSummary = (subtotalGBP: number, internalFxRate: number, state: string) => {
    // Calculate totals
    const subtotalNGN = Math.round(subtotalGBP * internalFxRate);
    const customsDuty = Math.round(subtotalNGN * 0.1); // 10% customs
    const vat = Math.round((subtotalNGN + customsDuty) * 0.075) // 7.5% VAT
    const handlingFeeNGN = getHandlingFeeNGN(HANDLING_FEE_GBP, internalFxRate);
    const deliveryFeeNGN = getDeliveryFeeNGN(state?.toLocaleLowerCase(), internalFxRate);
    const totalNGN = subtotalNGN + customsDuty + vat + deliveryFeeNGN + handlingFeeNGN;
    

    // Minimum order validation
    const isMinimumMet = validateMinimumOrder(subtotalGBP);
    const remainingAmount = getRemainingAmount(subtotalGBP);
    const progressPercentage = Math.min((subtotalGBP / MINIMUM_ORDER_GBP) * 100, 100);


    return { subtotalNGN, customsDuty, vat, handlingFeeNGN, deliveryFeeNGN, totalNGN, isMinimumMet, remainingAmount, progressPercentage };
}