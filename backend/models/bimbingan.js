import { Sequelize } from "sequelize";
// import db from "../db/connect.js";
import db from "../db/database.js";

const { DataTypes } = Sequelize;
const Bimbingan = db.define('bimbingan', {
    judul: {
        type: DataTypes.STRING
    },
    isi: {
        type: DataTypes.STRING
    },
    gambar: {
        type: DataTypes.STRING
    },
    category_id: {
        type: DataTypes.INTEGER
    },
    category_id: {
        type: DataTypes.INTEGER
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
    tableName: 'bimbingan',
    timestamps: false,  

});

(async () => {
    await db.sync();
})();

export default Bimbingan