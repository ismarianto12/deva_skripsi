import { Op } from 'sequelize';
import Category from '../models/category.js';
const ListCategory = async (req, res) => {
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
        const users = await Category.findAll({
            limit: parseInt(pageSize) ? parseInt(pageSize) : 0,
            offset,
            where: whereClause,
        })
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

const Create = async (req, res) => {
    const { category } = req.body
    if (category === null) {
        res.status(400).json({
            msg: 'parameter query wajib diisi'
        })
    }

    const updated_at = new Date()
    const created_at = new Date()

    try {
        Category.create({
            category: category,
            created_at,
            updated_at
        })

        res.json({
            responCode: 200,
            msg: 'berhasil menyimpan data'
        })

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
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

    const { id } = req.params
    const { category } = req.body
    const updated_at = new Date()
    const created_at = new Date()
    try {
        Category.update({
            category,
            created_at,
            updated_at
        }, {
            where: { id: id },
            rejectOnEmpty: false,
        })
        res.json({
            msg: 'berhasil update data'
        })

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
}
const Delete = async (req, res) => {
    try {
        const id = req.params.id
        await Category.destroy({
            where: {
                id: id
            },
        });
        res.status(200).json({
            msg: 'date berhasil di hapus',
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }

}

export { Create, Delete, Edit, ListCategory, Update };

