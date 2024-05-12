import { Sequelize } from "sequelize"; 
import db from "../db/database.js";

const { DataTypes } = Sequelize;
const Identitas = db.define('identitas', {
    nama: {
        type: DataTypes.STRING
    },
    alamat: {
        type: DataTypes.STRING
    },
    npwp: {
        type: DataTypes.STRING
    },
    fax: {
        type: DataTypes.INTEGER
    },
    telp: {
        type: DataTypes.INTEGER
    },
    no_telp: {
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.INTEGER
    },
    nama_pimpinan: {
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
    tableName: 'identitas',
    timestamps: false,

});

(async () => {
    await db.sync();
})();

export default Identitas