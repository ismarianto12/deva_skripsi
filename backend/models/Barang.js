import { DataTypes } from 'sequelize';
import db from '../db/database.js';
import JenisBarang from './Jenis_barang.js';

const Barang = db.define('Barang', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_barang: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  harga: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  jumlah_stok: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_jenisbarang: {
    type: DataTypes.INTEGER,
    allowNull: false
    // Anda mungkin ingin menambahkan referensi ke tabel JenisBarang di sini
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'barang', // Nama tabel dalam database
  timestamps: false // Jika Anda ingin Sequelize menambahkan kolom 'createdAt' dan 'updatedAt', gantilah menjadi 'true'
});


(async () => {
  await db.sync();
})();

Barang.hasOne(JenisBarang, {
  foreignKey: 'id', // Nama kolom foreign key di tabel Barang
  as: 'jenis_barang' // Alias untuk mengakses data JenisBarang dari Barang
});


export default Barang