import { ShippingDetail } from "@prisma/client";

export const extractOrderCreationShippingDetails = (shippingDetails: ShippingDetail): Omit<ShippingDetail,  'id' | 'saveAsDefault'> => {
    const { saveAsDefault, id, ...orderShippingDetails } = shippingDetails;
    return orderShippingDetails;
};