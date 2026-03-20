import express from "express";
import * as CartController from "../controller/cart.controller.js";
import { createCartValidation } from "../middleware/validators.js";
import { requireAuth } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.use(requireAuth);

/**
 * @swagger
 * /api/v1/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 */
cartRouter.post("/", createCartValidation, CartController.addToCart);


/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get all cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items list
 */
cartRouter.get("/", CartController.getCartItems);


/**
 * @swagger
 * /api/v1/cart/{product_id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated
 */
cartRouter.put("/:product_id", CartController.cartUpdate);


/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
cartRouter.delete("/", CartController.cartDestroy);

export default cartRouter;