import { QueryTypes, Op, NOW, Sequelize } from 'sequelize';
import db from '../db/database.js'
import multer from 'multer'
import Barang from '../models/Barang.js';
import pdf from 'html-pdf'
import fs from 'fs' 

// const currentDate = new Date();
const currentDate = new Date();

// Get the year, month, and day
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to the month because it's zero-based
const day = String(currentDate.getDate()).padStart(2, '0');

// Format the date as "YYYY-MM-DD"
const formattedDate = `${year}-${month}-${day}`;


const Index = async (req, res) => {
    try {
        let { page = 1, pageSize = 10 } = req.body
        if (req.query.page) {
            const onlyLettersPattern = /^[0-9]+$/
            if (page.match(onlyLettersPattern) || page < 0) {
                res.status(400).json({
                    err: "Special characters and only numbers"
                })
            }
        }
        const search = req.query.q
        page = parseInt(page)
        pageSize = parseInt(pageSize)
        const offset = (page - 1) * pageSize
        let whereClause = {}
        if (search != '') {
            whereClause = {
                nama_distributor: {
                    [Op.like]: `%${search}%`
                }
            }
        }
        const data = await db.query(`
        SELECT 
            p.id, 
            p.id_barang, 
            b.nama_barang,
            b.harga,
            b.jumlah_stok as jumlah_barang,
            p.jumlah as jumlah_purchase,
            p.tanggal_purchasing,
            p.id_distributor,
            p.no_faktur,
            b.stok_awal,
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
            p.jumlah LIKE :search OR
            p.tanggal_purchasing LIKE :search OR
            d.nama_distributor LIKE :search
        GROUP BY 
            p.id
        ORDER BY 
            p.id
        
        LIMIT 
            :offset, :pageSize
    `, {
            replacements: {
                search: `%${search}%`,
                offset: (page - 1) * pageSize,
                pageSize: pageSize
            },
            type: db.QueryTypes.SELECT
        });
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

export const Update = async (req, res) => {
    const {
        id,
        id_barang,
        jumlah,
        tanggal_purchasing,
        total_biaya,
        id_distributor,
        updated_at,
        no_faktur,
    } = req.body;

    const idBarangArray = id_barang.map(item => item.value);

    try {
        await db.query(`
            UPDATE purchasing 
            SET 
                id_barang = ?,
                jumlah = ?,
                tanggal_purchasing = ?,
                total_biaya = ?,
                id_distributor = ?,
                updated_at = ?,
                no_faktur = ?
            WHERE
                id = ?
        `, {
            replacements: [
                "" + idBarangArray,
                jumlah,
                tanggal_purchasing,
                total_biaya ? total_biaya : 0,
                id_distributor,
                updated_at ? formattedDate : formattedDate,
                no_faktur,
                id
            ],
            type: Sequelize.QueryTypes.UPDATE
        });

        res.status(200).json({
            msg: 'Data berhasil diupdate',
            status: 'ok',
        });

    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({
            msg: 'Terjadi kesalahan saat memproses data',
            status: 'error',
        });
    }
}


export const Insert = async (req, res) => {
    const {
        id_barang,
        jumlah,
        tanggal_purchasing,
        total_biaya,
        id_distributor,
        created_at,
        updated_at,
        no_faktur,
    } = req.body;

    const idBarangArray = id_barang.map(item => item.value);

    try {
        await db.query(`
            INSERT INTO purchasing 
            (id_barang, jumlah, tanggal_purchasing, total_biaya, id_distributor, created_at, updated_at, no_faktur)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, {
            replacements: [
                "" + idBarangArray,
                jumlah,
                tanggal_purchasing,
                total_biaya ? total_biaya : 0,
                id_distributor,
                created_at ? created_at : new Date(),
                updated_at ? updated_at : new Date(),
                no_faktur
            ],
            type: Sequelize.QueryTypes.INSERT
        });

        res.status(200).json({
            msg: 'Data berhasil diinsert',
            status: 'ok',
        });

    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({
            msg: 'Terjadi kesalahan saat memproses data',
            status: 'error',
        });
    }
}


const Edit = async (req, res) => {
    try {
        const id = req.params.id
        const data = await db.query(`SELECT * from purchasing where id =?`, {
            replacements: [
                id,
            ],
            type: Sequelize.SELECT
        }) 

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
    try {
        const id = req.params.id
        await db.query(`Delete purchasing where id=?`, {
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
            <title>Purchase Order</title>
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
                <h3>Purchase Order</h3>
                <hr />
                <p><strong>Vendor:</strong> ${datanya.nama_distributor}</p>
                <p><strong>PO Number:</strong> ${datanya.no_faktur ?? 'PO-12.0912.1292'}</p>
                <p><strong>Date:</strong> ${currentDate.toUTCString()}</p> 
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
                            <td>Rp.50.00</td>
                            <td>Rp.100.00</td>
                        </tr>
                        <tr>
                            <td>Product B</td>
                            <td>Consectetur adipiscing elit</td>
                            <td>3</td>
                            <td>Rp.30.00</td>
                            <td>Rp.90.00</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                            <td>Rp.190.00</td>
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


        const options = { format: 'A4' };
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
export { Create, Edit, Delete, ListArtikel, Index }

