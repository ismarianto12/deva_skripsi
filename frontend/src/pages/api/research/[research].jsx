import db from 'src/configs/database';

const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.research == 'all') {
        return await GetResearchData(req, res);
      } else {
        return await GetResearchData(req, res);
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
const Research = db.define('research', {
  id_research: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  research_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  favourite: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'research',
  timestamps: false
});


const GetResearchData = async (req, res) => {
  try {
    const sqlQuery = 'SELECT * FROM research';
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






