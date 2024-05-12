import db from 'src/configs/database';
const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.category === 'all') {
        return await GetCategories(req, res);
      } else {
        return await GetCategoryDetail(req, res);
      }
    case "POST":
      return await CreateNewCategory(req, res);
    case "PUT":
      return await UpdateCategory(req, res);
    case "DELETE":
      return await DeleteCategory(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const Category = db.define('category', {
  id_category: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  seotitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'category',
  timestamps: false
});

const GetCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: [['id_category', 'id'], 'title', 'seotitle', 'active']
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const GetCategoryDetail = async (req, res) => {
  try {
    const id_category = req.query.category;
    const category = await Category.findOne({
      where: { id_category },
      attributes: ['id_category', 'title', 'seotitle', 'active']
    });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const CreateNewCategory = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is a required field." });
    }
    await Category.create({
      title: req.body.title,
      seotitle: req.body.seotitle,
      active: req.body.active,
    });
    return res.status(201).json({
      'status': 'berhasil',
      'responsecode': 'berhasil'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const UpdateCategory = async (req, res) => {
  try {
    const categoryId = req.query.category;
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is a required field." });
    }
    const categoryToUpdate = await Category.findByPk(categoryId);
    if (!categoryToUpdate) {
      return res.status(404).json({ message: "Category not found." });
    }
    await categoryToUpdate.update({
      title: req.body.title,
      seotitle: req.body.seotitle,
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

const DeleteCategory = async (req, res) => {
  try {
    const categoryId = req.query.category;
    const categoryToDelete = await Category.findByPk(categoryId);
    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found." });
    }
    await categoryToDelete.destroy();
    return res.status(200).json({
      status: "berhasil",
      responsecode: "berhasil"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
