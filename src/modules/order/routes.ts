import { Router } from "express";
import { handleAddOrder, handleAddShipping, handleGetOrders, handleGetShipping } from "./controllers.js";
import { addOrdersMiddleware, addShippingMiddleware, getOrdersMiddleware } from "./middlewares.js";
import { authenticate } from "../../middlewares/auth.js";

const orderRoute = Router()

orderRoute.post('/', authenticate, addOrdersMiddleware, handleAddOrder)
            .get('/', authenticate, getOrdersMiddleware, handleGetOrders);


orderRoute.post('/shipping', authenticate, addShippingMiddleware, handleAddShipping)
            .get('/shipping', authenticate, handleGetShipping);

export default orderRoute