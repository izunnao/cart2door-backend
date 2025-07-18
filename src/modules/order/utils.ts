import { OrderStatus } from "@prisma/client";

export const StatusTransitions: Record<OrderStatus, OrderStatus[]> = {
    cancelled: [],
    confirmed: ['ordered'],
    delivered: [],
    ordered: ['shipped'],
    paid: ['confirmed'],
    pending: ['paid', 'cancelled'],
    shipped: ['delivered']
}