// ** React Imports
import { useState } from 'react'

import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
// ** Third Party Imports
import CardHeader from '@mui/material/CardHeader'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent, Grid } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import axios from 'axios'

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
  nama_elearning: yup.string().required(),
  alamat1: yup.string().required(),
  alamat2: yup.string().required(),
  no_telp: yup.string().required(),
  email: yup.string().required(),
  tipe: yup.string().required(),
  latitude: yup.string().required(),
  longitude: yup.string().required(),
})
const defaultValues = {
  nama_elearning: '',
  alamat1: '',
  alamat2: '',
  no_telp: '',
  email: '',
  latitude: '',
  longitude: '',
  tipe: ''
}
const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const [file, setFile] = useState('')
  const [fileupload, setFileupload] = useState('')
  const [kelas, setKelas] = useState([]);
  const [jenjang, setJenjang] = useState([])
  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const uploadFile = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setFileupload(e.target.files[0])
    } else {
      toast.error("Error silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const onSubmit = data => {
    console.log(data, 'send')
    const config = {
      method: 'post',
      url: '/admin/api/elearning/insert',
      headers: {
        'Content-Type': 'application/json',
        'token': '123'
      },
      data: data
    }
    axios(config)
      .then((res) => {
        route.push('/elearning/list');
      })
      .catch((err) => {
        console.error(err);
      });
    reset()
  }
  const handleClose = () => {
    reset()
    route.push('/elearning/list');
  }

  return (
    <>
      <Headtitle title="Tambah data elearning" />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h4'>
              <Icon icon='tabler:edit' fontSize='1.125rem' />
              {`Tambah Data elearning`}</Typography>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    {/* <Typography variant='h5' sx={{ mb: 0.5 }}> */}
                    <Typography variant='h3' sx={{ mb: 5 }} color={'green'}>Data Kelas</Typography>
                    {/* <hr /> */}

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
                      <label>Nama</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nis ? 'is-invalid' : ''}`}
                        id="nama"
                        name="Nama"
                        placeholder="Nama"
                        defaultValue=""
                        {...register('nama', { required: true })}
                      />
                      {errors.nama && <div className="invalid-feedback">This field is required.</div>}
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

                    <div className="form-group mb-4">
                      <label>Tempat tanggal lahir</label>
                      <input
                        type="text"
                        className={`form-control ${errors.ttl ? 'is-invalid' : ''}`}
                        id="ttl"
                        name="ttl"
                        placeholder="Tempat tanggal lahir"
                        defaultValue=""
                        {...register('ttl', { required: true })}
                      />
                      {errors.ttl && <div className="invalid-feedback">Tempat tanggal lahir is required.</div>}
                    </div>

                    <div className="form-group mb-4">
                      <label>Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="Email"
                        defaultValue=""
                        {...register('email', { required: true })}
                      />
                      {errors.email && <div className="invalid-feedback">Email is required.</div>}
                    </div>
                    <div className="form-group mb-4">
                      <label>Alamat</label>
                      <textarea
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="alamat"
                        name="alamat"
                        defaultValue=""
                        {...register('alamat', { required: true })}
                      />
                      {errors.alamat && <div className="invalid-feedback">Email is required.</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Typography variant='h3' sx={{ mb: 5 }} color={'green'}>Data Materi</Typography>
                    <hr />
                    <h4>Data Pendidikan</h4>


                  </div>
                </div>
                <div className="pt-3 form-group mb-4 row" >
                  <div className="col-md-12 text-center">
                    <button type="submit" className="btn-block btn btn-success" style={{
                      'width': '40%', 'marginRight': '15px'
                    }}>Daftar</button>
                    <button type="reset" onClick={() => confirmbatal()} className="btn-block btn btn-danger" style={{
                      'width': '40%'
                    }}>Batal</button>
                  </div>
                </div>
                {/* <Comodal handleClose={handleClose} show={show} setConfirm={setConfirm} /> */}
              </form>
            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default Index
