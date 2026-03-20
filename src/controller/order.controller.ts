import type { NextFunction, Response } from "express";
import { Order } from "../model/order.model.js";
import type { RequestWithUser } from "../middleware/auth.js";
import { validationResult } from "express-validator";
import { Cart } from "../model/cart.model.js";
import { Product } from "../model/product.model.js";
import { v4 as uuidv4 } from "uuid";
import { raw } from "mysql2";
import { it } from "node:test";
import { OrderDetails } from "../model/orderdetails.model.js";
import { razorpay } from "../utils/RozarPay.js";
import sendEmail from "../utils/sendEmail.js";

export async function OrderData(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    // 1️⃣ Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg),
      });
    }

    // 2️⃣ Get logged-in user


    // 3️⃣ Extract request body
    const {
      order_address,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
      order_payment_mode,
      order_coupon_code,
      notes,
    } = req.body;






    const user_id: any = req.user?.id;
   
    
    console.log(user_id, "ye he user id")
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    const cartItems = await Cart.findAll({
      where: { user_id }, raw: true,
      include: [{ model: Product, as: "product" }],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }



    let order_total_amount = 0;
    let order_totalItems = 0;


    cartItems.forEach((item: any) => {


      const price = Number(item['product.product_price']) || 0;
      const qty = Number(item.product_qty) || 0;
      order_total_amount += price * qty;
      order_totalItems += qty;
    });
    console.log("Order Total Amount:", order_total_amount);
    console.log("Total Items:", order_totalItems);



    // console.log(JSON.stringify(cartItems, null, 2),)

    const products = cartItems.map((item: any) => ({
      name: item["product.product_name"],
      image: item["product.product_img"],
    }));


    const order_tax_amount = (order_total_amount * 18) / 100;
    let order_discount_amount = 0;
    if (order_coupon_code === "SAVE10") {
      order_discount_amount = order_total_amount * 0.10;


    }
    order_total_amount = order_total_amount + order_tax_amount - order_discount_amount;

    const paymentMode = (order_payment_mode || "COD").toUpperCase(); // default COD
    const order_txn_id = paymentMode === "COD" ? "COD-" + uuidv4() : "PAY-" + uuidv4();
    const order_status = paymentMode === "COD" ? "confirmed" : "pending";

    // console.log({
    //   user_id,
    //   order_txn_id,
    //   order_total_amount,
    //   order_tax_amount,
    //   order_discount_amount,
    //   order_coupon_code,
    //   order_payment_mode,
    //   order_status,
    //   order_address,
    //   order_totalItems,
    //   city,
    //   state,
    //   zipCode,
    //   country,
    //   phoneNumber,
    //   notes,
    // })




    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order_total_amount * 100), // amount in paise
      currency: "INR",
      receipt: order_txn_id,
      payment_capture: true, // ✅ boolean
    });









    const order = await Order.create({
      user_id,
      order_txn_id,
      order_total_amount,
      order_tax_amount,
      order_discount_amount,
      order_coupon_code: order_coupon_code || null,
      order_payment_mode: paymentMode,
      order_status,
      order_address,
      order_totalItems,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
      notes: notes || null,
    });



    const orderDetailsData = cartItems.map((item: any) => {
      const price = Number(item["product.product_price"]) || 0;
      const qty = Number(item.product_qty) || 0;

      return {
        order_id: order.id,
        product_id: item.product_id,
        product_price: price,
        price_qty: qty,
        product_tax: order_tax_amount,
        product_dics: order_discount_amount,
        product_total: price * qty,
      };
    });

   

await OrderDetails.bulkCreate(orderDetailsData);

await Cart.destroy({
  where: { user_id }
});

