import { DataTypes } from 'sequelize';
const { QueryTypes } = require('sequelize')
import db from 'src/configs/database';

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      console.log(req.query.cabang)
      if (req.query.cabang === 'all') {
        return await Getdata(req, res);
      } else {
        return await DetailPage(req, res);
      }
    case "POST":
      return await CreateNew(req, res);
    case "PUT":
      return await UpdatePage(req, res);
    case "DELETE":
      return await DeletePage(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}


const MapCabang = db.define('map_cabang', {
  id_cabang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_provinsi: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nama_cabang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat1: {
    type: DataTypes.STRING,
  },
  alamat2: {
    type: DataTypes.STRING,
  },
  no_telp: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.FLOAT,
  },
  longitude: {
    type: DataTypes.FLOAT,
  },
  tipe: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'map_cabang',
  timestamps: false, // If you don't need timestamps
});



const Getdata = async (req, res) => {
  try {
    const results = await MapCabang.findAll({
      attributes: [['id_cabang', 'id'], 'id_provinsi', 'nama_cabang', 'alamat1', 'alamat2', 'no_telp', 'email', 'latitude', 'longitude', 'tipe'],
    });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const DetailPage = async (req, res) => {
  try {
    const cabang_id = req.query.cabang;
    const sqlQuery = 'SELECT * FROM map_cabang where id_cabang = :cabang_id';
    const results = await db.query(sqlQuery, {
      replacements: { cabang_id },
      type: QueryTypes.SELECT,
    });

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const CreateNew = async (req, res) => {
  try {
    if (req.body.nama_cabang == '') {
      return res.status(400).json({ message: "id_provinsi and nama_cabang are required fields." });
    }
    const results = await MapCabang.create({
      id_provinsi: req.body.id_provinsi,
      nama_cabang: req.body.nama_cabang,
      alamat1: req.body.alamat1,
      alamat2: req.body.alamat2,
      no_telp: req.body.no_telp,
      email: req.body.email,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      tipe: req.body.tipe,
    });
    return res.status(201).json({
      status: 'berhasil',
      responsecode: 'berhasil',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const UpdatePage = async (req, res) => {
  try {
    const cabangid = req.query.cabang;
    if (!req.body.id_provinsi || !req.body.nama_cabang) {
      return res.status(400).json({ message: "id_provinsi and nama_cabang are required fields." });
    }
    const pageToUpdate = await MapCabang.findByPk(cabangid);
    // console.log(pageToUpdate)
    if (!pageToUpdate) {
      return res.status(404).json({ message: "Cabang not found." });
    }

    await pageToUpdate.update({
      id_provinsi: req.body.id_provinsi,
      nama_cabang: req.body.nama_cabang,
      alamat1: req.body.alamat1,
      alamat2: req.body.alamat2,
      no_telp: req.body.no_telp,
      email: req.body.email,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      tipe: req.body.tipe,
    });

    return res.status(200).json({
      status: "berhasil",
      responsecode: "berhasil",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
