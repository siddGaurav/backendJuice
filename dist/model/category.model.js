import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export class Category extends Model {
    id;
    cat_name;
    cat_desc;
    cat_slug;
    cat_status;
    createdAt;
    updatedAt;
}
Category.init(//Category.init() is used to define the model (table structure).
{
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    cat_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    cat_desc: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    cat_slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    cat_status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {
    sequelize, // connection
    tableName: "categories", // DB table name
    modelName: "Category", // Sequelize model name
    timestamps: true,
});
