import { DataTypes } from 'sequelize'; 
import db from '../db/database.js';
const Alumni = db.define('alumni', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    tempat_lahir: {
        type: DataTypes.STRING(14),
        allowNull: true,
    },
    tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    jk: {
        type: DataTypes.STRING(1),
        allowNull: true,
    },
    tahun_masuk: {
        type: DataTypes.STRING(4),
        allowNull: true,
    },
    tahun_lulus: {
        type: DataTypes.STRING(4),
        allowNull: true,
    },
    ipk: {
        type: DataTypes.STRING(4),
        allowNull: true,
    },
    alamat_tinggal: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    alamat_domisili: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    kecamatan: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    kabupaten: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    no_handphone: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    status_pekerjaan: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    pekerjaan: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    jabatan: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    alamat_tempat_kerja: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    disclaimer: {
        type: DataTypes.STRING(50),
        allowNull: true,
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
    },
}, {
    tableName: 'alumni',
    timestamps: false, // Assuming you don't want timestamps for created_at and updated_at
});

export default Alumni;
