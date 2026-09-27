import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/db.js';
export class profileDetails extends Model {
    id;
    user_id;
    address;
    state;
    city;
    zipcode;
    country;
    phoneNumber;
    createdAt;
    updatedAt;
}
profileDetails.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    zipcode: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
}, {
    sequelize,
    tableName: "profile_details",
    modelName: "ProfileDetails",
    timestamps: true,
});
