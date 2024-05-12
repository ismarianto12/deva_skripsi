import { Sequelize } from "sequelize";
import db from "../db/database.js";
const { DataTypes } = Sequelize;
const Category = db.define('category', {
    category: {
        type: DataTypes.STRING
    },   
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    freezeTableName: true,
    tableName: 'category',
    timestamps: false,
    // prima 
});

(async () => {
    await db.sync();
})();
export default Category