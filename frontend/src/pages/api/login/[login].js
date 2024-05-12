import db from 'src/configs/database';
import { generateMD5Hash } from 'src/@core/utils/encp'
const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(400).json({ message: "bad request" });
    case "POST":
      if (req.query.login === 'auth') {
        return await UserAuth(req, res);
      }
      return res.status(400).json({ message: "bad request" });
  }
}

const User = db.define('users', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nama_lengkap: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  no_telp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userpicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  blokir: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  id_session: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tgl_daftar: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  forget_key: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locktype: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
});

const UserAuth = async (req, res) => {
  try {

    console.log(req.body.username === '' && req.body.password === '')
    if (req.body.username === '' && req.body.password === '') {
      return res.status(400).json({ message: "Username and password are required fields." });
    } else {

      const username = req.body.email
      const password = generateMD5Hash(req.body.password)
      const user = await User.findOne({
        where: {
          username: username,
          password: password
        }
      });
      console.log(user, 'panjang data')
      if (user === null) {
        return res.status(500).json({
          data: [
            'undefined data access'
          ]
        });
      } else {
        return res.status(200).json({
          userData: user, accessToken:
            'adadsaa'
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
