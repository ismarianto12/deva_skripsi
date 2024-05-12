import { useState, useEffect } from 'react'
import Head from "next/head";
import Link from "next/link";
import axios from 'axios'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import Cainprovsimple from 'src/@core/components/Cainprovsimple';
import { Box, Card, CardContent } from '@mui/material'


function showLoadingAlert() {
  Swal.fire({
    title: 'Sedang Menyimpan',
    html: 'Sedang Mengalihakn...',
    allowOutsideClick: false,

  });
  Swal.showLoading()
  setTimeout(() => {
    Swal.close();
  }, 3000);
}
export default function Index(props) {

  const [formData, setFormData] = useState({});
  const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm(

    {
      defaultValues: {
        nodaftar: '',
        nik: '',
        nis: '',
        password: '',
        nama: '',
        email: '',
        no_hp: '',
        jk: '',
        ttl: '',
        alamat: '',
        nama_ayah: '',
        nama_ibu: '',
        nama_wali: '',
        pek_ayah: '',
        pek_ibu: '',
        pek_wali: '',
        peng_ortu: '',
        no_telp: '',
        sekolah_asal: '',
        kelas_old: '',
        thn_lls: '',
        file1: '',
        file2: '',
        file3: '',
        file4: '',
        thn_msk: '',
        pendidikan: '',
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
      }
    }
  );
  const [selectedFile, setSelectedFile] = useState(null)
  const [file1, setfile1] = useState('')
  const [file2, setfile2] = useState('')
  const [file3, setfile3] = useState('')
  const [file4, setfile4] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [nodaftar, setNodaftar] = useState('')

  const route = useRouter()

  useEffect(() => {

    const getdata = async () => {
      const url = `${process.env.APP_API}siswa/edit/${props.id}`
      await axios.get(url, {
        headers: {
          Authorization: `bearer ${localStorage.getItem('accessToken')}`
        }
      })
        .then(response => {
          reset(response.data)
        })
        .catch(error => {
          // Menangani kesalahan jika ada
          console.error('Terjadi kesalahan:', error);
        });
    }
    getdata()
  }, []);

  const handleBrowseClick = () => {
    document.getElementById('imgInp').click();
  }
  const handleBrowseClicKKfile = () => {
    document.getElementById('imgInp1').click();
  }
  const handleBrowseIjazah = () => {
    document.getElementById('imgInp2').click();
  }
  const KtpBrowser = () => {
    document.getElementById('imgInp3').click();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const imgPreview = document.getElementById('preview');
      imgPreview.src = reader.result;
      setfile1(file)
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleFileKK = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imgPreview = document.getElementById('preview1');
      imgPreview.src = reader.result;
      setfile2(file)
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFileIjazah = (e) => {
    const file = e.target.files[0];


    const reader = new FileReader();
    reader.onload = () => {
      const imgPreview = document.getElementById('preview2');
      imgPreview.src = reader.result;
      setfile3(file)
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFileKtp = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const imgPreview = document.getElementById('preview3');
      imgPreview.src = reader.result;
      setfile4(file)

    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {

    event.preventDefault();

    Swal.fire({
      title: 'Anda yakin?',
      text: "Semua data yang sudah di etnrikan sudah benar dan sesuai",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Iya'
    }).then(async (result) => {
      if (result.isConfirmed) {
        showLoadingAlert()
        const formdata = new FormData()
        formdata.append("nodaftar", nodaftar)
        formdata.append("nik", data.nik)
        formdata.append("nis", data.nis)
        formdata.append("password", data.password)
        formdata.append("nama", data.nama)
        formdata.append("email", data.email)
        formdata.append("no_hp", data.no_hp)
        formdata.append("jk", data.jk)
        formdata.append("ttl", data.ttl)
        formdata.append("alamat", data.alamat)
        formdata.append("nama_ayah", data.nama_ayah)
        formdata.append("nama_ibu", data.nama_ibu)
        formdata.append("nama_wali", data.nama_wali)
        formdata.append("pek_ayah", data.pek_ayah)
        formdata.append("pek_ibu", data.pek_ibu)
        formdata.append("pek_wali", data.pek_wali)
        formdata.append("peng_ortu", data.peng_ortu)
        formdata.append("no_telp", data.no_telp)
        formdata.append("sekolah_asal", data.sekolah_asal)
        formdata.append("kelas_old", data.kelas_old)
        formdata.append("thn_lls", data.thn_lls)
        formdata.append("img_siswa", file1)
        formdata.append("img_kk", file2)
        formdata.append("img_ijazah", file3)
        formdata.append("img_ktp", file4)
        formdata.append("thn_msk", data.thn_msk)
        formdata.append("pendidikan", data.pendidikan)
        formdata.append("provinsi", data.provinsi)
        formdata.append("kabupaten", data.kabupaten)
        formdata.append("kecamatan", data.kecamatan)
        formdata.append("kelurahan", data.kelurahan)
        await axios.post(`${process.env.APP_API}siswa/update/${props.id}`, formdata, {
          headers: {
            Authorization: `bearer ${localStorage.getItem('accessToken')}`
          }
        }).then((data) => {
          return route.push(`/siswa/list`)
        }).catch((error) => {
          Swal.fire('Info', error + 'maaf proses pendaftaran tidak berhasil silahkan di ulangi', 'info')
        })
      }
    })
  }
  const confirmbatal = () => {
    Swal.fire({
      title: 'Anda yakin?',
      text: "Perubahan mungkin tidak akan disimpan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Iya'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Batal!',
          'Perubahan berhasil di batalkan.',
          'success'
        )
        return route.push('/siswa/list')
      }
    })
  }
  return (

    <>

      <Head>
        <title>Edit Data Siswa</title>
      </Head>



      <Card>
        <CardContent>
          <br />
          <h4>Edit data siswa</h4>
          <hr />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-4">
                  <label>NIK</label>
                  <input
                    type="number"
                    className={`form-control ${errors.nik ? 'is-invalid' : ''}`}
                    id="nik"
                    name="nik"
                    placeholder="Nomor Induk Kependudukan"
                    defaultValue=""
                    {...register('nik', { required: true })}
                  />
                  {errors.nik && <div className="invalid-feedback">This field is required.</div>}

                </div>
                <div className="form-group mb-4">
                  <label>NIS</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nis ? 'is-invalid' : ''}`}
                    id="nis"
                    name="nis"
                    placeholder="Nomor Induk siswa"
                    defaultValue=""
                    {...register('nis', { required: true })}
                  />
                  {errors.nis && <div className="invalid-feedback">This field is required.</div>}
                </div>

                <div className="form-group mb-4">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nama ? 'is-invalid' : ''}`}
                    id="nama"
                    name="nama"
                    placeholder="Nama Lengkap"
                    defaultValue=""
                    {...register('nama', { required: true })}
                  />
                  {errors.nama && <div className="invalid-feedback">This field is required.</div>}
                </div>

                <div className="form-group mb-4">
                  <label>Email</label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="Email"
                    defaultValue=""
                    {...register('email', { required: true })}
                  />
                  {errors.email && <div className="invalid-feedback">This field is required.</div>}
                </div>

                <div className="form-group mb-4">
                  <label>Nomor Hp</label>
                  <input
                    type="number"
                    className={`form-control ${errors.no_hp ? 'is-invalid' : ''}`}
                    id="no_hp"
                    name="no_hp"
                    placeholder="Nomor Hp"
                    defaultValue=""
                    {...register('no_hp', { required: true })}
                  />
                  {errors.no_hp && <div className="invalid-feedback">This field is required.</div>}
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="jk" className="col-form-label">Jenis Kelamin:</label>
                  <select
                    className={`form-control ${errors.jk ? 'is-invalid' : ''}`}
                    id="jk"
                    name="jk"
                    {...register('jk', { required: true })}
                  >
                    <option value="">- Jenis Kelamin -</option>
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  {errors.jk && <div className="invalid-feedback">Please select a gender.</div>}
                </div>

                {/* Add more fields in a similar manner */}
                <div className="form-group mb-4">
                  <label>Tanggal Lahir</label>
                  <input type="date" className={`form-control ${errors.ttl ? 'is-invalid' : ''}`}
                    id="ttl" name="ttl" defaultValue=""
                    {...register('ttl', { required: true })}
                  />
                  {errors.ttl && <div className="invalid-feedback">Tanggal lahir wajid diisi.</div>}
                </div>
                <Cainprovsimple register={register} errors={errors} />

                <div className="form-group mb-4">
                  <label>Alamat</label>
                  <textarea
                    rows={4}
                    className={`form-control ${errors.alamat ? 'is-invalid' : ''}`}
                    id="alamat"
                    name="alamat"
                    placeholder="Alamat Lengkap"
                    defaultValue=""
                    {...register('alamat', { required: true })}
                  />
                  {errors.alamat && <div className="invalid-feedback">This field is required.</div>}
                </div>
                <div className="form-group mb-4">
                  <label>Nama Ayah</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nama_ayah ? 'is-invalid' : ''}`}
                    id="nama_ayah"
                    name="nama_ayah"
                    placeholder="Nama Orang Tua"
                    defaultValue=""
                    {...register('nama_ayah', { required: true })}
                  />
                  {errors.nama_ayah && <div className="invalid-feedback">This field is required.</div>}
                </div>

                <div className="form-group mb-4">
                  <label>Nama Ibu</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nama_ibu ? 'is-invalid' : ''}`}
                    id="nama_ibu"
                    name="nama_ibu"
                    placeholder="Nama Orang Tua"
                    defaultValue=""
                    {...register('nama_ibu', { required: true })}
                  />
                  {errors.nama_ibu && <div className="invalid-feedback">This field is required.</div>}
                </div>

                <div className="form-group mb-4">
                  <label>Nama Wali</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nama_wali ? 'is-invalid' : ''}`}
                    id="nama_wali"
                    name="nama_wali"
                    placeholder="Nama Wali"
                    defaultValue=""
                    {...register('nama_wali', { required: false })}
                  />
                  {/* <small className="text-info">* Kosongkan jika tidak ada.</small> */}
                </div>

              </div>

              <div className="col-md-6">
                <div className="form-group mb-4">
                  <label>Pekerjaan Ayah</label>
                  <select className={`form-control ${errors.pek_ayah ? 'is-invalid' : ''}`}
                    id="pek_ayah"
                    name="pek_ayah"
                    defaultValue=""
                    {...register('pek_ayah', { required: false })}

                  >
                    <option value>- Pekerjaan Ayah -</option>
                    <option value="Wiraswasta">Wiraswasta</option>
                    <option value="Pedagang">Pedagang</option>
                    <option value="Buruh">Buruh</option>
                    <option value="Pensiunan">Pensiunan</option>
                    <option value="Guru">Guru</option>
                    <option value="Honorer">Honorer</option>
                    <option value="PNS">PNS</option>
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label>Pekerjaan Ibu</label>
                  <select className={`form-control ${errors.pek_ibu ? 'is-invalid' : ''}`}
                    id="pek_ibu"
                    name="pek_ibu"
                    defaultValue=""
                    {...register('pek_ibu', { required: false })}
                  >
                    <option value>- Pekerjaan Ibu -</option>
                    <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                    <option value="Wiraswasta">Wiraswasta</option>
                    <option value="Pedagang">Pedagang</option>
                    <option value="Buruh">Buruh</option>
                    <option value="Pensiunan">Pensiunan</option>
                    <option value="Guru">Guru</option>
                    <option value="Honorer">Honorer</option>
                    <option value="PNS">PNS</option>
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label>Pekerjaan Wali</label>
                  <select
                    className={`form-control ${errors.pek_wali ? 'is-invalid' : ''}`}
                    id="pek_wali"
                    name="pek_wali"
                    {...register('pek_wali', { required: true })}
                  >
                    <option value="- Pekerjaan Wali -">- Pekerjaan Wali -</option>
                    <option value="Tidak ada wali">Tidak ada wali</option>
                    <option value="Wiraswasta">Wiraswasta</option>
                    <option value="Pedagang">Pedagang</option>
                    <option value="Buruh">Buruh</option>
                    <option value="Pensiunan">Pensiunan</option>
                    <option value="Guru">Guru</option>
                    <option value="Honorer">Honorer</option>
                    <option value="PNS">PNS</option>
                  </select>
                  {errors.pek_wali && <div className="invalid-feedback">This field is required.</div>}
                </div>
                <div className="form-group mb-4">
                  <label>Penghasilan Ortu / Wali</label>
                  <select
                    className={`form-control ${errors.peng_ortu ? 'is-invalid' : ''}`}
                    id="peng_ortu"
                    name="peng_ortu"
                    {...register('peng_ortu', { required: true })}
                  >
                    <option value="- Penghasilan / Bulan -">- Penghasilan / Bulan -</option>
                    <option value="< Rp.1.000.000">&lt;&lt; Rp.1.000.000</option>
                    <option value="Rp.1.000.000 - Rp.2.000.000">Rp.1.000.000 - Rp.2.000.000</option>
                    <option value="Rp.2.000.000 - Rp.3.000.000">Rp.2.000.000 - Rp.3.000.000</option>
                    <option value="Rp.3.000.000 - Rp.4.000.000">Rp.3.000.000 - Rp.4.000.000</option>
                    <option value="Rp.4.000.000 - Rp.5.000.000">Rp.4.000.000 - Rp.5.000.000</option>
                    <option value="Rp.5.000.000 >">Rp.5.000.000 &gt;&gt;</option>
                  </select>
                  {errors.peng_ortu && <div className="invalid-feedback">This field is required.</div>}
                </div>
                <div className="form-group mb-4">
                  <label>Nomor Telepon Ortu / Wali</label>
                  <input
                    type="text"
                    className={`form-control ${errors.no_telp ? 'is-invalid' : ''}`}
                    id="no_telp"
                    name="no_telp"
                    placeholder="Nomor Telepon"
                    defaultValue=""
                    {...register('no_telp', { required: true })}
                  />
                  {errors.no_telp && <div className="invalid-feedback">This field is required.</div>}
                </div>
                <div className="form-group mb-4">
                  <label>Sekolah Asal</label>
                  <input
                    type="text"
                    className={`form-control ${errors.sekolah_asal ? 'is-invalid' : ''}`}
                    id="sekolah_asal"
                    name="sekolah_asal"
                    placeholder="Sekolah Asal"
                    defaultValue=""
                    {...register('sekolah_asal', { required: true })}
                  />
                  {errors.sekolah_asal && <div className="invalid-feedback">This field is required.</div>}
                </div>
                <div className="form-group mb-4">
                  <label>Kelas</label>
                  <input
                    type="text"
                    className={`form-control ${errors.kelas_old ? 'is-invalid' : ''}`}
                    id="kelas_old"
                    name="kelas"
                    placeholder="Kelas"
                    defaultValue=""
                    {...register('kelas_old', { required: true })}
                  />
                  {errors.kelas_old && <div className="invalid-feedback">This field is required.</div>}
                </div>
                <div className="form-group mb-4">
                  <label>Tahun Lulus</label>
                  <input
                    type="number"
                    className={`form-control ${errors.thn_lls ? 'is-invalid' : ''}`}
                    id="thn_lls"
                    name="thn_lls"
                    placeholder="Tahun Lulus"
                    defaultValue=""
                    {...register('thn_lls', { required: true })}
                  />
                  {errors.thn_lls && <div className="invalid-feedback">This field is required.</div>}
                </div>
                <div className="form-group mb-4 row">
                  <div className="col-sm-3">
                    <img src={selectedFile} width={100} height={85} id="preview" className="img-thumbnail" onError={(e) => {
                      e.target.src = 'https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-documentfilepagepenresume-flat-color-icon-vector-png-image_1491048.jpg';
                    }} />
                  </div>
                  <div className="col-sm-9">
                    <input
                      hidden
                      type="file"
                      name="img_siswa"
                      className="file"
                      accept="image/*"
                      value={selectedFile}
                      id="imgInp"
                      {...register('img_siswa', { required: false })}
                      onChange={handleFileChange}

                    />
                    <div className="input-group my-3">
                      <input
                        type="text"
                        className={`form-control ${errors.img_siswa ? 'is-invalid' : ''}`}
                        disabled
                        placeholder="Foto siswa"
                        id="file"
                      />
                      <div className="input-group-append">
                        <button type="button" onClick={handleBrowseClick}
                          className="browse btn btn-primary">Browse</button>
                      </div>
                    </div>
                    {errors.img_siswa && <div className="invalid-feedback">Please upload a valid image.</div>}
                  </div>
                </div>
                <div className="form-group mb-4 row">
                  <div className="col-sm-3">
                    <img src="https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-documentfilepagepenresume-flat-color-icon-vector-png-image_1491048.jpg" width={100} height={85} id="preview1" className="img-thumbnail" onError={(e) => {
                      e.target.src = 'https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-documentfilepagepenresume-flat-color-icon-vector-png-image_1491048.jpg';
                    }} />
                  </div>
                  <div className="col-sm-9">
                    <input
                      hidden
                      type="file"
                      name="img_kk"
                      className="file1"
                      accept="image/*"
                      id="imgInp1"
                      {...register('img_kk', { required: false })}
                      onChange={handleFileKK}

                    />
                    <div className="input-group my-3">
                      <input
                        type="text"
                        className={`form-control ${errors.img_kk ? 'is-invalid' : ''}`}
                        disabled
                        placeholder="Foto KK (Kartu keluarga)"
                        id="file1"
                      />
                      <div className="input-group-append">
                        <button type="button"
                          onClick={handleBrowseClicKKfile}
                          className="browse1 btn btn-primary">Browse</button>
                      </div>
                    </div>
                    {errors.img_kk && <div className="invalid-feedback">Please upload a valid image.</div>}
                  </div>
                </div>
                <div className="form-group mb-4 row">
                  <div className="col-sm-3">
                    <img src="https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-documentfilepagepenresume-flat-color-icon-vector-png-image_1491048.jpg" width={100} height={85} id="preview2" className="img-thumbnail" onError={(e) => {
                      e.target.src = 'https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-documentfilepagepenresume-flat-color-icon-vector-png-image_1491048.jpg';
                    }} />
                  </div>
                  <div className="col-sm-9">
                    <input
                      hidden
                      type="file"
                      name="img_ijazah"
                      className="file2"
                      accept="image/*"
                      id="imgInp2"
                      {...register('img_ijazah', { required: false })}
                      onChange={handleFileIjazah}

                    />
                    <div className="input-group my-3">
                      <input
                        type="text"
                        className={`form-control ${errors.img_ijazah ? 'is-invalid' : ''}`}
                        disabled
                        placeholder="Foto Ijazah"
                        id="file2"
                      />
                      <div className="input-group-append">
                        <button type="button"
                          onClick={handleBrowseIjazah}
                          className="browse2 btn btn-primary">Browse</button>
                      </div>
                    </div>
                    {errors.img_ijazah && <div className="invalid-feedback">Please upload a valid image.</div>}
                  </div>
                </div>
                <div className="form-group mb-4 row">
                  <div className="col-sm-3">
                    <img src="https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-documentfilepagepenresume-flat-color-icon-vector-png-image_1491048.jpg" width={100} height={85} id="preview3" className="img-thumbnail" onError={(e) => {
                      e.target.src = 'https://png.pngtree.com/png-vector/20190623/ourmid/pngtree-documentfilepagepenresume-flat-color-icon-vector-png-image_1491048.jpg';
                    }} />
                  </div>
                  <div className="col-sm-9">
                    <input
                      hidden
                      type="file"
                      name="img_ktp"
                      className="file3"
                      accept="image/*"
                      id="imgInp3"
                      {...register('img_ktp', { required: false })}
                      onChange={handleFileKtp}
                    />
                    <div className="input-group my-3">
                      <input
                        type="text"
                        className={`form-control ${errors.img_ktp ? 'is-invalid' : ''}`}
                        disabled
                        placeholder="Foto Akte / KTP"
                        id="file3"
                      />
                      <div className="input-group-append">
                        <button type="button"
                          onClick={KtpBrowser}
                          className="browse3 btn btn-primary">Browse</button>
                      </div>
                    </div>
                    {errors.img_ktp && <div className="invalid-feedback">Please upload a valid image.</div>}
                  </div>
                </div>
                <br />
                <div className="form-group mb-4">
                  <label>Tahun Masuk</label>
                  <select
                    className={`form-control ${errors.thn_msk ? 'is-invalid' : ''}`}
                    id="thn_msk"
                    name="thn_msk"
                    {...register('thn_msk', { required: true })}
                  >
                    <option value="- Pilih Periode -">- Pilih Periode -</option>
                    <option value={2}>2022/2023</option>
                  </select>
                  {errors.thn_msk && <div className="invalid-feedback">Please select a year.</div>}
                </div>


                <div className="form-group mb-4">
                  <label>Pendidikan</label>
                  <select
                    className={`form-control ${errors.pendidikan ? 'is-invalid' : ''}`}
                    id="pendidikan"
                    name="pendidikan"
                    {...register('pendidikan', { required: true })}
                  >
                    <option value="- Pilih pendidikan -">- Pilih pendidikan -</option>
                    <option value={1}>SD</option>
                    <option value={9}>TK</option>
                    <option value={10}>SMP</option>
                    <option value={12}>KB</option>
                  </select>
                  {errors.pendidikan && <div className="invalid-feedback">Please select a level of education.</div>}
                </div>
              </div>
            </div>
            <div className="pt-3 form-group mb-4 row" >
              <div className="col-md-12 text-center">
                <button type="submit" className="btn-block btn btn-success" style={{
                  'width': '40%', 'marginRight': '15px'
                }}>Edit</button>
                <button type="reset" onClick={() => confirmbatal()} className="btn-block btn btn-danger" style={{
                  'width': '40%'
                }}>Batal</button>
              </div>
            </div>
            {/* <Comodal handleClose={handleClose} show={show} setConfirm={setConfirm} /> */}
          </form>
        </CardContent>
      </Card>

    </>
  )
}




export async function getServerSideProps(context) {
  const id = context.query.edit;
  return {
    props: {
      id
    },
  };
}


