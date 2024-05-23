 
export function generateKopSurat() {
    return `
  
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .kop-surat {
                display: flex;
                text-align: center;
                padding: 20px;
                border-bottom: 2px solid #000;
            }
            .kop-surat img {
                width: 100px; /* Sesuaikan ukuran logo */
                height: auto;
                margin-right: 20px;
            }
            .kop-surat .alamat {
                font-size: 12.4px;
            }
        </style>
    
        <div class="kop-surat">
            <img src="http://localhost:8080/files/logo_app.png" alt="Logo">
            <div class="alamat"> 
                Jl. Taman Margasatwa Raya No. 34 Rt. 01 Rw. 01 Ragunan,<br>
                RT.1/RW.1, Ragunan, Ps. Minggu,<br />
                Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12550
            </div>
        </div> 
    `;
}

// Middleware untuk melayani file statis
// app.use(express.static(path.join(__dirname, 'public')));

// // Rute untuk halaman kop surat
// app.get('/kop-surat', (req, res) => {
//     res.send(generateKopSurat());
// });

// // Jalankan server
// app.listen(port, () => {
//     console.log(`Server berjalan di http://localhost:${port}`);
// });
