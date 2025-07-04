import { OrderItem } from "@prisma/client";

export const calculatePriceInNairaForItems = (items: OrderItem[], fxRate: number): OrderItem[] => {
    return items.map(item => {
        item.priceInNaira = item.price * fxRate
        return item
    })
}