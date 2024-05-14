import { QueryTypes, Op, Sequelize } from 'sequelize';
import db from '../db/database.js'
import multer from 'multer'
import Barang from '../models/Barang.js';
import JenisBarang from '../models/Jenis_barang.js';
import pdf from 'html-pdf'

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
    const id = req.params.id
    try {
        const data = await db.query(` SELECT 
        p.id, 
        p.id_barang, 
        b.nama_barang,
        b.harga,
        b.jumlah_stok as jumlah_barang,
        p.jumlah as jumlah_purchase,
        p.tanggal_purchasing,
        p.no_faktur,
        p.id_distributor,
        p.created_at,
        p.updated_at,
        d.nama_distributor,
        d.telepon,
        d.alamat,
        p.total_biaya,
        j.jenis_barang
    FROM 
        purchasing p 
    LEFT OUTER JOIN 
        barang b ON p.id_barang = b.id
    LEFT OUTER JOIN 
        distributor d ON d.id = p.id_distributor
    LEFT OUTER JOIN 
       jenis_barang j ON d.id = b.id_jenisbarang    
    WHERE 
       p.id = :id
    GROUP BY 
        p.id
    ORDER BY 
        p.id  
        `, {
            replacements: { id },
            type: QueryTypes.SELECT
        })

        console.log(data, 'datanya')
        const datanya = data[0];
        // const htmlContent = fs.readFileSync("./views/purchasing.html", datanya, 'utf8')
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Report Barang</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1, h3{
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
                    padding: 10px;
                    text-align: left;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
        <img src="/logo_app.png"
        style='
          width: 20%
        '
      />
            <div class="container">
                <h3>Laporan Barang Keseluruhan</h3>
                <hr />
                <p><strong>Vendor:</strong> ${datanya.nama_distributor}</p>
                <p><strong>PO Number:</strong> ${datanya.no_faktur ? datanya.no_faktur : 'PO-12.19812.012'}</p>
                <p><strong>Date:</strong> May 8, 2024</p> 
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Product A</td>
                            <td>Lorem ipsum dolor sit amet</td>
                            <td>2</td>
                            <td>$50.00</td>
                            <td>$100.00</td>
                        </tr>
                        <tr>
                            <td>Product B</td>
                            <td>Consectetur adipiscing elit</td>
                            <td>3</td>
                            <td>$30.00</td>
                            <td>$90.00</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                            <td>$190.00</td>
                        </tr>
                    </tfoot>
                </table>
                        <div class="footer">
                    <p><strong>Jakarta,</strong> ${currentDate.toUTCString()}</p>
                    <p>Tanda tangan: ___________________</p>
                </div>
            </div>
        </body>
        </html>        
        `
        const options = { format: 'A4', orientation: 'landscape', };
        pdf.create(htmlContent.toString(), options).toStream((err, stream) => {
            if (err) {
                console.error('Error generating PDF:', err);
                res.status(500).send('Error generating PDF');
                return;
            }
            // Set HTTP headers for PDF response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

            // Pipe PDF stream to HTTP response
            stream.pipe(res);
        });
        // const doc = new PDFDocument();
        // // Buat sebuah write stream untuk menulis PDF ke file
        // const writeStream = fs.createWriteStream('output.pdf');

        // // Tambahkan konten ke PDF
        // doc.text('Hello, World!');

        // // Akhiri pembuatan PDF
        // doc.end();

        // // Pipe PDF ke write stream
        // doc.pipe(writeStream);
        // doc.end();
        // Tampilkan pesan setelah selesai menulis PDF
        // return writeStream.on('finish', () => {
        //     console.log('PDF telah berhasil dibuat!');
        // });

        // var myDoc = new PDFDocument({ bufferPages: true });
        // let buffers = [];
        // myDoc.on('data', buffers.push.bind(buffers));
        // myDoc.on('end', () => {

        //     let pdfData = Buffer.concat(buffers);
        //     res.writeHead(200, {
        //         'Content-Length': Buffer.byteLength(pdfData),
        //         'Content-Type': 'application/pdf',
        //         'Content-disposition': 'attachment;filename=test.pdf',
        //     })
        //         .end(pdfData);

        // });



        //         myDoc.font('Times-Roman')
        //             .fontSize(12)
        //             .text(`<h3>this is a test text</h3>`);
        //         myDoc.end();


        //         const htmlContent = `
        // <!DOCTYPE html>
        // <html>
        // <head>
        //   <title>HTML to PDF</title>
        // </head>
        // <body>
        //   <h1>Hello, World!</h1>
        //   <p>This is an HTML to PDF conversion example.</p>
        // </body>
        // </html>
        // `;

        //         // Options for PDF generation
        //         const options = { format: 'Letter' };
        //         // Generate PDF from HTML content
        //         myDoc.create(htmlContent, options).toStream((err, stream) => {
        //             if (err) {
        //                 console.error('Error generating PDF:', err);
        //                 return;
        //             }

        //             // Create a write stream to save the PDF
        //             const writeStream = fs.createWriteStream('output.pdf');

        //             // Pipe PDF stream to write stream
        //             stream.pipe(writeStream);

        //             // Show message after PDF generation
        //             writeStream.on('finish', () => {
        //                 console.log('PDF generated successfully!');
        //             });
        //         });


    } catch (error) {
        res.status(400).json({
            msg: `can\t create file report ${error}`
        })
    }


}

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
                }
            };
        }

        // Hitung total data berdasarkan kriteria pencarian
        const totalCount = await Barang.count({ where: whereClause });

        const data = await Barang.findAll({
            limit: pageSize,
            offset: offset >= 0 ? offset : 0,
            where: whereClause,
            include: [{
                model: JenisBarang,
                as: 'jenis_barang',
                attributes: ['id','jenis_barang']
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

