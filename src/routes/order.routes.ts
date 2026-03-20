import express from "express";
import { OrderData, OrderGet } from "../controller/order.controller.js";
import { requireAuth } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.use(requireAuth);

/**
 * @swagger
 * /api/v1/order:
 *   post:
 *     summary: Create new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: Delhi, India
 *               payment_method:
 *                 type: string
 *                 example: COD
 *     responses:
 *       200:
 *         description: Order placed successfully
 */
orderRouter.post("/", OrderData);


/**
 * @swagger
 * /api/v1/order:
 *   get:
 *     summary: Get all orders of user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
orderRouter.get("/", OrderGet);

export default orderRouter;