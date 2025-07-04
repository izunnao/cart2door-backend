import { Router } from "express";
import { handleAddOrder, handleAddShipping, handleGetOrders, handleGetOrdersForAdmin, handleGetShipping, handleVerifyPayment } from "./controllers.js";
import { addOrdersMiddleware, addShippingMiddleware, getOrdersMiddleware } from "./middlewares.js";
import { authenticate, authorize } from "../../middlewares/auth.js";

const orderRoute = Router()

orderRoute.post('/', authenticate, addOrdersMiddleware, handleAddOrder)
            .get('/', authenticate, getOrdersMiddleware, handleGetOrders)
            .get('/admin', authenticate, authorize, handleGetOrdersForAdmin);


orderRoute.get('/verify-payment', handleVerifyPayment)



orderRoute.post('/shipping', authenticate, addShippingMiddleware, handleAddShipping)
            .get('/shipping', authenticate, handleGetShipping);

export default orderRoute