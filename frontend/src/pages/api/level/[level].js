import db from 'src/configs/database';

const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      console.log(req.query.level, 'detail parameter')
      if (req.query.level === 'all') {
        return await Getdata(res, res)
      } else {
        return await DetailPage(req, res)
      }
    case "POST":
      return await CreateUser(req, res);
    case "PUT":
      return await UpdatePost(req, res);
    case "DELETE":
      return await DeletePost(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const UserLevel = db.define('user_level', {
  id_level: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'user_level',
  timestamps: false,
});

const Getdata = async (req, res) => {
  try {
    const sqlQuery = `
    select
      id_level as id,
      level
      from user_level
     `;
    const results = await db.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
const DetailPage = async (req, res) => {

  try {
    const level = req.query.level;
    const sqlQuery = 'SELECT * FROM user_level where id_level = :level';
    const results = await db.query(sqlQuery, {
      replacements: { level },
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const CreateUser = async (req, res) => {
  try {
    const { username, password, email, nama_lengkap, no_telp, sector, bio, userpicture, level, blokir, id_session, tgl_daftar, forget_key, locktype } = req.body;
    const existingUser = await User.findOne({
      where: {
        [db.Op.or]: [{ username }, { email }]
      }
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const newUser = await User.create({
      username,
      password, // Remember to hash the password before saving to the database
      email,
      nama_lengkap,
      no_telp,
      sector,
      bio,
      userpicture,
      level,
      blokir,
      id_session,
      tgl_daftar,
      forget_key,
      locktype
    });

    return res.status(201).json({
      status: 'success',
      user: newUser
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const UpdatePost = async (req, res) => {
  try {
    const postId = req.query.artikel;
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: "Title and content are required fields." });
    }
    const postToUpdate = await Post.findByPk(postId);
    if (!postToUpdate) {
      return res.status(404).json({ message: "Post not found." });
    }
    await postToUpdate.update({
      stockcode: req.body.stockcode,
      title: req.body.title,
      content: req.body.content,
      seotitle: req.body.seotitle,
      tags: req.body.tags,
      tag: req.body.tag,
      date: req.body.date,
      time: req.body.time,
      editor: req.body.editor,
      protect: req.body.protect,
      active: req.body.active,
      headline: req.body.headline,
      picture: req.body.picture,
      hits: req.body.hits,
    });

    return res.status(200).json({
      status: "berhasil",
      responsecode: "berhasil"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const DeletePost = async (req, res) => {
  console.log(req.query.artikel);
  try {
    const postId = req.query.artikel;
    const postToDelete = await Post.findByPk(postId);

    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found." });
    }

    await postToDelete.destroy();

    return res.status(200).json({
      status: "berhasil",
      responsecode: "berhasil"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};






