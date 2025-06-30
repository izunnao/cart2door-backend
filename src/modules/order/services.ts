import { OrderItem } from "@prisma/client";
import { CONFIG_FX_RATE_MARGIN } from "../../config.js";

export const calculatePriceInNairaForItems = (items: OrderItem[]): OrderItem[] => {
    return items.map(item => {
        item.priceInNaira = item.price * CONFIG_FX_RATE_MARGIN
        return item
    })
}