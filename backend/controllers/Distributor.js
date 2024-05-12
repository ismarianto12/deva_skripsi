import { QueryTypes, Op } from 'sequelize';
import db from '../db/database.js'
import multer from 'multer'
import Distributor from '../models/Distributor.js';

export const Print = async (req, res) => {
    const id = req.params.id
    try {
        const data = await db.query(`SELECT * from distributor`, {
            replacements: { id },
            type: QueryTypes.SELECT
        },)

        console.log(data, 'datanya')
        const datanya = data[0];
        // const htmlContent = fs.readFileSync("./views/purchasing.html", datanya, 'utf8')
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Report Distributor</title>
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
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtLCr2u2upCyFV_qaAi-VDAj_zlp4V0daCi0lpzef0GiWZSBoo3S5IKjs3aT4WeF8VPQS9LsTXpsfN51XF104bbbfyGMhhKp_ryOlgiWVkQjYVotioOOMwHALuvolRyfigpdRHREuaqEs/s1600/sumber+jaya+palur.jpg"
            style='
            width: 20%
            '
        />
                <div class="container">
                    <h3>Laporan Distributor</h3>
                    <hr />
                    <p><strong>Vendor:</strong> ${datanya.nama_distributor}</p>
                    <p><strong>PO Number:</strong> ${datanya.no_faktur}</p>
                    <p><strong>Date:</strong> May 8, 2024</p> 
                    <table>
                        <thead>
                            <tr>
                            <th>No</th>
                                <th>Nama Distributor</th>
                                <th>Alamat</th>
                                <th>No Telp</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${data.map((list, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${list.nama_distributor}</td>
                            <td>${list.alamat}</td>
                            <td>${list.no_telp}</td>
                        </tr>
                    `).join('')}
                        
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

const DistributorList = async (req, res) => {
    try {
        let { page = 1, pageSize = 10 } = req.params
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
        const data = await Distributor.findAll({
            attributes: [
                'id',
                'id_distributor',
                'nama_distributor',
                'alamat',
                'telepon',
                'created_at',
                'updated_at',

            ],
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

const Distributorindex = async (req, res) => {
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

export { Create, Edit, Update, Delete, DistributorList }

