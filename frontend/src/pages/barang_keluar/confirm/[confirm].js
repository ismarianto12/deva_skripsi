import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
import CardHeader from '@mui/material/CardHeader'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import axios from 'axios'
import Swal from 'sweetalert2'
import { getparamPend, prosesPpdb } from 'src/@core/utils/encp'
import { indexKabupaten, indexKecamatan, indexKelurahan, indexProvince } from 'src/@core/utils/masteralamat'

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
  id_provinsi: yup.string().required(),
  nama_ppdb: yup.string().required(),
  alamat1: yup.string().required(),
  alamat2: yup.string().required(),
  no_telp: yup.string().required(),
  email: yup.string().required(),
  latitude: yup.string().required(),
  longitude: yup.string().required(),
  tipe: yup.string().required(),
})


const styles = {
  table: {
    width: '100%',
    textAlign: 'left',
  },
  cstable: {
    border: '0.1px solid #ddd',
    borderCollapse: 'collapse',
  },
  th: {
    border: '0.1px solid #ddd',
    borderCollapse: 'collapse',
    padding: '10px',
  },
  td: {
    border: '0.1px solid #ddd',
    borderCollapse: 'collapse',
    padding: '10px',
  },
  h3: {
    background: 'green',
    color: '#fff',
    textAlign: 'center',
    margin: '0',
    width: '100%'
  },
  img: {
    width: '80%',
    maxWidth: '100%',
  },
};

const parsingStatus = [
  { 'Y': 'Approve' },
  { 'N': 'Reject' }
]

const getParsing = parsingStatus.map(obj => {
  const key = Object.keys(obj)[0]; // Mengambil kunci (key) dari objek
  const value = obj[key]; // Mengambil nilai (value) dari objek

  return { key, value }; // Membentuk objek baru dengan kunci dan nilai
});


