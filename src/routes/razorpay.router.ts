import express from "express";
import { createOrder } from "../controller/razorpay.js";
import { requireAuth } from "../middleware/auth.js";

const razonpayRouter = express.Router();

razonpayRouter.use(requireAuth);

/**
 * @swagger
 * /api/v1/razorpay/creater-order:
 *   post:
 *     summary: Create Razorpay order
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               currency:
 *                 type: string
 *                 example: INR
 *     responses:
 *       200:
 *         description: Razorpay order created successfully
 */
razonpayRouter.post("/creater-order", createOrder);

export default razonpayRouter;