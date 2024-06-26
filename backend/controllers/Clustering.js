import { QueryTypes, Op, Sequelize } from 'sequelize';
import db from '../db/database.js'
import multer from 'multer'
import Barang from '../models/Barang.js';
import JenisBarang from '../models/Jenis_barang.js';
import pdf from 'html-pdf'
import KMeans from 'kmeans-js';
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

export const List = async (req, res) => {
  try {
    const sql = `SELECT 	
    barang.id, 
    barang.id_barang, 
    barang.kd_barang, 
    barang.nama_barang, 
    barang.harga, 
    barang.jumlah_stok, 
    barang.created_at, 
    barang.id_jenisbarang, 
    barang.updated_at, 
    barang.stok_awal, 
    barang.stok_akhir, 
    barang.stok_keluar from barang`;
    const lstdata = await db.query(sql, {
      type: Sequelize.SELECT
    })

    res.status(200).json({ data: lstdata[0], msg: 'success' })
  } catch (error) {
    res.status(400).json({ data: lstdata[0], msg: 'error' })

  }
}

export const Print = async (req, res) => {
  const id = req.params.id
  try {
    const data = await db.query(`SELECT 
        p.id, 
        p.id_barang, 
        b.nama_barang,
        b.harga,
        b.jumlah_stok as jumlah_barang,
        p.jumlah as jumlah_purchase,
        p.tanggal_purchasing,
        p.no_faktur,
        b.stok_akhir,
        b.stok_awal,
        b.stok_keluar,
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
            table { page-break-inside:auto }
            tr    { page-break-inside:avoid; page-break-after:auto }
            thead { display:table-header-group }
            tfoot { display:tenter code hereable-footer-group }

                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                hr{
                  border:0.1px solid #ddd;
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
                    page-break-inside: avoid;
                    font-size:12px;
                    border: 1px solid #ddd;
                }
                th, td {
                    page-break-inside: avoid;
                    padding: 10px;
                    font-size:12px;
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
                <p><strong>PO Number:</strong> ${datanya.no_faktur}</p>
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
    const options = { format: 'A4', orientation: 'potrait', };
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


  } catch (error) {
    res.status(400).json({
      msg: `can\t create file report ${error}`
    })
  }
}
export const listClustering = async (req, res) => {
  try {
    const data = await db.query(`SELECT id,kode,cluster from mastercluster`, { type: Sequelize.SELECT });
    const totaldata = data.length
    res.status(200).json({
      data: data,
      total: totaldata
    })
  } catch (error) {
    res.status(400).json({
      data: [],
      msg: error
    })
  }

}

export const insertClusteringResult = async (req, res) => {
  try {
    const {
      id_barang,
      hasil_cluster,
      keterangan,
      created_at,
      updated_at,
      user_id,
    } = req.body

    const sql = `INSERT INTO clustering_result set 
      id_barang=?,
      hasil_cluster=?,
      keterangan=?,
      created_at=?,
      updated_at=?,
      user_id=?
          `
    const data = db.query(sql, {
      replacements: [
        id_barang,
        hasil_cluster,
        keterangan,
        created_at,
        updated_at,
        user_id,
      ], type: QueryTypes.INSERT
    })
    res.status(200).json({
      msg: 'data berhasil di simpan'
    })
  } catch (error) {
    res.status(200).json({
      msg: error
    })
  }
}

export const ClusterResult = async (req, res) => {
  let { page = 1, q, month } = req.query;
  page = parseInt(page) || 1;
  const search = q || '';
  const monthFilter = month ? parseInt(month) : null;

  try {
    // Build the WHERE clause
    let whereClause = '';
    if (search) {
      whereClause += `WHERE barang.nama_barang LIKE :search `;
    }
    if (monthFilter) {
      whereClause += (whereClause ? 'AND ' : 'WHERE ') + `MONTH(barang.created_at) = :month `;
    }
    // Get total data count
    const totalDataQuery = `
      SELECT COUNT(*) as total FROM barang 
      JOIN clustering_result ON barang.id_barang = clustering_result.id_barang 
      ${whereClause}
    `;
    const totalData = await db.query(' SELECT COUNT(*) as total FROM barang', {
      replacements: { search: `%${search}%`, month: monthFilter },
      type: Sequelize.QueryTypes.SELECT
    });

    const totalDls = await db.query(totalDataQuery, {
      replacements: { search: `%${search}%`, month: monthFilter },
      type: Sequelize.QueryTypes.SELECT
    });

    const total = totalData[0].total;
    let pageSize = 10;
    if (req.query.pageSize === 'All' || isNaN(req.query.pageSize)) {
      pageSize = 300;// totalDls[0].total;;
    } else {
      pageSize = parseInt(req.query.pageSize) || 10;
    }
    console.log(isNaN(req.query.pageSize), 'Page SIze');
    console.log(pageSize, 'pageSize')
    const offset = (page - 1) * pageSize;

    const dataQuery = `
    SELECT 
    clustering_result.id,  
    clustering_result.hasil_cluster, 
    clustering_result.id_barang, 
    clustering_result.keterangan, 
    clustering_result.updated_at, 
    clustering_result.created_at, 
    clustering_result.user_id, 
    barang.kd_barang,  
    barang.nama_barang, 
    barang.harga, 
    barang.jumlah_stok, 
    barang.id_jenisbarang, 
    barang.created_at, 
    barang.updated_at, 
    barang.stok_awal, 
    barang.stok_akhir, 
    barang.stok_keluar
    FROM
    clustering_result
     INNER JOIN
    barang
    ON 
      clustering_result.id_barang = barang.id
      ${whereClause}
      ORDER BY barang.id_barang ASC 
      LIMIT :offset, :pageSize
    `;
    const data = await db.query(dataQuery, {
      replacements: { search: `%${search}%`, month: monthFilter, offset, pageSize },
      type: Sequelize.QueryTypes.SELECT
    });

    res.json({
      data,
      page,
      pageSize,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      data: 'error request',
      msg: error.message
    });
  }
};


export const PrintDetail = async (req, res) => {
  try {
    const dataQuery = `
     SELECT 
       clustering_result.id,  
       clustering_result.hasil_cluster, 
       barang.kd_barang,  
       barang.nama_barang, 
       clustering_result.keterangan
     FROM
       clustering_result
     INNER JOIN
       barang ON clustering_result.id_barang = barang.id
      ORDER BY  clustering_result.hasil_cluster  ASC 
    `;
    const sql = await db.query(dataQuery, {
      type: QueryTypes.SELECT
    });

    const data = sql;
    console.log(sql[0], 'return response data barang');

    // Create HTML content for PDF
    let htmlContent = `
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Report Barang</title>
         <style>
         @media print {
          @page {
              size: A4 portrait;
           }
          body {
              margin: 0;
           }
         }
         body {
             font-family: Arial, sans-serif;
         }
         .container {
          width: 100%;
           }
         h1, h3 {
             text-align: center;
         }
         table {
             width: 100%;
             border-collapse: collapse;
  
         }
         table, th, td {
             border: 1px solid #ddd;
             font-size: 11px;
           
         }
         th, td {
             text-align: left;
         }
         .footer {
          
             text-align: center;
         }
         table.print-friendly tr td, table.print-friendly tr th {
             page-break-inside: avoid;
         }
         </style>
     </head>
     <body>
     <img src="/logo_app.png" style="width: 20%;" />
                  ${generateKopSurat()}
             <h4>Report Hasil Clusters</h4>
             <table>
                 <thead>
                     <tr>
                         <th>No.</th>
                         <th>Hasil Cluster</th>
                         <th>Kode Barang</th>
                         <th>Nama Barang</th>
                         <th>Keterangan</th>
                     </tr>
                 </thead>
                 <tbody>`;

    data.forEach((item, index) => {
      htmlContent += `
       <tr>
           <td>${index + 1}</td>
           <td>${item.hasil_cluster}</td>
           <td>${item.kd_barang}</td>
           <td>${item.nama_barang}</td>
           <td>${item.keterangan}</td>
       </tr>`;
    });

    htmlContent += `
                 </tbody>
             </table> 
          
     </body>
     </html>`;

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '30mm',
        right: '30mm',
        bottom: '30mm',
        left: '30mm'
      }
    };

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
    console.error(error);
    res.status(400).json({
      data: 'error request',
      msg: error.message
    });
  }
};




export const ClusterResultList = async (req, res) => {
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
      limit: totalCount,
      offset: offset >= 0 ? offset : 0,
      where: whereClause,
      include: [{
        model: JenisBarang,
        as: 'jenis_barang',
        attributes: ['jenis_barang']
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
      ]
    });

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
      id_barang,
      nama_barang,
      harga,
      jumlah_stok,
      id_jenisbarang,
      created_at,
      updated_at,
    } = req.body

    await db.query(`Insert into barang
       set  
        id_barang=?,
        nama_barang=?,
        harga=?,
        jumlah_stok=?,
        id_jenisbarang=?,
        created_at=?,
        updated_at=?  
        `, {
      replacements:
        [
          id_barang,
          nama_barang,
          harga,
          jumlah_stok,
          id_jenisbarang,
          created_at,
          updated_at,
        ],
      type: QueryTypes.INSERT
    },
    )

    res.status(200).json({
      message: `data berhasil dis simpan`
    })

  } catch (error) {
    res.status(200).json({
      message: `gagal disimpan ${error}`
    })

  }
}


export const Update = async (req, res) => {
  try {
    const {
      id_barang,
      nama_barang,
      harga,
      jumlah_stok,
      id_jenisbarang,
      created_at,
      updated_at,
    } = req.body
    const parmaterid = req.params.id
    await db.query(`UPDATE barang
       set  
        id_barang=?,
        nama_barang=?,
        harga=?,
        jumlah_stok=?,
        id_jenisbarang=?,
        created_at=?,
        updated_at=?  
        where id = ?
        `, {
      replacements:
        [
          id_barang,
          nama_barang,
          harga,
          jumlah_stok,
          id_jenisbarang,
          created_at,
          updated_at,
          parmaterid
        ],
      type: QueryTypes.INSERT
    },
    )
    res.status(200).json({
      message: `data berhasil dis simpan`
    })

  } catch (error) {
    res.status(200).json({
      message: `gagal disimpan ${error}`
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

const Delete = async (req, res) => {
  try {
    const id = req.params.id
    await db.query(`delete from barang where id = ?`, {
      where: {
        id: id
      },
    }, {
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
export const hitungClustering = async (req, res) => {

  try {
    // NO	KODE BARANG	NAMA BARANG 	STOK AWAL	STOK AKHIR 	STOK KELUAR
    const getData = await db.query(` 
      SELECT kd_barang,nama_barang,stok_awal,stok_akhir,stok_keluar from barang
    `, {
      type: Sequelize.SELECT
    })

    const data = getData[0]
    const features = data.map(item => [parseInt(item.stok_awal), parseInt(item.stok_akhir), parseInt(item.stok_keluar)]);
    // Atur parameter k (jumlah cluster yang diinginkan)
    const k = 3;
    const kmeans = new KMeans({ k });
    const datad = await kmeans.cluster(features);
    // console.log('Centroids:', datad);
    // console.log('Clusters:', clusters);
    return res.status(200).json(datad)

  } catch (error) {
    return res.status(200).json({
      'clusters': error
    })

  }
}

export const createcenteroid = async (req, res) => {
  const { SA, SAK, SKEL, ITERASI } = req.body
  try {
    const sql = `INSERT INTO centeroid set SA=?,SAK=?,SKEL=?,ITERASI=?`
    await db.query(sql, {
      replacements: [
        SA,
        SAK,
        SKEL,
        ITERASI
      ],
      type: QueryTypes.INSERT
    })
    res.json(200).json({
      msg: 'data berhasil disimpan',
      status: 'ok'
    })

  } catch (error) {
    res.json(200).json({
      msg: 'gagal',
      status: 'ok'
    })

  }
}

export { Create, Edit, Delete, ListArtikel }




