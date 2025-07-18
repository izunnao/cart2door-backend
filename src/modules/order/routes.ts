import { Router } from "express";
import { handleAddOrder, handleAddShipping, handleGetInternalFXRate, handleGetOrders, handleGetOrdersForAdmin, handleGetPaymentsForAdmin, handleGetShipping, handleGetUserPayments, handleUpdateOrderStatus, handleVerifyPayment } from "./controllers.js";
import { addOrdersMiddleware, addShippingMiddleware, getOrdersMiddleware, getUserPaymentsMiddleware, updateOrderStatusMiddleware } from "./middlewares.js";
import { authenticate, authorize } from "../../middlewares/auth.js";

const orderRoute = Router()

orderRoute.post('/', authenticate, addOrdersMiddleware, handleAddOrder)
            .get('/', authenticate, getOrdersMiddleware, handleGetOrders)
            .put('/order/status', updateOrderStatusMiddleware, handleUpdateOrderStatus)
            .get('/admin', authenticate, authorize, handleGetOrdersForAdmin);


orderRoute.get('/verify-payment', handleVerifyPayment)
orderRoute.get('/payments', authenticate, getUserPaymentsMiddleware, handleGetUserPayments)
orderRoute.get('/payments/admin', authenticate, authorize, handleGetPaymentsForAdmin)
orderRoute.get('/payments/fx-rate', /* rate limiter, */ handleGetInternalFXRate)



orderRoute.post('/shipping', authenticate, addShippingMiddleware, handleAddShipping)
            .get('/shipping', authenticate, handleGetShipping);

export default orderRoute