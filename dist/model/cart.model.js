import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { Product } from "./product.model.js";
export class Cart extends Model {
    id;
    product_id;
    product_qty;
    user_id;
    createdAt;
    updatedAt;
}
Cart.init(//Cart.init() is used to define the model (table structure).
{
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    product_qty: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
}, {
    sequelize, // connection
    tableName: "carts", // DB table name
    modelName: "Cart", // Sequelize model name
    timestamps: true,
});
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Cart, { foreignKey: 'product_id', as: 'cartItems' });
