import { HANDLING_FEE_GBP, MINIMUM_ORDER_GBP } from "./constants.js";

export const validateMinimumOrder = (subtotal: number): boolean => {
    return subtotal >= MINIMUM_ORDER_GBP;
};

export const getRemainingAmount = (subtotal: number): number => {
    return Math.max(0, MINIMUM_ORDER_GBP - subtotal);
};


export const deliveryFeeRateGBP: Record<string, number> = {
    lagos: 7,
    abuja: 7.5,
    portharcourt: 8
}

                                               //internal fx rate
export const getDeliveryFee = (state: string, fxRate: number) => {
    const rate = deliveryFeeRateGBP[state]

    if (!rate) {
        return 0
    }

    return deliveryFeeRateGBP[state] * fxRate
}


export const getHandlingFee = (handlingFeeGBP: number, fxRate: number) => {
    return handlingFeeGBP * fxRate
}


// use on both the frontend and backend
export const calcOrderSummary = (subtotalGBP: number, internalFxRate: number, state: string) => {
    // Calculate totals
    const subtotalNGN = Math.round(subtotalGBP * internalFxRate);
    const customsDuty = Math.round(subtotalNGN * 0.1); // 10% customs
    const vat = Math.round((subtotalNGN + customsDuty) * 0.075) // 7.5% VAT
    const handlingFee = getHandlingFee(HANDLING_FEE_GBP, internalFxRate);
    const deliveryFee = getDeliveryFee(state?.toLocaleLowerCase(), internalFxRate);
    const nairaTotal = subtotalNGN + customsDuty + vat + deliveryFee + handlingFee;

    // Minimum order validation
    const isMinimumMet = validateMinimumOrder(subtotalGBP);
    const remainingAmount = getRemainingAmount(subtotalGBP);
    const progressPercentage = Math.min((subtotalGBP / MINIMUM_ORDER_GBP) * 100, 100);


    return { subtotalNGN, customsDuty, vat, handlingFee, deliveryFee, nairaTotal, isMinimumMet, remainingAmount, progressPercentage };
}