// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
// ** Custom Component Import
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import { Card, CardContent } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'
import * as Icon from 'react-feather'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
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
  jenis_tagihan: yup.string().required("Wajib diisi."),
  type_pembayaran: yup.string().required("Wajid diisi."),
  jumlah_bayar: yup.string().required("Wajib diisi"),
  type_pembayaran: yup.string().required("Wajib diisi"),
})

const Bayar = (props) => {
  const route = useRouter()
  const [datasiswa, setDatasiswa] = useState([])
  const [jenistagihan, setJenisTagihan] = useState([])
  const [detialtagihan, setDetailTagihan] = useState([])
  const { params } = useRouter()
  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      seotitle: '',
      active: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const CallSiswa = async () => {
      await axios.get(`${process.env.APP_API}siswa/edit/${props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }, {
        params: { siswa_id: props.id },
      }).then(data => {
        setDatasiswa(data.data)
      }).catch(errr => {
        setDatasiswa([])
        Swal.fire('error', 'gagal mendapatkan data siswa', 'error')
      })
    }

    CallSiswa()
    // callTagihan()
  }, [])

  useEffect(() => {
    const unit_id = route?.query.unit_id
    console

    const jenisTagihan = async () => {
      axios.get(`${process.env.APP_API}pembayaran/getJenistagihan`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
          unit_id: unit_id
        }
      },).then((data) => {
        console.log(data.data,'response')
        setJenisTagihan(data.data)
      }).catch(err => {
        Swal.fire('error', 'gagal mengambil data tagihan', 'error')
      })
    }
    jenisTagihan()
  }, [])

  const callTagihan = async () => {
    // console.log(props.id, 'detail id')
    await axios.post(`${process.env.APP_API}keuangan/detail/${props.id}`, {
      siswa_id: props.id,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then((data) => {
      setDetailTagihan(data.data)
    }).catch((err) => {
      Swal.fire('Error', 'tidak data passing data', 'error')
      setDetailTagihan([])
    })

  }
  const confirmbatal = () => {
    Swal.fire({
      title: 'Anda yakin?',
      text: "Proses Pembayaran Akan di batalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Iya'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Batal!',
          'Pendaftaran berhasil di batalkan.',
          'success'
        )
        return route.push('/keuangan/tagihan/list')
      }
    })
  }
  const onSubmit = async (data) => {

    await axios.post(`${process.env.APP_API}pembayaran/update/${props.id}`, {
      id_siswa: props.id,
      jenis_tagihan: data.jenis_tagihan,
      jumlah_bayar: data.jumlah_bayar,
      type_pembayaran: data.type_pembayaran
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then(data => {
      Swal.fire('success', 'berhasil menambahkan data tagihan siswa', 'success')
      route.push('/keuangan/tagihan/list')
    }).catch(err => {
      console.info(err)
      Swal.fire('gagal', err?.response?.data?.msg, 'error')
    })
  }

  const handleClose = () => {
    reset()
    route.push('/keuangan/tagihan/list')
  }
  const jenisBayar = {
    1: 'Cash',
    2: 'Anggsuran',
  }
  console.log(datasiswa, 'datail data')
  return (
    <>
      <Card>
        <CardContent>

          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <Icon.MoreHorizontal />
            <h4>Tagihan Siswa</h4>

            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label>Jenis Tagihan</label>
                    <select
                      className={`form-control ${errors.jenis_tagihan ? 'is-invalid' : ''}`}
                      id="jenis_tagihan"
                      name="jenis_tagihan"
                      placeholder="Jenis Tagihan"
                      defaultValue=""
                      {...register('jenis_tagihan', { required: true })}
                    >
                      {jenistagihan.map((data, i) => (
                        <option value={`${data.id}`}>{data.nama_biaya} -  {data.tingkat}</option>
                      ))}

                    </select>

                    {errors.jenis_tagihan && <div className="invalid-feedback">This field is required.</div>}
                  </div>



                  <div className="form-group mb-4">
                    <label>Nama Siswa</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nis ? 'is-invalid' : ''}`}
                      id="nis"
                      value={datasiswa.nama}
                      name="nis"
                      placeholder="Nama Siswa"
                      defaultValue=""
                      {...register('nis', { required: true })}
                    />
                    {errors.nis && <div className="invalid-feedback">This field is required.</div>}
                  </div>


                  <div className="form-group mb-4">
                    <label>Catatan Bayar</label>
                    <textarea
                      type="text"
                      className={`form-control ${errors.catatan ? 'is-invalid' : ''}`}
                      id="catatan"
                      name="catatan"
                      placeholder="Catatn Bayar"
                      defaultValue=""
                      {...register('catatan', { required: true })}
                    />
                    {errors.catatan && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                </div>
                <div className="col-md-6">

                  <div className="form-group mb-4">
                    <label>Type Pembayaran</label>
                    <select
                      className={`form-control ${errors.type_pembayaran ? 'is-invalid' : ''}`}
                      id="type_pembayaran"
                      name="type_pembayaran"
                      defaultValue=""
                      {...register('type_pembayaran', { required: true })}
                    >
                      {Object.entries(jenisBayar).map(([key, value]) => (
                        <option value={`${key}`}>{value}</option>
                      ))}
                    </select>
                    {errors.type_pembayaran && <div className="invalid-feedback">Type Pembayaran is required.</div>}
                  </div>


                  <div className="form-group mb-4">
                    <label>Jumlah Bayar</label>
                    <input
                      type="text"
                      className={`form-control ${errors.jumlah_bayar ? 'is-invalid' : ''}`}
                      id="jumlah_bayar"
                      name="jumlah_bayar"
                      placeholder="Jumlah Bayar"
                      defaultValue=""
                      {...register('jumlah_bayar', { required: true })}
                    />
                    {errors.jumlah_bayar && <div className="invalid-feedback">This field is required.</div>}

                  </div>

                </div>

                <br /> <br />
                <div className="pt-3 form-group mb-4 row" >
                  <div className="col-md-12 text-center">
                    <button type="submit" className="btn-block btn btn-success" style={{ 'width': '40%' }}>Proses Pembayaran</button>&nbsp;&nbsp;
                    <button type="reset" onClick={() => confirmbatal()} className="btn-block btn btn-danger" style={{ 'width': '40%' }}>Batal</button>
                  </div>
                </div>
              </div>

            </form>

          </Box>
        </CardContent>
      </Card >
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.query.bayar;
  return {
    props: {
      id
    },
  };
}

export default Bayar
