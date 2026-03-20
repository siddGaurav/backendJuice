import express from 'express';
import authRouter from './routes/auth.route.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.routes.js';
import razonpayRouter from './routes/razorpay.router.js';
import rateLimit from 'express-rate-limit';
import compression from 'compression'
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swager.js";

import cors from 'cors';
import invoiceRouter from './routes/invoiceRoutes.js';



const limits = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,   // 5 login attempts only
    message: "Too many login attempts"
})
// import invoiceRouter from './routes/invoiceRoutes.js';
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(compression())
app.use(cors())

app.use(express.json()); // application label middleware
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth", limits, authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use('/api/v1/invoice', invoiceRouter);
app.use("/api/v1/pay", razonpayRouter)



export default app;