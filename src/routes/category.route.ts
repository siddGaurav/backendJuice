import express from "express";
import * as CategoryController from "../controller/category.controller.js";
import { createCategoryValidation, updateCategoryValidation } from "../middleware/validators.js";
import { catFile } from "../middleware/uploadcategories.js";

const categoryRouter = express.Router();

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fruits
 *               description:
 *                 type: string
 *                 example: Fresh fruit juices
 *     responses:
 *       200:
 *         description: Category created
 */
categoryRouter.post("/", createCategoryValidation, CategoryController.createCategory);


/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Category list
 */
categoryRouter.get("/", CategoryController.getCategories);


/**
 * @swagger
 * /api/v1/category/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Category deleted
 */
categoryRouter.delete("/:id", CategoryController.deleteCategory);


/**
 * @swagger
 * /api/v1/category/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *                 example: Cold Drinks
 *               description:
 *                 type: string
 *                 example: All cold beverages
 *     responses:
 *       200:
 *         description: Category updated
 */
categoryRouter.put("/:id", updateCategoryValidation, CategoryController.updateCategory);


/**
 * @swagger
 * /api/v1/category/upload:
 *   post:
 *     summary: Upload category file
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
categoryRouter.post("/upload", catFile.single("file"), CategoryController.CreatCategoriesFile);

export default categoryRouter;