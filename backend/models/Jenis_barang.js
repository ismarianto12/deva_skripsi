import { DataTypes } from 'sequelize';
import db from '../db/database.js';
import Barang from './Barang.js';

const JenisBarang = db.define('jenis_barang', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jenis_barang: {
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
    tableName: 'jenis_barang', // Nama tabel dalam database
    timestamps: false // Nonaktifkan timestamps otomatis (createdAt dan updatedAt)
});

// JenisBarang.belongsTo(Barang, {
//     foreignKey: 'id_jenisbarang',
//     as: 'jenis_barang'
// });

// Sinkronkan model dengan database
(async () => {
    await JenisBarang.sync();
})();

export default JenisBarang