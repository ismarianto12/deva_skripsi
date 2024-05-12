import db from 'src/configs/database';

const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.artikel) {
        return await DetailPage(req, res);
      } else {
        return await Getdata(req, res);
      }
    case "POST":
      return await CreateNew(req, res);
    case "PUT":
      return await UpdatePost(req, res);
    case "DELETE":
      return await DeletePost(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}
const Post = db.define('post', {
  id_post: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_category: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockcode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  seotitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  editor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  protect: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  headline: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hits: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'post',
  timestamps: false
});



const Pages = db.define('page', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
});

const Getdata = async (req, res) => {
  try {
    const sqlQuery = `SELECT
    id,
    namapenghargaan,
    kategori,
    diberikanoleh,
    lokasi,
    tahun,
    file,
    created_at,
    updated_at,
    user_id
    FROM penghargaan`;
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
    const id_artikel = req.query.artikel;
    const sqlQuery = 'SELECT * FROM post where id_post = :id_artikel';
    const results = await db.query(sqlQuery, {
      replacements: { id_artikel },
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






