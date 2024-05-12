import { QueryTypes, Op } from 'sequelize';
import db from '../db/database.js';
import Alumni from '../models/Alumni.js';
// const ListAlumni = async (req, res) => {
//     try {
//         let { page = 1, pageSize = 10, search = '' } = req.query;

//         console.log('Received parameters:', { page, pageSize, search });

//         page = parseInt(page);
//         pageSize = parseInt(pageSize);
//         const offset = (page - 1) * pageSize;
//         const whereClause = {};

//         if (search !== '') {
//             whereClause.nama = {
//                 [QueryTypes.like]: `%${search}%`
//             };
//         }

//         const users = await db.query('SELECT * FROM `alumni` WHERE :whereClause LIMIT :pageSize OFFSET :offset', {
//             replacements: {
//                 whereClause,
//                 pageSize,
//                 offset,
//             },
//             type: QueryTypes.SELECT,
//         });

//         res.json({
//             data: users,
//             page,
//             pageSize,
//             total: users.length, // Note: This may not be accurate for large datasets, consider using COUNT query
//         });
//     } catch (error) {
//         res.status(400).json({
//             error: error.message,
//         });
//     }
// };


// const { Op } = require('sequelize');

const ListAlumni = async (req, res) => {
    try {
        let { page = 1, pageSize = 10, search = '' } = req.query;
        const onlyLettersPattern = /^[0-9]+$/;
        if (req.query.page) {
            if (!page.match(onlyLettersPattern) || page === '0') {
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
        const users = await Alumni.findAll({
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
        console.error('Error:', error);
        res.status(400).json({
            error: error.message,
        });
    }
};

const Berita = async (req, res) => {

    try {
        let { page = 1, pageSize = 10, search = '' } = req.query;
        const onlyLettersPattern = /^[0-9]+$/;
        if (!page.match(onlyLettersPattern) || page < 0) {
            return res.status(400).json({ err: "No special characters and no numbers, please!" })
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
        const users = await Alumni.join.findAll({
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
        console.error('Error:', error);
        res.status(400).json({
            error: error.message,
        });
    }

}
const Home = () => {


}

const RegisterAlumni = async (req, res) => {

    const {
        tempat_lahir,
        tanggal_lahir,
        jk,
        tahun_masuk,
        tahun_lulus,
        ipk,
        alamat_tinggal,
        alamat_domisili,
        kecamatan,
        kabupaten,
        email,
        no_handphone,
        status_pekerjaan,
        pekerjaan,
        jabatan,
        alamat_tempat_kerja,
        disclaimer,
        user_id
    } = req.body;

    const createdAt = new Date();
    const updatedAt = new Date();
    try {

        // if (
        //     typeof tempat_lahir !== 'string' ||
        //     typeof tanggal_lahir !== 'string' || // atau sesuaikan dengan format tanggal yang diinginkan
        //     typeof jk !== 'string' ||
        //     typeof tahun_masuk !== 'string' ||
        //     typeof tahun_lulus !== 'string' ||
        //     typeof ipk !== 'string' ||
        //     typeof alamat_tinggal !== 'string' ||
        //     typeof alamat_domisili !== 'string' ||
        //     typeof kecamatan !== 'string' ||
        //     typeof kabupaten !== 'string' ||
        //     typeof email !== 'string' ||
        //     typeof no_handphone !== 'string' ||
        //     typeof status_pekerjaan !== 'string' ||
        //     typeof pekerjaan !== 'string' ||
        //     typeof jabatan !== 'string' ||
        //     typeof alamat_tempat_kerja !== 'string' ||
        //     typeof disclaimer !== 'string' ||
        //     typeof user_id !== 'number'
        // ) {
        //     return res.status(400).json({ error: 'Invalid data type or format' });
        // }
        const result = await Alumni.create({
            tempat_lahir,
            tanggal_lahir,
            jk,
            tahun_masuk,
            tahun_lulus,
            ipk,
            alamat_tinggal,
            alamat_domisili,
            kecamatan,
            kabupaten,
            email,
            no_handphone,
            status_pekerjaan,
            pekerjaan,
            jabatan,
            alamat_tempat_kerja,
            disclaimer,
            createdAt,
            updatedAt,
            user_id
        });

        res.status(201).json({ message: 'Data inserted successfully', insertedId: result[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

export { Home, Berita, RegisterAlumni, ListAlumni }
