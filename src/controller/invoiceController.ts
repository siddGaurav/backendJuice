import type { NextFunction, Response } from "express";
import type { RequestWithUser } from "../middleware/auth.js";
import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";
import { createInvoicePDF } from "../service/pdfService.js";
import { OrderDetails } from "../model/orderdetails.model.js";
import { Product } from "../model/product.model.js";

export async function createPdf(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) {
    try {
        const orderId: any = req.params.id;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        // ✅ REMOVE raw:true
        const order: any = await Order.findOne({
            where: { id: orderId },
            attributes: [
                "id",
                "createdAt",
                "order_total_amount",
                "order_tax_amount",
                "order_discount_amount",

                // ✅ ADD THESE
                "order_payment_mode",
                "order_status",
                "order_coupon_code",
                "order_address",
                "city",
                "state",
                "zipCode",
                "country",
            ],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["name", "email", "phone"],
                },
                {
                    model: OrderDetails,
                    as: "order_details",
                    attributes: [
                        "id",
                        "order_id",
                        "product_id",
                        "product_price",
                        "price_qty",
                        "product_total",
                        "product_tax",
                        "product_dics"
                    ],
                    include: [
                        {
                            model: Product,
                            attributes: ["product_name", "product_img", "product_size",
                                "product_sku"]
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        console.log(order)

        // ✅ Build Items Properly
        const orderData = order.get({ plain: true });

        const items = orderData.order_details.map((item: any) => ({
            description: item.Product?.product_name || "-",
            quantity: Number(item.price_qty) || 0,
            unitPrice: Number(item.product_price) || 0,
            size: item.Product?.product_size || "-",
            sku: item.Product?.product_sku || "-",
            pricetotal: Number(item.product_total) || 0
        }));

        const subtotal = items.reduce(
            (sum: number, item: any) => sum + item.pricetotal,
            0
        );
        const capitalizeFirstLetter = (text: any) => {
            if (!text) return "";
            const str = String(text).trim();
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        const taxTotal = Number(orderData.order_tax_amount) || 0;
        const discount = Number(orderData.order_discount_amount) || 0;
        const grandTotal = subtotal + taxTotal - discount;

        const invoice = {
            invoiceNumber: `-007${orderData.id}`,
            date: orderData.createdAt,

            client: {
                clientName: capitalizeFirstLetter(orderData.user?.name) || "",
                email: orderData.user?.email || "",
                phone: orderData.user?.phone || "",
            },

            // ✅ PAYMENT FIX
            payment: {
                mode: orderData.order_payment_mode || "N/A",
                status: orderData.order_status || "Pending",
                coupon: orderData.order_coupon_code || "No Coupon",
            },

            // ✅ ADDRESS FIX
            address: {
                addressLine: orderData.order_address || "",
                city: orderData.city || "",
                state: orderData.state || "",
                zip: orderData.zipCode || "",
                country: orderData.country || "",
            },

            items,
            subtotal,
            taxTotal,
            discount,
            grandTotal,
        };
        console.log("FINAL INVOICE DATA =>", JSON.stringify(invoice, null, 2));

        const pdfBuffer = await createInvoicePDF(invoice);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=invoice-${order.id}.pdf`,
        });

        res.send(pdfBuffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Invoice generation failed",
            error: err,
        });
    }
}