const productList = cartItems
  .map((item: any) => {
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img 
              src="${item["product.product_img"]}" 
              alt="${item["product.product_name"]}" 
              style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;"
            />
            <div>
              <div style="font-size: 14px; font-weight: 600; color: #222;">
                ${item["product.product_name"]}
              </div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                Qty: ${item.product_qty}
              </div>
            </div>
          </div>
        </td>

        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #444;">
          ₹${item["product.product_price"]}
        </td>

        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #111;">
          ₹${Number(item["product.product_price"]) * Number(item.product_qty)}
        </td>
      </tr>
    `;
  })
  .join("");

const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f8fb; font-family: Arial, sans-serif;">
  <div style="max-width: 700px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 28px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Thank You for Your Order 🎉</h1>
      <p style="margin: 10px 0 0; color: #ecfdf5; font-size: 14px;">
        Your order has been placed successfully
      </p>
    </div>

    <div style="padding: 28px;">
      <p style="margin: 0 0 16px; font-size: 15px; color: #333;">Hi there,</p>

      <p style="margin: 0 0 20px; font-size: 15px; color: #555; line-height: 1.7;">
        Thanks for shopping with <strong>Fresh Juice</strong>. We’ve received your order and we’re getting it ready for delivery.
      </p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 14px; font-size: 18px; color: #111827;">Order Summary</h3>

        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #374151;">
          <span>Order ID</span>
          <span style="font-weight: 600;">${order_txn_id}</span>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #374151;">
          <span>Payment Mode</span>
          <span style="font-weight: 600;">${paymentMode}</span>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #374151;">
          <span>Total Items</span>
          <span style="font-weight: 600;">${order_totalItems}</span>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #374151;">
          <span>Tax</span>
          <span style="font-weight: 600;">₹${order_tax_amount}</span>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #374151;">
          <span>Discount</span>
          <span style="font-weight: 600;">₹${order_discount_amount}</span>
        </div>

        <div style="height: 1px; background: #e5e7eb; margin: 14px 0;"></div>

        <div style="display: flex; justify-content: space-between; font-size: 18px; color: #111827; font-weight: 700;">
          <span>Total Amount</span>
          <span>₹${order_total_amount}</span>
        </div>
      </div>

      <h3 style="margin: 0 0 14px; font-size: 18px; color: #111827;">Items You Ordered</h3>

      <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="text-align: left; padding: 12px; font-size: 13px; color: #374151;">Product</th>
            <th style="text-align: center; padding: 12px; font-size: 13px; color: #374151;">Price</th>
            <th style="text-align: right; padding: 12px; font-size: 13px; color: #374151;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productList}
        </tbody>
      </table>

      <div style="margin-top: 24px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px;">
        <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.7;">
          We’ll notify you once your order is packed and on the way 🚚
        </p>
      </div>

      <p style="margin: 28px 0 0; font-size: 14px; color: #666; line-height: 1.7;">
        Thanks again,<br />
        <strong>Fresh Juice Team 🍹</strong>
      </p>
    </div>
  </div>
</body>
</html>
`;

const userEmail = req.user?.email;
console.log(userEmail,"data he ye ")

if (userEmail) {
  await sendEmail(
    userEmail,
    "Your Fresh Juice order is confirmed 🎉",
    emailHTML
  );
} else {
  console.log("User email not found, email not sent");
}

return res.status(201).json({
  status: "success",
  message: "Order created successfully",
  data: {
    order_id: order.id,
    order_txn_id: order.order_txn_id,
    order_total_amount,
    order_totalItems,
    data: order,
    products,
    razorpay_order: razorpayOrder || null,
  }
});






  } catch (err) {
    // console.error("Order create error:", err);
    // next(err);
    res.status(500).json({
      status: "feild",
      message: "this is wrong",
      err: err
    })
  }
}


export async function OrderGet(req: RequestWithUser, res: Response, next: NextFunction) {

  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(400).json({
        status: false,
        message: "User id is required",
      });
    }


    const OrderData = await Order.findOne({
      where: { user_id: user_id },
    })

    return res.status(201).json({
      status: "success",
      message: "Order of Data",
      data: OrderData
    })


  } catch (err) {
    res.status(500).json({
      status: "failed",
      err: err
    })

  }

}
