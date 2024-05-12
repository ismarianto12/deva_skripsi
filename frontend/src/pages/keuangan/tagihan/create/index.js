// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
// ** Custom Component Import
import Swal from 'sweetalert2'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import axios from 'axios'
import Headtitle from 'src/@core/components/Headtitle'

const showErrors = (field, valueLen, min) => {
  if (valueLen === null) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))
const schema = yup.object().shape({
  // title: yup.string().required(),
  // seotitle: yup.string().required(),
  // active: yup.string().required(),
  // kelas: yup.string().required(),
})
const defaultValues = {
  // title: '',
  // seotitle: '',
  // active: '',
}


const fetchSiswa = (
  { id_unit, id_kelas, setKelas, reset }) => {
  return axios.post(`${process.env.APP_API}siswa/${editid}`, {
    data: {
      id_unit: id_unit
    }
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then((res) => {
    setKelas(res.data)

  }).catch((err) => {
    Swal.fire('error', err, 'error')
  })
}


const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  const [kelas, setKelas] = useState([])
  const [datasiswa, setDataSiswa] = useState([])
  const [idunit, setIdunit] = useState([])
  const [dataunit, setDataunit] = useState(
    [
      {
        'id': 1,
        'value': 'TKA',

      },
      {
        'id': 2,
        'value': 'TKB',
      },
      {
        'id': 3,
        'value': 'SD',

      }, {
        'id': 4,
        'value': 'MTSI',

      },
    ]
  )


  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  function showLoadingAlert() {
    Swal.fire({
      title: 'Please Wait',
      html: 'Sedang Menyimpan data tagihan...',
      allowOutsideClick: false,

    });
    Swal.showLoading()
  }

  const fetchKelas = (id_unit) => {
    return axios.get(`${process.env.APP_API}kelas/getbyUnit/${id_unit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }, {
      params: {
        id_unit: id_unit
      }
    }).then((res) => {
      setKelas(res.data)

    }).catch((err) => {
      Swal.fire('error', err, 'error')
    })
  }

  const onSubmit = (data) => {
    showLoadingAlert()
    const config = {
      method: 'post',
      url: `${process.env.APP_API}pembayaran/terbitkanPembayaran`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      data: data
    }
    axios(config)
      .then((res) => {
        Swal.fire('info', 'data tagihan berhasil di terbitkan', 'info')
        route.push('/keuangan/tagihan/list/');
      })
      .catch((err) => {
        Swal.fire("info", err, "info")
      });
    // reset()
  }
  const handleClose = () => {
    reset()
    route.push('/keuangan/tagihan/list/');
  }

  useEffect(() => {
  }, [])

  const Swicthbayar = () => {
    fetchKelas()
    if (id_kelas) {
      fetchSiswa()
    }
  }

  const handlekelas = (e) => {
    console.log(e, 'detail data')
    fetchKelas(e.target.value)
    setIdunit(e.target.value)
  }
  const handleSiswa = (e) => {
    const id_unit = idunit
    const id_kelas = e.target.value

    return axios.get(`${process.env.APP_API}siswa/getBykelas/${id_unit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }, {
      params: {
        id_unit: id_unit
      }
    }).then((res) => {
      setDataSiswa(res.data)
    }).catch((err) => {
      Swal.fire('error', err, 'error')
    })

  }

  const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();
  console.log(datasiswa, 'list siswa')
  return (
    <>
      <Headtitle title={`Tambah halaman`} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' />
              Terbitkan tagihan </Typography>
            <IconButton
              size='small'
              onClick={handleClose}
              sx={{
                p: '.438rem',
                borderRadius: 1,
                color: 'text.primary',
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, .16)`
                }
              }}
            >
              <Icon icon='tabler:x' fontSize='1.125rem' />
            </IconButton>
          </Header>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>

            <div className="row">
              <div className="col-sm-12 col-md-6">
                <form onSubmit={handleSubmit(onSubmit)}>

                  <div className="mb-4">
                    <label className="form-label required">
                      Pilih Unit
                    </label>
                    <select
                      className={`form-select tomselected ts-hidden-accessible ${errors.unit ? 'is-invalid' : ''}`}
                      id="unit"
                      name="unit"
                      {...register('unit', {
                        required: false,
                        onChange: (e) => {
                          handlekelas(e)
                        }
                      })}
                    >
                      <option value="">Pilih Unit</option>
                      {dataunit.map((data, i) => {
                        return (<option value={`${data.id}`}>
                          {data.value}
                        </option>)

                      })
                      }
                    </select>
                    {errors.unit && <div className="invalid-feedback">Please select a unit.</div>}
                    <p id="unit-feedback" className="mt-2" />
                  </div>

                  <div className="mb-4">
                    <label className="form-label required">
                      Pilih Kelas
                    </label>
                    <select
                      className={`form-select tomselected ts-hidden-accessible ${errors.kelas ? 'is-invalid' : ''}`}
                      id="kelas"
                      name="kelas"
                      {...register('kelas', {
                        required: false,
                        onChange: (e) => {
                          handleSiswa(e)
                        }
                      })}
                    >
                      <option value="">Pilih Kelas</option>
                      {kelas.map((data, i) => {
                        return (<option value={`${data?.id}`}>
                          {data?.kelas} - {data?.nama_unit}
                        </option>)

                      })
                      }
                    </select>
                    {errors.kelas && <div className="invalid-feedback">Please select a unit.</div>}
                    <p id="unit-feedback" className="mt-2" />
                  </div>


                  <div id="select-student" className="mb-4">
                    <label className="form-label">
                      Daftar Siswa
                    </label>
                    <label className="form-check form-switch">
                      <input type="checkbox" id="input-select-student" className="form-check-input" />
                      <span className="form-check-label">Memilih</span>
                    </label>
                    <small className="form-hint">
                      Memilih daftar siswa untuk menambahkan tagihan terhadap siswa dari kelas yang dipilih
                    </small>
                    <div id="table-select-student" className="mt-3 p-2">

                      <div className="table-responsive">
                        <table className="table table-sm table-hover">

                          <thead>
                            <tr>
                              <th className="col-1 text-center">
                                <input type="checkbox" id="student-checks" className="form-check-input" />
                              </th>
                              <th className="col-1 text-center">#</th>
                              <th className="col-2">
                                Nama Kelas
                              </th>
                              <th className="col-2">
                                Nomor Induk
                              </th>
                              <th className="col-5">
                                Nama Lengkap
                              </th>
                              <th className="col-1">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {

                              datasiswa.map((datasisw, j) => {
                                return (
                                  <tr>
                                    <td className="col-1 text-center">
                                      <input type="checkbox" id="student-checks" className="form-check-input" />
                                    </td>
                                    <td className="col-1 text-center">#</td>
                                    <td className="col-2">
                                      {datasisw.id_kelas}
                                    </td>
                                    <td className="col-2">
                                      {datasisw.nik}
                                    </td>
                                    <td className="col-5">
                                      {datasisw.nama}
                                    </td>
                                    <td className="col-1">
                                      {datasisw.kelas}
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">
                      Jangka Waktu Penagihan
                    </label>
                    <select

                      className={`form-select ${errors.bill_time ? 'is-invalid' : ''}`}
                      id="bill_time"
                      name="bill_time"
                      {...register('bill_time', { required: false })}

                    >
                      <option value />
                      <optgroup label="Bulanan">
                        <option value=""></option>
                        {
                          () => {
                            for (let index = 0; index <= 11; index++) {
                              return (<option value={i}>{i} Bulan</option>)
                            }
                          }
                        }

                      </optgroup>
                      <optgroup label="Tahunan">
                        <option value=""></option>

                        <option value={12}>1 Tahun</option>
                        <option value={24}>2 Tahun</option>
                        <option value={36}>3 Tahun</option>
                        <option value={48}>4 Tahun</option>
                      </optgroup>
                    </select>
                    {errors.bill_time && <div className="invalid-feedback">Please select a bill_time.</div>}

                    <p id="bill-time-feedback" className="mt-2" style={{ display: 'none' }} />
                  </div>
                  <div className="mb-4">
                    <div className="row g-2">
                      <label className="form-label required">
                        Bulan dan Tahun Mulai
                      </label>
                      <div className="col-6">
                        <select
                          className={`form-select ${errors.bill_month ? 'is-invalid' : ''}`}
                          id="bill_month"
                          name="bill_month"
                          {...register('bill_month', { required: false })}

                        >
                          <option value=""></option>
                          <option value={1}>Januari</option>
                          <option value={2}>Februari</option>
                          <option value={3}>Maret</option>
                          <option value={4}>April</option>
                          <option value={5}>Mei</option>
                          <option value={6}>Juni</option>
                          <option value={7}>Juli</option>
                          <option value={8}>Agustus</option>
                          <option value={9}>September</option>
                          <option value={10}>Oktober</option>
                          <option value={11}>November</option>
                          <option value={12}>Desember</option>
                        </select>
                        <p id="bill-month-feedback" className="mt-2" />
                        {errors.bill_month && <div className="invalid-feedback">Please select a bill_time.</div>}

                      </div>
                      <div className="col-6">
                        <input type="number" className={`form-control ${errors.bill_year ? 'is-invalid' : ''}`}
                          id="bill_year" name="bill_year" defaultValue=""
                          {...register('bill_year', { required: false })}
                        />
                        {errors.bill_year && <div className="invalid-feedback">Bill wajid diisi.</div>}


                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label  required ">
                      Item Tagihan 1
                    </label>
                    <select name="bill_category_1" id="bill-category-1" className="form-select tomselected ts-hidden-accessible" tabIndex={-1}>
                      <option value />
                      <option value="dlRBSjdrSTBwUU8wWUNqL3RYMlBkMjlhYJwUDRLWTY5bC9sTHRzcVBObVZ5MlBjOUZvVlZTdFhwWVM4WHRCVQ==">
                        Buku Paket MA -- Rp 2,
                      </option>
                      <option value="OUppYzFJcUVsWmV4b3VTWUhEeEo4UnJ2V1drZW5YZGVicXY4Z21nbk1tTmZoSTNneHVwdm1obW5QNXhHYVJsOA==">
                        Buku Paket MTS -- Rp 18,
                      </option>
                      <option value="R2dWDQ3TGROQjhxbjR3UVR5Q3FPdmNKRFJHMWcvaHhOb1ZxZmZCcG1meGN4YUFheGxaMlhczkL1hkZTB4Zw==">
                        Infaq Bangunan -- Rp 35,
                      </option>
                      <option value="SFNIbk5lNTBwWjRkNt1aHlERXl2bXRocVljYzdmNVFicUE4azFtSUc1YmFmVXlpNmlTcXZISHVVUjNvWWhmLw==">
                        IURAN JALAN JALAN -- Rp 5,
                      </option>
                      <option value="T2FXNTJYNVlDLzZQchIQUdFaWlMY29qeGRVQmFDSUpBODFYR1RBVUNCZz=">
                        SPP -- Rp 25,
                      </option>
                      <option value="eEo5VVhkallQbFdNRDBmMmdOYXNkKys1NzJOeEtYdXJSQ3h6TkFUQRpaz=">
                        SPP MA -- Rp 35,
                      </option>
                      <option value="VURyUkkySEU4bDl1WDVjSU55N1ptOGYwaGVPemozUVVSaVl2TnlScmhFUT=">
                        SPP MTS -- Rp 275,
                      </option>
                      <option value="NG1nTit3YnYrWmhQVDYwbXgrS2NyUzNIVmRkcWRlQmRreEFRZDFKR21rSi8yelBRcmo1TU1WS1JUbTVwaEFNQg==">
                        UAS-GANJIL -- Rp 2,
                      </option>
                      <option value="Wmx4QnhEdURqM2dCZmtJWkpQZlCbmlldUkrb2xcUZFRjhPTjhGR9OQ3Z6bys3WUpiMnZWb1l5Y3RnNlA2Tg==">
                        UAS-GENAP -- Rp 25,
                      </option>
                    </select>

                    <p id="bill-category-1-feedback" className="mt-2" style={{ display: 'none' }} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label ">
                      Item Tagihan 2
                    </label>
                    <select name="bill_category_2" id="bill-category-2" className="form-select tomselected ts-hidden-accessible" tabIndex={-1}>
                      <option value />
                      <option value="dlRBSjdrSTBwUU8wWUNqL3RYMlBkMjlhYJwUDRLWTY5bC9sTHRzcVBObVZ5MlBjOUZvVlZTdFhwWVM4WHRCVQ==">
                        Buku Paket MA -- Rp 2,
                      </option>
                      <option value="OUppYzFJcUVsWmV4b3VTWUhEeEo4UnJ2V1drZW5YZGVicXY4Z21nbk1tTmZoSTNneHVwdm1obW5QNXhHYVJsOA==">
                        Buku Paket MTS -- Rp 18,
                      </option>
                      <option value="R2dWDQ3TGROQjhxbjR3UVR5Q3FPdmNKRFJHMWcvaHhOb1ZxZmZCcG1meGN4YUFheGxaMlhczkL1hkZTB4Zw==">
                        Infaq Bangunan -- Rp 35,
                      </option>
                      <option value="SFNIbk5lNTBwWjRkNt1aHlERXl2bXRocVljYzdmNVFicUE4azFtSUc1YmFmVXlpNmlTcXZISHVVUjNvWWhmLw==">
                        IURAN JALAN JALAN -- Rp 5,
                      </option>
                      <option value="T2FXNTJYNVlDLzZQchIQUdFaWlMY29qeGRVQmFDSUpBODFYR1RBVUNCZz=">
                        SPP -- Rp 25,
                      </option>
                      <option value="eEo5VVhkallQbFdNRDBmMmdOYXNkKys1NzJOeEtYdXJSQ3h6TkFUQRpaz=">
                        SPP MA -- Rp 35,
                      </option>
                      <option value="VURyUkkySEU4bDl1WDVjSU55N1ptOGYwaGVPemozUVVSaVl2TnlScmhFUT=">
                        SPP MTS -- Rp 275,
                      </option>
                      <option value="NG1nTit3YnYrWmhQVDYwbXgrS2NyUzNIVmRkcWRlQmRreEFRZDFKR21rSi8yelBRcmo1TU1WS1JUbTVwaEFNQg==">
                        UAS-GANJIL -- Rp 2,
                      </option>
                      <option value="Wmx4QnhEdURqM2dCZmtJWkpQZlCbmlldUkrb2xcUZFRjhPTjhGR9OQ3Z6bys3WUpiMnZWb1l5Y3RnNlA2Tg==">
                        UAS-GENAP -- Rp 25,
                      </option>
                    </select>
                  </div>
                  <div className="d-grid mb-3">
                    <button type="submit" id="btn-submit" className="btn btn-primary btn-block">
                      <svg xmlns="http://www.w3.org/2/svg" id="btn-svg" className="icon icon-tabler icon-tabler-circle-check" width={24} height={24} viewBox="  24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M h24v24Hz" fill="none" />
                        <circle cx={12} cy={12} r={9} />
                        <path d="M9 12l2 2l4 -4" />
                      </svg>
                      <span id="btn-icon" />
                      <span id="btn-text">Proses Tambah Tagihan</span>
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-sm-12 col-md-6">
                <img src="https://png.pngtree.com/png-vector/20200312/ourmid/pngtree-modern-flat-design-concept-of-ui-ux-design-with-characters-and-png-image_2157890.jpg" className='img-reponsive' />

              </div>
            </div>

          </Box >
        </CardContent>
      </Card>
    </>
  )
}

export default Index
