import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import { OrderDetails } from "./orderdetails.model.js";
export class Order extends Model {
    id;
    user_id;
    order_txn_id;
    order_totalItems;
    order_total_amount;
    order_tax_amount;
    order_discount_amount;
    order_coupon_code;
    city;
    state;
    zipCode;
    country;
    phoneNumber;
    order_payment_mode;
    order_status;
    order_address;
    notes;
    createdAt;
    updatedAt;
}
Order.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    order_txn_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    order_total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    order_totalItems: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    order_tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    order_discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    order_coupon_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    zipCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    order_payment_mode: {
        type: DataTypes.ENUM("COD", "ONLINE"),
        allowNull: false,
        defaultValue: "COD", // ✅ fixed
    },
    order_status: {
        type: DataTypes.ENUM("pending", "confirmed", "refunded", "cancelled"),
        allowNull: false,
        defaultValue: "pending", // ✅ fixed
    },
    order_address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: "orders",
    modelName: "Order",
    timestamps: true,
});
// ✅ Association
// Order.belongsTo(User, { foreignKey: "user_id", as: "user", targetKey: "id" });
Order.hasMany(OrderDetails, {
    foreignKey: "order_id",
    as: "order_details",
});
// OrderDetails.belongsTo(Product, {
//     foreignKey: "product_id",
// });
// Order.hasMany(OrderDetails, {
//   foreignKey: "order_id",
//   as: "order_details"
// });
// OrderDetails.belongsTo(Order, {
//   foreignKey: "order_id"
// });
