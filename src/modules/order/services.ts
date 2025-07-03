import { OrderItem } from "@prisma/client";
import redis from "../../utils/redis.js";
import { getFXRate } from "../../utils/general.js";
import { throwErrorOn } from "../../utils/AppError.js";
import { CONFIG_MIN_ORDER_AMOUNT } from "../../config.js";

export const calculatePriceInNairaForItems = (items: OrderItem[], fxRate: number): OrderItem[] => {
    return items.map(item => {
        item.priceInNaira = item.price * fxRate
        return item
    })
}