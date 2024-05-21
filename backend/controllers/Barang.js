import { QueryTypes, Op, Sequelize } from 'sequelize';
import db from '../db/database.js'
import multer from 'multer'
import Barang from '../models/Barang.js';
import JenisBarang from '../models/Jenis_barang.js';
import pdf from 'html-pdf'
import { generateKopSurat } from '../views/header.js';

const currentDate = new Date();

// list datat bimibingan
// const BarangList = async (req, res) => {
//     try {
//         let { page = 1, pageSize = 10} = req.query
//         const q = req.query.q
//         if (req.query.page) {
//             const onlyLettersPattern = /^[0-9]+$/
//             if (!page.match(onlyLettersPattern)) {
//                 res.status(400).json({
//                     page: page,
//                     err: "Special characters and only numbers"
//                 })
//             }
//         }
//         page = parseInt(page)
//         pageSize = parseInt(pageSize)
//         const offset = (page - 1) * pageSize
//         let whereClause = {}
//         console.log(offset, "parameter q")
//         if (q != '') {
//             whereClause = {
//                 nama_barang: {
//                     [Op.like]: `%${q}%`
//                 }
//             }
//         }
//         const paroffset = parseInt(req.query.page) * pageSize // parseInt(offset)
//         const data = await Barang.findAll({
//             limit:  10,//req.query.pageSize,
//             paroffset,
//             where: whereClause,
//             include: [{
//                 model: JenisBarang,
//                 as: 'jenis_barang',
//                 attributes: ['jenis_barang'] // Include only the 'nama_jenis_barang' attribute
//             }],
//             attributes: [
//                 'id',
//                 'id_barang',
//                 'nama_barang',
//                 'harga',
//                 'jumlah_stok',
//                 'created_at',
//                 'updated_at'
//             ]
//         });
//         const modifiedData = data.map(item => {
//              return {
//                 ...item.toJSON(),
//                 jenis_barang: item?.jenis_barang?.jenis_barang
//             };
//         });
//         res.json({
//             data: modifiedData,
//             page,
//             pageSize,
//             total: 20//data.length
//         })

//     } catch (error) {
//         console.log(error, 'Parameter err')
//         res.status(400).json({
//             err: error.message
//         })
//     }
// }


