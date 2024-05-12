import db from 'src/configs/database';

const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.galeri == 'all') {
        return await Getdata(req, res)
      } else {
        return await DetailPage(req, res)
      }
    case "POST":
      return await CreateNew(req, res);
    case "PUT":
      return await Update(req, res);
    case "DELETE":
      return await Delete(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}
// model define
const Post = db.define('galeri', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  gambar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tahun: {
    type: DataTypes.STRING,
    allowNull: true
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'galery',
  timestamps: false
});


const Getdata = async (req, res) => {
  try {
    const sqlQuery = `
    select
    g.id,
    g.title,
    g.deskripsiId,
    g.deskripsiEn,
    g.id_album,
    g.gambar,
    a.title  as albumtitle,
    g.created_at
    from galery g
     left join album a on g.id_album = a.id_album
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
    const galery = req.query.galeri;
    const sqlQuery = 'SELECT * FROM galery where id = :galery';
    const results = await db.query(sqlQuery, {
      replacements: { galery },
      type: QueryTypes.SELECT,
    });
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const CreateNew = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: "Title and content are required fields." });
    }
    const results = await Post.create({
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
    return res.status(201).json({
      'status': 'berhasil',
      'responsecode': 'berhasil'
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






