import Express from "express";
import { createPdf } from "../controller/invoiceController.js";
import { requireAuth } from "../middleware/auth.js";

const invoiceRouter = Express.Router();

// invoiceRouter.use(requireAuth)

/**
 * @swagger
 * /api/v1/invoice/{id}:
 *   get:
 *     summary: Generate invoice PDF
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Invoice PDF generated
 */
invoiceRouter.get("/:id", createPdf);

export default invoiceRouter;