export const Print = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.query(`
            SELECT  
            *
            FROM 
                barang   
        `, {
            type: QueryTypes.SELECT
        });

        // if (data.length === 0) {
        //     return res.status(404).send('Data not found');
        // }

        const datanya = data ?? [];
        console.log(datanya, 'dtanya')
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Report Barang</title>
            <style>
            @media print {
                @page {
                    margin: 20mm;
                }
                body {
                    margin: 0;
                    padding: 10mm;
                }
            }
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 10px 10px 10px;
                }
                h3 {
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                table, th, td {
                    border: 1px solid #ddd;
                }
                th, td {
                    padding: 5px;
                    text-align: left;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <img src="/logo_app.png" style="width: 20%;" />
            <div class="container">
            ${generateKopSurat()}
                <h3>Laporan Barang Keseluruhan</h3>
              
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Kode</th>                            
                            <th>Kode</th>
                            <th>Stok Awal</th>
                            <th>Stock Akhir</th>
                            <th>Stok Keluar</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datanya.map((item, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${item.kd_barang}</td>
                                <td>${item.nama_barang}</td> 
                                <td>${item.stok_awal}</td>
                                <td>${item.stok_akhir}</td>
                                <td>${item.stok_keluar}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <p><strong>Jakarta,</strong> ${new Date().toUTCString()}</p>
                    <p>Tanda tangan: ___________________</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const options = { format: 'A4', orientation: 'landscape' };
        pdf.create(htmlContent, options).toStream((err, stream) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return res.status(500).send('Error generating PDF');
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
            stream.pipe(res);
        });

    } catch (error) {
        res.status(400).json({
            msg: `  ${error}`
        });
    }
};


const BarangList = async (req, res) => {
    try {
        let { page = 1, pageSize = 10 } = req.query;
        const q = req.query.q;

        // Validasi page untuk memastikan hanya berisi angka
        const onlyNumbersPattern = /^[0-9]+$/;
        // if (page.toString().match(onlyNumbersPattern)) {
        //     return res.status(400).json({
        //         page: page,
        //         err: "Page should contain only numbers."
        //     });
        // } 
        page = parseInt(page);
        pageSize = parseInt(pageSize);
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (q !== '') {
            whereClause = {
                nama_barang: {
                    [Op.like]: `%${q}%`
                },

            };
        }

        console.log(whereClause, 'whereClause')
        // Hitung total data berdasarkan kriteria pencarian
        const totalCount = await Barang.count({ where: whereClause });
        const data = await Barang.findAll({
            limit: pageSize,
            offset: offset >= 0 ? offset : 0,
            where: whereClause,
            include: [{
                model: JenisBarang,
                as: 'jenis_barang',
                attributes: ['id', 'jenis_barang']
            }],
            attributes: [
                'id_barang',
                'nama_barang',
                'kd_barang',
                'stok_awal',
                'stok_akhir',
                'stok_keluar',
                'jumlah_stok',
                'created_at',
                // 'jenis_barang',
                'id_jenisbarang',
                'id',
                'updated_at'
            ],
            order: [['id', 'DESC']]
        });


        console.log(data)
        const modifiedData = data.map(item => {
            return {
                ...item.toJSON(),
                jenis_barang: item?.jenis_barang?.jenis_barang
            };
        });

        res.json({
            data: modifiedData,
            page,
            pageSize,
            total: totalCount
        });
    } catch (error) {
        console.log(error, 'Error parameter');
        res.status(400).json({
            err: error.message
        });
    }
};


export const generateKdbarang = async (req, res) => {
    try {
        const data = await db.query(`SELECT generate_kode_barang( 
	            (SELECT MAX(barang.id) from barang LIMIT 1)
        ) AS kd_barang FROM barang limit 1`, {
            type: Sequelize.SELECT
            // QueryTypes: Sequelize.SELECT
        })
        res.status(200).json({
            data: data[0][0]?.kd_barang,
            msg: 'data berhasil'
        })
    } catch (error) {
        console.log(err, 'error')
        res.status(400).json({
            data: error,
            msg: 'data berhasil'
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

export const store = async (req, res) => {
    try {
        const {
            kd_barang,
            nama_barang,
            hargabarang,
            jumlah_stok,
            id_jenisbarang,
            stok_awal,
            stok_akhir,
            stok_keluar,
        } = req.body;

        await db.query(`
            INSERT INTO barang 
             SET   
            kd_barang=?,
            nama_barang=?,
            harga=?,
            jumlah_stok=?,
            id_jenisbarang=?, 
            stok_awal=?,
            stok_akhir=?,
            stok_keluar=? 
        `, {
            replacements: [
                kd_barang,
                nama_barang ? nama_barang : 'Kosong',
                hargabarang,
                jumlah_stok ? jumlah_stok : 0,
                id_jenisbarang,
                stok_awal,
                stok_akhir,
                stok_keluar,
            ],
            type: QueryTypes.INSERT
        });
        res.status(200).json({
            message: `Data berhasil disimpan`
        });

    } catch (error) {
        res.status(500).json({
            body: req.body,
            message: `Gagal disimpan: ${error}`
        });
    }
}



export const Update = async (req, res) => {
    try {
        const {
            kd_barang,
            nama_barang,
            harga,
            jumlah_stok,
            id_jenisbarang,
            stok_awal,
            stok_akhir,
            stok_keluar,
        } = req.body;

        await db.query(`
            UPDATE barang 
            SET
            kd_barang=?,
            nama_barang=?,
            harga=?,
            jumlah_stok=?,
            id_jenisbarang=?, 
            stok_awal=?,
            stok_akhir=?,
            stok_keluar=?
            where id = ?
        `, {
            replacements: [
                kd_barang,
                nama_barang ? nama_barang : 'Kosong',
                harga,
                jumlah_stok ? jumlah_stok : 0,
                id_jenisbarang,
                stok_awal,
                stok_akhir,
                stok_keluar,
                req.params.id
            ],
            type: QueryTypes.UPDATE
        });
        res.status(200).json({
            message: `Data berhasil Update`
        });
    } catch (error) {
        res.status(500).json({
            body: req.body,
            message: `Gagal disimpan: ${error}`
        });
    }
}

const Edit = async (req, res) => {
    try {
        const id = req.params.id
        const data = await db.query(` 
            SELECT * from barang where id=?
        `, {
            replacements: [
                id,
            ], type: QueryTypes.SELECT
        });
        res.status(200).json({
            data: data[0],
            msg: 'detail data',
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}

const Delete = async (req, res) => {
    const id = req.params.id
    try {
        await db.query(`delete from barang where id = ?`, {
            replacements: [
                id
            ],
            type: QueryTypes.DELETE
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

export { Create, Edit, Delete, ListArtikel, BarangList }

