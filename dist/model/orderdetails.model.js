import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { Product } from "./product.model.js";
export class OrderDetails extends Model {
    id;
    order_id;
    product_id;
    product_price;
    product_tax;
    product_dics;
    price_qty;
    product_total;
    createdAt;
    updatedAt;
}
OrderDetails.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    product_dics: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    product_tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    product_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    price_qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    product_total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: "order_details",
    modelName: "OrderDetails",
    timestamps: true,
});
// OrderDetails.belongsTo(Order, {
//     foreignKey: "order_id",
// });
Product.hasMany(OrderDetails, {
    foreignKey: "product_id",
});
