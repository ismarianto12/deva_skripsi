import db from 'src/configs/database';

const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      console.log(req.query.artikel)
      if (req.query.tag === 'all') {
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

const Getdata = async (req, res) => {
  try {
    const sqlQuery = 'select id_tag as id, tag_title, tag_seo, created_at, updated_at, user_id, count from tag';
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
    const sqlQuery = 'SELECT * FROM pages where id_pages = :id_artikel';
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
    const results = await Pages.create({
      title: req.body.title,
      titleen: req.body.titleen,
      content: req.body.content,
      contenten: req.body.contenten,
      seotitle: req.body.seotitle,
      tags: req.body.tags,
      picture: req.body.picture,
      active: req.body.active,
    });
    return res.status(201).json({
      status: 'berhasil',
      responsecode: 'berhasil'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const UpdatePage = async (req, res) => {
  try {
    const pageId = req.query.artikel;
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: "Title and content are required fields." });
    }
    const pageToUpdate = await Pages.findByPk(pageId);
    if (!pageToUpdate) {
      return res.status(404).json({ message: "Page not found." });
    }
    await pageToUpdate.update({
      title: req.body.title,
      titleen: req.body.titleen,
      content: req.body.content,
      contenten: req.body.contenten,
      seotitle: req.body.seotitle,
      tags: req.body.tags,
      picture: req.body.picture,
      active: req.body.active,
    });

    return res.status(200).json({
      status: "berhasil",
      responsecode: "berhasil"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const DeletePage = async (req, res) => {
  try {
    const pageId = req.query.artikel;
    const pageToDelete = await Pages.findByPk(pageId);

    if (!pageToDelete) {
      return res.status(404).json({ message: "Page not found." });
    }

    await pageToDelete.destroy();

    return res.status(200).json({
      status: "berhasil",
      responsecode: "berhasil"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
