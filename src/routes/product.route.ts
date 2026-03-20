import Express from "express";
import multer from "multer";
import * as product from "../controller/product.controller.js";
import { createProductValidation } from "../middleware/validators.js";
import { productFile } from "../middleware/uploadcategories.js";

const productRouter = Express.Router();

export const cloud = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @swagger
 * /api/v1/product:
 *   post:
 *     summary: Create new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *               - product_price
 *               - product_sku
 *               - cat_id
 *               - product_img
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: Orange Juice
 *               product_price:
 *                 type: number
 *                 example: 120
 *               product_desc:
 *                 type: string
 *                 example: Fresh orange juice
 *               product_sku:
 *                 type: string
 *                 example: ORJ-001
 *               product_benifit:
 *                 type: string
 *                 example: Rich in Vitamin C
 *               product_size:
 *                 type: string
 *                 example: 500
 *               product_unit:
 *                 type: string
 *                 example: ml
 *               cat_id:
 *                 type: integer
 *                 example: 1
 *               product_img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */
productRouter.post("/", cloud.single("product_img"), createProductValidation, product.addProduct);


/**
 * @swagger
 * /api/v1/product/upload:
 *   post:
 *     summary: Upload product file
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
productRouter.post("/upload", productFile.single("productFile"), product.productFileUplaoder);


/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Product list
 */
productRouter.get("/", product.getProducts);


/**
 * @swagger
 * /api/v1/product/product_cat/{id}:
 *   get:
 *     summary: Get products by category
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Products by category
 */
productRouter.get("/product_cat/:id", product.searchcategory);


/**
 * @swagger
 * /api/v1/product/search:
 *   get:
 *     summary: Search products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         example: juice
 *     responses:
 *       200:
 *         description: Search result
 */
productRouter.get("/search", product.searchProducts);



/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product details
 */
productRouter.get("/:id", product.getProductById);


/**
 * @swagger
 * /api/v1/product/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product deleted
 */
productRouter.delete("/:id", product.deleteProduct);

export default productRouter;




// const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
// fs.mkdirSync(uploadsDir, { recursive: true });
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadsDir),
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_');
//         cb(null, `${Date.now()}_${base}${ext}`);
//     }
// });
// const upload = multer({ storage });