import db from 'src/configs/database';
import { IncomingForm } from 'formidable';
import formData from 'form-data';

import fs from 'fs';

import path from 'path';

var mv = require('mv');
const { DataTypes } = require('sequelize')
const { QueryTypes } = require('sequelize')

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (req.query.artikel === 'all') {
        return await Getdata(req, res);
      } else {
        return await DetailPage(req, res);
      }
    case "POST":
      return await createNew(req, res);
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
    allowNull: false,
    defaultValue: null
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



const Getdata = async (req, res) => {
  try {
    const sqlQuery = `SELECT
                    DATE_FORMAT(post.date,"%Y-%M-%d") as created_at,
                    DATE_FORMAT(post.date,"%Y-%M-%d") as updated_at,
                    id_post as id,
                    id_category,
                    stockcode,
                    title,
                    content,
                    seotitle,
                    tags,
                    tag,
                    date,
                    time,
                    editor,
                    protect,
                    active,
                    headline,
                    picture,
                    hits,
                    new_version
    FROM post order by id_post desc`;
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

const CreateNewbakc = async (req, res) => {
  try {
    if (req.body.headline === '' || req.body.content === '') {
      return res.status(400).json({ message: "Title and content are required fields." });
    }

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      const oldPath = files.file.filepath;
      const newPath = `./public/${files.file.originalFilename}`;

      mv(oldPath, newPath, async function (err) {
        if (err) {
          return res.status(500).json({ message: "Error moving the file." });
        }

        try {
          await Post.create({
            id_category: "1",
            stockcode: "2",
            title: "2",
            content: "2",
            seotitle: "2",
            tags: fields.tags,
            tag: fields.tag,
            date: fields.date,
            time: fields.time,
            editor: fields.editor,
            protect: fields.protect,
            active: fields.active,
            headline: fields.headline,
            picture: fields.picture,
            hits: fields.hits,
          });

          return res.status(201).json({
            status: 'berhasil',
            responsecode: 'berhasil'
          });
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
// const createNewback = async (req, res) => {

//   const query = `
//   INSERT INTO post (
//     id_category, stockcode, title, content, seotitle,
//     tags, tag, headline, picture, hits
//   ) VALUES (
//     :id_category, :stockcode, :title, :content, :seotitle,
//     :tags, :tag, :headline, :picture, :hits
//   )
// `;

//   const replacements = {
//     id_category: "1",
//     stockcode: "1",
//     title: "1",
//     content: "2",
//     seotitle: "1",
//     tags: "2",
//     tag: '0',
//     headline: "1",
//     picture: '',
//     hits: "1",
//   };

//   db.query(query, {
//     replacements,
//     type: db.QueryTypes.INSERT,
//   }).then(() => {
//     console.log('Row inserted successfully');
//   }).catch(error => {
//     console.error('Error inserting row:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   });

//   const form = new IncomingForm()
//   const uploadDir = path.join(process.cwd(), 'public/uploadfile');
//   form.uploadDir = uploadDir;

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ message: 'File upload failed' });
//     }
//     const uploadedFile = files.file;
//     // const idCategory = fields.id_category;
//     // const headline = fields.headline;
//     // // const tags = JSON.parse(fields.tags);
//     // const active = fields.active;
//     // const content = fields.content;

//     // console.log(fields.id_category[0], 'detail')
//     // await Post.create({
//     //   id_category: fields.id_category[0],
//     //   stockcode: 1,
//     //   title: fields.headline[0],
//     //   content: fields.content[0],
//     //   seotitle: fields.headline[0],
//     //   tags: fields.tags[0],
//     //   tag: '0',
//     //   headline: fields.headline[0],
//     //   picture: '',
//     //   hits: 1,
//     // });




//     try {
//       const fileData = await fs.readFile(uploadedFile?.path);
//       const newFilename = generateUniqueFilenameWithExtension(uploadedFile.name);
//       const newFilePath = path.join(uploadDir, newFilename);


//       await fs.writeFile(newFilePath, fileData);
//     } catch (readErr) {
//       console.error(readErr);
//     }

//     return res.status(200).json({ message: 'File uploaded successfully' });
//   });
// }

const createNew = async (req, res) => {
  let data = await req.formData();
  const file = data.get('files');
  if (!file) {
    return res.status(400).json({ message: "Post not found." });
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

export const config = {
  // runtime: 'experimental-edge',
  api: {
    externalResolver: true,
    bodyParser: false
  }
};



