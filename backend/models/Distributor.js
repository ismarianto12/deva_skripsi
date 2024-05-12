import { DataTypes } from 'sequelize';
import db from '../db/database.js';
const Distributor = db.define('Distributor', {
    id_distributor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_distributor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telepon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: db.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: db.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'distributor', // Nama tabel dalam database
    timestamps: false // Nonaktifkan timestamps otomatis (createdAt dan updatedAt)
});

(async () => {
    await Distributor.sync();
})();
export default Distributor