import { QueryTypes, Op } from 'sequelize';
import db from '../db/database.js'
import multer from 'multer'
import Posts from '../models/post.js'
import Post from '../models/post.js';
import JenisBarang from '../models/Jenis_barang.js';
import Barang from '../models/Barang.js';



// list datat bimibingan
const ListJenis = async (req, res) => {
    try {
        let { page = 1, pageSize = 10 } = req.body
        // console.log(q,"query searc")
        const q = req.query.q
        if (req.query.page) {
            const onlyLettersPattern = /^[0-9]+$/
            if (page.match(onlyLettersPattern) || page < 0) {
                res.status(400).json({
                    err: "Special characters and only numbers"
                })
            }
        }
        page = parseInt(page)
        pageSize = parseInt(pageSize)
        const offset = (page - 1) * pageSize


        let whereClause = {}
        if (q != '') {
            whereClause = {
                jenis_barang: {
                    [Op.like]: `%${q}`
                }
            }
        }
        const data = await JenisBarang.findAll({
            limit: parseInt(pageSize) ? parseInt(pageSize) : 0,
            offset,
            where: whereClause
        })
        res.json({
            data: data,
            page,
            pageSize,
            total: data.length
        })

    } catch (error) {
        res.status(400).json({
            err: error.message
        })
    }
}



const ListArtikel = async (req, res) => {
    try {
        let { page = 1, pageSize = 10, search = '' } = req.query;
        if (req.query.page) {
            const onlyLettersPattern = /^[0-9]+$/;
            if (!page.match(onlyLettersPattern) || page < 0) {
                return res.status(400).json({ err: "No special characters and no numbers, please!" })
            }
        }
        page = parseInt(page);
        pageSize = parseInt(pageSize);

        const offset = (page - 1) * pageSize;

        let whereClause = {}
        if (search !== '') {
            whereClause = {
                nama: {
                    [Op.like]: `%${search}%`
                }
            };
        }
        const users = await Post.findAll({
            limit: parseInt(pageSize) ? parseInt(pageSize) : 0,
            offset,
            where: whereClause,
        });

        res.json({
            data: users,
            page,
            pageSize,
            total: users.length, // Note: This may not be accurate for large datasets, consider using COUNT query
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }

}

const storage = multer.diskStorage({
    destination: (req, res) => {
        cb(null, 'public/images/')
    }, filename: (req, res) => {
        cb(null, Date.now, + path.extname(file.originalname))
    }
})
const upload = multer({ storage })
const Create = async (req, res) => {
    try {
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/images');
            },
            filename: function (req, file, callback) {
                var temp_file_arr = file.originalname.split(".");
                var temp_file_name = temp_file_arr[0];
                var temp_file_extension = temp_file_arr[1];
                callback(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension);
            }
        });
        var upload = multer({ storage: storage }).single('gambar');
        let filename = ''
        upload(req, res, function (error) {
            filename = req.file.filename
        });
        const created_at = new Date()
        const updated_at = new Date()
        // const { gambar } = req.file
        console.log(filename, 'gambarnya')
        const { judul, isi, category_id, user_id } = req.body
        Posts.create({
            judul,
            isi,
            // gambar: filename,
            category_id,
            user_id,
            created_at,
            updated_at
        })
        res.status(200).json({
            messages: 'successfully insert data',
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
}

const Show = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Post.findOne({
            where: { id: id },
            rejectOnEmpty: false,
        })
        res.status(200).json({
            data: data,
            msg: 'detail data',
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}

const Edit = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Post.findOne({
            where: { id: id },
            rejectOnEmpty: false,
        })
        res.status(200).json({
            data: data,
            msg: 'detail data',
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}
const Update = (req, res) => {

}
const Delete = async (req, res) => {
    const id = req.params.id
    try {
        
        await JenisBarang.destroy({
            where: {
                id: id
            },
        });
        res.status(200).json({
            msg: 'date berhasil di hapus',
        })
    } catch (error) {
         console.log(id,'adas')
        res.status(500).json({
            error: error.message,
        })
    }

}

export { Create, Edit, Update, Delete, Show, ListArtikel, ListJenis }

