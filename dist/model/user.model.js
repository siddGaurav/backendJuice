import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export class User extends Model {
    id;
    name;
    email;
    phone;
    password;
    createdAt;
    updatedAt;
}
User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
    }
}, {
    sequelize, // connection
    tableName: "accounts", // DB table name
    modelName: "User", // Sequelize model name
    timestamps: true,
});