const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  const [ppdbdata, setPpdbdata] = useState([])
  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)



  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      id_provinsi: ppdbdata.id_provinsi,
      nama_ppdb: ppdbdata.nama_ppdb,
      alamat1: ppdbdata?.alamat1,
      alamat2: ppdbdata?.alamat2,
      no_telp: ppdbdata?.no_telp,
      email: ppdbdata?.email,
      latitude: ppdbdata?.latitude,
      longitude: ppdbdata?.longitude,
      tipe: ppdbdata?.tipe
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    const calledit = async () => {
      const config = {
        method: 'POST',
        url: `${process.env.APP_API}ppdb/siswadetail/` + props.id,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
      }
      await axios(config)
        .then((res) => {
          console.log(res.data, 'detail data response')
          setPpdbdata(res.data)
        })
        .catch((err) => {
          // toast.message("error can't " + err)
          console.error(err);
        });
    }
    calledit()
  }, [])

  const konfirmasi = (e) => {
    const status = e.target.value;
    const idpdb = props.id
    const parsingdata = status === 'N' ? 'Reject' : 'Proses Terima'
    Swal.fire({
      html: 'Status PPDB Akan di proses :' + parsingdata,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      denyButtonText: `Batal`,
    }).then((result) => {
      if (result.isConfirmed) {
        prosesPpdb({
          status,
          idpdb,
          route
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  const handleClose = () => {
    reset()
    route.push('/ppdb/list');
  }

  console.log(ppdbdata, 'detail')
  const cetakPdf = () => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.APP_API}ppdb/report/${props.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any necessary headers
      },
      body: JSON.stringify({ /* Add any request body if required */ }),
    })
      .then(response => response.blob())
      .then(blob => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
  return (
    <>
      <Headtitle title="Konfirmasi Pendaftaran"
        style={{
          'fontSize': '15px',
          'fontWeight': 'bold'
        }}
      />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:check' fontSize='1.125rem' />
              {`Konfirmasi Pendaftaran`}</Typography>
            <IconButton
              size='small'
              onClick={handleClose}
              sx={{
                p: '0.438rem',
                borderRadius: 1,
                color: 'text.primary',
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
                }
              }}
            >
              <Icon icon='tabler:x' fontSize='1.125rem' />
            </IconButton>
          </Header>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>


            <Grid container spacing={2}>

              <table className='table table-striped' style={styles.table}>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <h4>Formulir PPDB</h4>
                      <tt> Jl. Gapin, Jatisari, Jatiasih, Kota Bekasi, Jawa Barat 17426</tt>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 style={styles.h3}>Data Siswa</h3>

              <table className='table' style={styles.cstable}>
                <tbody>
                  <tr>
                    <td style={{ width: '60%', textAlign: 'center' }}>
                      <img
                        className="logo"
                        src="https://darulmaza.sch.id/wp-content/uploads/2019/08/Header-SIT-512-1030x258.png"
                        alt="Logo Surat"
                        style={{ width: '200px', height: 'auto', marginBottom: '20px' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><b>No Pendaftaran:</b></td>
                    <td>:</td>
                    <td>{ppdbdata.no_daftar}</td>
                  </tr>
                  <tr>
                    <td><b>NIK:</b></td>
                    <td>:</td>
                    <td>{ppdbdata.nik}</td>
                  </tr>
                  <tr>
                    <td>NIS:</td>
                    <td>:</td>
                    <td>{ppdbdata.nis}</td>
                  </tr>
                  <tr>
                    <td>Nama:</td>
                    <td>:</td>
                    <td>{ppdbdata.nama}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>:</td>
                    <td>{ppdbdata.email}</td>
                  </tr>
                  <tr>
                    <td>No HP:</td>
                    <td>:</td>
                    <td>{ppdbdata.no_hp}</td>
                  </tr>
                  <tr>
                    <td>Jenis Kelamin:</td>
                    <td>:</td>
                    <td>{ppdbdata.jk === 'P' ? 'Perempuan' : 'Laki-laki'}</td>
                  </tr>
                  <tr>
                    <td>TTL:</td>
                    <td>:</td>
                    <td>{ppdbdata.ttl}</td>
                  </tr>
                </tbody>
              </table>

              <h3 style={styles.h3}>Data Alamat</h3>

              <table className='table' style={styles.cstable}>
                <tbody>
                  <tr>
                    <td>Provinsi:</td>
                    <td>:</td>
                    <td>{ppdbdata.prov}</td>
                  </tr>
                  <tr>
                    <td>Kabupaten:</td>
                    <td>:</td>
                    <td>{ppdbdata.kab}</td>
                  </tr>
                  <tr>
                    <td>Kecamatan:</td>
                    <td>:</td>
                    <td>{ppdbdata.kec}</td>
                  </tr>
                  <tr>
                    <td>Kelurahan:</td>
                    <td>:</td>
                    <td>{ppdbdata.kel}</td>
                  </tr>
                  <tr>
                    <td>Alamat:</td>
                    <td>:</td>
                    <td>{ppdbdata.alamat}</td>
                  </tr>
                </tbody>
              </table>

              <h3 style={styles.h3}>Data Sekolah</h3>


              <table className='table' style={styles.cstable}>
                <tbody>
                  <tr>
                    <td>Sekolah Asal:</td>
                    <td>:</td>
                    <td>{ppdbdata.sekolah_asal}</td>
                  </tr>
                  <tr>
                    <td>Tahun Lulus:</td>
                    <td>:</td>
                    <td>{ppdbdata.thn_lls}</td>
                  </tr>
                  <tr>
                    <td>Kelas:</td>
                    <td>:</td>
                    <td>{ppdbdata.kelas}</td>
                  </tr>
                  <tr>
                    <td>ID Pendidikan:</td>
                    <td>:</td>
                    <td>{ppdbdata.id_pend}</td>
                  </tr>
                  <tr>
                    <td>ID Majors:</td>
                    <td>:</td>
                    <td>{ppdbdata.id_majors}</td>
                  </tr>
                  <tr>
                    <td>ID Kelas:</td>
                    <td>:</td>
                    <td>{ppdbdata.id_kelas}</td>
                  </tr>
                </tbody>
              </table>

              <h3 style={styles.h3}>Data Orang Tua</h3>
              <table className='table'>
                <tbody>
                  <tr>
                    <td>Nama Ayah:</td>
                    <td>:</td>
                    <td>{ppdbdata.nama_ayah}</td>
                  </tr>
                  <tr>
                    <td>Nama Ibu:</td>
                    <td>:</td>
                    <td>{ppdbdata.nama_ibu}</td>
                  </tr>
                  <tr>
                    <td>Pekerjaan Ayah:</td>
                    <td>:</td>
                    <td>{ppdbdata.pek_ayah}</td>
                  </tr>
                  <tr>
                    <td>Pekerjaan Ibu:</td>
                    <td>:</td>
                    <td>{ppdbdata.pek_ibu}</td>
                  </tr>
                  <tr>
                    <td>Nama Wali:</td>
                    <td>:</td>
                    <td>{ppdbdata.nama_wali}</td>
                  </tr>
                  <tr>
                    <td>Pekerjaan Wali:</td>
                    <td>:</td>
                    <td>{ppdbdata.pek_wali}</td>
                  </tr>
                  <tr>
                    <td>Penghasilan Orang Tua:</td>
                    <td>:</td>
                    <td>{ppdbdata.peng_ortu}</td>
                  </tr>
                  <tr>
                    <td>No Telp:</td>
                    <td>:</td>
                    <td>{ppdbdata.no_telp}</td>
                  </tr>
                  <tr>
                    <td>Tahun Masuk:</td>
                    <td>:</td>
                    <td>{ppdbdata.thn_msk}</td>
                  </tr>
                </tbody>
              </table>

              <div className="float:right">
                <br />
                <h4>Panitia PPDB</h4>
                (ADMIN)
              </div>

            </Grid>
            <h4>Bukti bayar</h4>
            <img
              src={`${process.env.ASSETS_API}/konfirmasi/${ppdbdata?.bukti_bayar}`}
              className='img-responsive'
            />

            <Grid container spacing={5}>
              <Grid item xs={12} sm={5}>
                <CustomTextField select fullWidth label='Status Konfirmasi :' id='form-layouts-tabs-select'
                  onChange={(e) => konfirmasi(e)}
                  error={Boolean(errors.protect)}
                  placeholder='Pilih Status Approval :'
                  {...(errors.protect && { helperText: errors.protect.message })}
                >
                  <MenuItem key={``} value={``}>
                    {`Pilih Status Approval`}
                  </MenuItem>
                  <MenuItem key={`Y`} value={`Y`}>
                    {`Approve`}
                  </MenuItem>
                  <MenuItem key={`N`} value={`N`}>
                    {`Reject`}
                  </MenuItem>
                </CustomTextField>

              </Grid>
              <Grid item xs={12} sm={3}>
                <Button variant='contained'
                  sx={{
                    width: '100%',
                    mt: 5,
                  }}
                  onClick={() =>
                    route.push(`/ppdb/edit/${props.id}`)
                  }
                >
                  <Icon fontSize='1.125rem' icon='tabler:edit' />
                  Edit
                </Button>

              </Grid>
              <Grid item xs={12} sm={3}>
                <Button variant='contained'
                  sx={{
                    width: '100%',
                    mt: 5,
                  }}
                  onClick={() =>
                    cetakPdf()
                  }
                >
                  <Icon fontSize='1.125rem' icon='tabler:print' />
                  Print
                </Button>

              </Grid>
            </Grid>
          </Box >
        </CardContent >
      </Card >
    </>
  )
}



export async function getServerSideProps(context) {
  const id = context.query.confirm;
  return {
    props: {
      id
    },
  };
}


export default Index
