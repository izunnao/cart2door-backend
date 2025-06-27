import { Router } from "express";
import { handleAddOrder } from "./controllers.js";
import { addOrdersMiddleware } from "./middlewares.js";

const orderRoute = Router()

orderRoute.post('/', addOrdersMiddleware, handleAddOrder);

export default orderRoute