import { Router } from "express";
import { handleAddOrder } from "./controllers.js";

const router = Router()

router.get('/add-order', handleAddOrder);

export default router