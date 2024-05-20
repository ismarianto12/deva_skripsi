import { QueryTypes, Op } from 'sequelize';
import db from '../db/database.js'
import multer from 'multer'
import Posts from '../models/post.js'
import Post from '../models/post.js';
import pdf from 'html-pdf';

export const PrintData = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.query(`
        SELECT 
        purchasing.id_purchasing, 
        purchasing.id_barang, 
        purchasing.no_faktur, 

        purchasing.jumlah, 
        barang.id_barang, 
        barang.kd_barang,
        barang.nama_barang
    FROM
        purchasing,
        barang 
        
        where FIND_IN_SET(barang.id,purchasing.id_barang) > 0
        `, {
            type: QueryTypes.SELECT
        });
        console.log(data)
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
                <h3>Laporan Transaksi</h3>
                <hr />
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Kode Barang</th>         
                            <th>Barang</th>                            
                            <th>No. Faktur</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datanya.map((item, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${item.kd_barang}</td>
                                <td>${item.nama_barang}</td>
                                <td>${item.no_faktur}</td> 
                                <td>${item.jumlah}</td>
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

// list datat bimibingan
const List = async (req, res) => {
    try {
        let { page = 1, pageSize = 10, search = '' } = req.body
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
        if (search != '') {
            whereClause = {
                judul_konsultasi: {
                    [Op.like]: `%${search}`
                }
            }
        }

        const data = await Bimbingan.findAll({
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
                <h3>Laporan Barang Keseluruhan</h3>
                <hr />
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

const Update = (req, res) => {

}
const Delete = async (req, res) => {
    try {
        const id = req.params.id
        await Post.destroy({
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

export { Create, Edit, Update, Delete, Show, ListArtikel, List }

