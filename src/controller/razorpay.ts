import type { NextFunction, Request, Response } from "express";
import { error } from "node:console";
import type { RequestWithUser } from "../middleware/auth.js";
import { Cart } from "../model/cart.model.js";
import { Product } from "../model/product.model.js";



export async function createOrder(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const order_coupon_code = req.body?.order_coupon_code || null;
        const user_id: any = req.user?.id;
        if (!user_id) {
            return res.status(400).json({
                status: error
            })
        }
        const cartItem = await Cart.findAll({
            where: { user_id }, raw: true,
            include: [{ model: Product, as: "product" }],
        });
        console.log(cartItem, "ye hai cart item")
        if (cartItem.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Cart is empty"
            })
        }
        let order_total_amount = 0;
        let qty = 0
        // cartItem.forEach((item: any) => {
        //     const price = Number(item['product.product_price']) || 0;
        //     const qty = Number(item.product_qty) || 0;
        //     order_total_amount += price * qty;

        // })
        cartItem.forEach((item: any) => {
            order_total_amount += item['product.product_price'] * item.product_qty;
            qty += Number(item.product_qty) || 0;

        });
        console.log("Order Total Amount:", order_total_amount, "ye he qty", qty);

        if (order_coupon_code === "SAVE10") {
            order_total_amount -= order_total_amount * 0.10
        }

        const gstPercentage = 18;
        const gstAmount = (order_total_amount * gstPercentage) / 100
        const float = Number(gstAmount.toFixed(2))

        const finalAmount = order_total_amount + float;




        console.log("Final Amount (including GST):", finalAmount);


        res.status(200).json({
            status: "success",
            message: "Order created successfully",
            data: {
                order_total_amount,
                gstAmount: float,
                finalAmount,
                qty
            }
        })







        // const cartItems = await Cart.findAll({
        //     where: { userId },
        //     include: [{ model: Product }],
        // });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to create order",
            error: err instanceof Error ? err.message : String(err),
        });
        next(err)

    }
}