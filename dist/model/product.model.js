import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export class Product extends Model {
    id;
    product_name;
    product_desc;
    product_img;
    product_price;
    product_benifit;
    product_size;
    product_unit;
    cat_id;
    product_sku;
    product_status;
    createdAt;
    updatedAt;
}
Product.init(//Product.init() is used to define the model (table structure).
{
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    product_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    product_desc: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    product_img: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    product_price: {
        type: DataTypes.DOUBLE,
    },
    product_benifit: {
        type: DataTypes.STRING(255),
    },
    product_size: {
        type: DataTypes.STRING(255),
    },
    product_unit: {
        type: DataTypes.STRING(5)
    },
    product_sku: {
        type: DataTypes.STRING(100)
    },
    product_status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    cat_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
}, {
    sequelize, // connection
    tableName: "product", // DB table name
    modelName: "Product", // Sequelize model name
    timestamps: true,
});
