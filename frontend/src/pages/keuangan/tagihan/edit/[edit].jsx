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
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { getparamPend } from 'src/@core/utils/encp'
import Swal from 'sweetalert2'

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
  title: yup.string().required(),
  seotitle: yup.string().required(),
  active: yup.string().required(),
})

const GetDataTagihan = async (props) => {
  await axios.post(`${proces.env.APP_API}/tagihan/detaildata/${props.id}`).then((data) => {
    props.setdataTagihan(data.data)
  }).catch((err) => {
    console.log(err, 'can\'t passing data')
  })
}

const Index = (props) => {
  const route = useRouter();

  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const [datasiswa, setDatasiswa] = useState([])
  const [detailtagihan, setDetailTagihan] = useState([])
  const [dataTagihan, setdataTagihan] = useState([])
  const { params } = useRouter()
  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '', //data?.title,
      seotitle: '', // data?.seotitle,
      active: '' // data?.active,
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
    callTagihan()
  }, [])


  const callTagihan = async () => {
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

  const handleClose = () => {
    reset()
    route.push('/keuangan/tagihan/list')
  }
  console.log(datasiswa, 'datail data')
  return (
    <>
      <Card>
        <CardContent>

          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>

            <div className="row">
              <div className="col-sm-12 col-md-3 mb-4">
                <div style={{ minHeight: 680 }}>
                  <div className="card-header">
                    <p className="card-title text-uppercase text-muted">
                      Sekolah Islam Terpadu Darul Maza
                    </p>
                  </div>
                  <div className="card-body pb-1">
                    <div className="table-responsive">
                      <div className="mb-3 text-center">
                        <img src="https://live.aplikasi-spa.com/media/images/student/photo.png" id="student-photo" className="avatar avatar-xl" draggable="false"
                          style={{
                            'width': '30%'
                          }}

                        />
                      </div>
                      <table className="table text-dark">
                        <thead>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Nama Lengkap</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="student-name">{datasiswa.nama}</span></td>
                          </tr>
                          <tr>
                            <th className="col-4 align-middle" style={{ background: 'none' }}>Nomor Induk</th>
                            <td className="col-1 align-middle">:</td>
                            <td className="align-middle"><span id="student-number">{datasiswa.nis}</span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Jenis Kelamin</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="student-gender">{datasiswa.jk === '1' ? 'Laki' : 'Perempuan'}</span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Tempat Lahir</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="student-pob">{datasiswa.ttl}</span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Tanggal Lahir</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="student-dob">{datasiswa.ttl}</span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Unit Sekarang</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="student-unit">

                              {getparamPend(datasiswa.id_majors)}
                            </span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Kelas Sekarang</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="class-name">10 - A</span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Tahun Ajaran</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="class-year">2023/2024</span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none' }}>Nomor Telepon</th>
                            <td className="align-middle">:</td>
                            <td className="align-middle"><span id="student-phone">-</span></td>
                          </tr>
                          <tr>
                            <th className="align-middle" style={{ background: 'none', borderBottom: 'none' }}>Status</th>
                            <td className="align-middle" style={{ borderBottom: 'none' }}>:</td>
                            <td className="align-middle" style={{ borderBottom: 'none' }}>
                              <span id="student-status">
                                <span className="badge bg-green-lt">Aktif</span>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="pt-3 align-middle text-center" colSpan={3} style={{ borderBottom: 'none' }}>
                              <Link href={`/keuangan/tagihan/${props.id}`} className="btn btn-primary btn-sm">
                                Lihat Detail
                              </Link>

                            </td>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div>                  </div>
              <div className="col-sm-12 col-md-9">
                <div className="mb-3">
                  <div className="card-header border-0 pb-0">
                    <p className="card-title text-muted text-uppercase">
                      Detail Informasi Tagihan
                    </p>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="col-lg-3 col-md-4 col-xs-4 align-middle">
                              Tagihan Unit
                            </th>
                            <td colSpan={4}>
                              MA
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">
                              Tagihan Kelas
                            </th>
                            <td colSpan={4}>
                              10 - A
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">
                              Tahun Ajaran
                            </th>
                            <td colSpan={4}>
                              2023/2024
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">
                              Periode Tagihan
                            </th><td colSpan={4}>
                              Februari 2023
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">
                              Kode Tagihan
                            </th>
                            <td colSpan={4}>
                              FEB23220ALV9RYL8MYEKTMO
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle" rowSpan={6}>
                              Rincian Tagihan
                            </th>
                            <th className="align-middle">
                              Kode Kategori
                            </th>
                            <th className="col-3 align-middle">
                              Nama Tagihan
                            </th>
                            <th className="align-middle">
                              Biaya Tagihan
                            </th>
                            <th className="align-middle">
                              Diskon Tagihan
                            </th>

                          </tr>
                          {dataTagihan?.map((data, list) => {
                            return (
                              <tr>
                                <td>
                                  SPP
                                </td>
                                <td>
                                  SPP
                                </td>
                                <td>
                                  Rp 250,000
                                </td>
                                <td>
                                  Rp 250,000
                                </td>
                              </tr>

                            )
                          })}

                        </thead>
                      </table>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="col-lg-3 col-md-4 col-xs-4">
                              Jumlah Diskon
                            </th>
                            <td colSpan={6}>
                              Rp 500,000
                            </td>
                          </tr>
                          <tr>
                            <th>
                              Jumlah Tagihan
                            </th>
                            <td colSpan={6}>
                              Rp 500,000
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">
                              Jumlah Dibayar
                            </th>
                            <td className="align-middle text-success" colSpan={6}>
                              Rp 500,000
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">
                              Jumlah Tunggakan
                            </th>
                            <td className="align-middle text-danger" colSpan={6}>
                              Rp 0
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle">
                              Status Tagihan
                            </th>
                            <td className="align-middle" colSpan={6}>
                              <span className="text-success">
                                Lunas
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-discount-check-filled" width={40} height={40} viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                  <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" strokeWidth={0} fill="currentColor" />
                                </svg>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th className="align-middle" rowSpan={3}>
                              Riwayat Pembayaran
                            </th>
                            <th className="align-middle">
                              Pembayaran x1
                            </th>
                            <th className="align-middle">
                              Pembayaran x2
                            </th>
                            <th className="align-middle">
                              Pembayaran x3
                            </th>
                            <th className="align-middle">
                              Pembayaran x4
                            </th>
                            <th className="align-middle">
                              Pembayaran x5
                            </th>
                            <th className="align-middle">
                              Pembayaran x6
                            </th>
                          </tr>
                          <tr>
                          </tr><tr>
                            <td className="align-middle">
                              Rp 500,000
                            </td>
                            <td className="align-middle">
                              Rp 0
                            </td>
                            <td className="align-middle">
                              Rp 0
                            </td>
                            <td className="align-middle">
                              Rp 0
                            </td>
                            <td className="align-middle">
                              Rp 0
                            </td>
                            <td className="align-middle">
                              Rp 0
                            </td>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div>
                Riwayat Pembayaran
                <div className="table-responsive">
                  <form id="multiple-print" method="POST" action="https://live.aplikasi-spa.com/admin/transactions/print?ps=Rlh1NmhHRDhjNFJHOStZNExnNDZSQT09" target="_blank">
                    <input type="hidden" name="_token" defaultValue="BckOk2CHDsNY4KMfzZGlx4VT4rcytxSln25mjds4" />
                    <table className="table table-bordered table-vcenter">
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th>Nama Lengkap</th>
                          <th>Jumlah Pembayaran</th>
                          <th>Kode Pembayaran</th>
                          <th>Waktu Pembayaran</th>
                          <th>Status</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">
                            1
                          </td>
                          <td>
                            {datasiswa.nama}
                          </td>
                          <td>
                            Rp 500,000
                          </td>
                          <td>
                            23110823NRW7ZIMK8H1028
                          </td>
                          <td>
                            08/11/2023 23:03
                          </td>
                          <td>
                            <span className="text-success">Lunas</span>
                          </td>
                          <td className="text-center">
                            <Link href={`/keuangan/tagihana/printdetail/${props.id}`} className="btn btn-default btn-sm" target="_blank">
                              Lihat Detail
                            </Link>

                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                </div>
              </div>
            </div>


          </Box>
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


export default Index
