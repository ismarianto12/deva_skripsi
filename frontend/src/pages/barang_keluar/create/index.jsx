// ** React Imports
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import axios from 'axios'
import { useRouter } from 'next/router'
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
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
  namaBarang: yup.string().required(),
  kategori: yup.string().required('Wajib diisi'),
  diberikanoleh: yup.string().required('Di keluarkan oleh'),
  lokasi: yup.string().required('Lokasi Wajib diisi'),
  tahun: yup.string().required('Tahun Wajib di isi'),
  // file: yup.mixed().required('A file is required'),

})

const defaultValues = {
  nama_barang: '',
  kd_barang: '',
  stok_awal: '',
  stok_akhir: '',
  harga: '',
  stok_keluar: '',
  jumlah_stok: '',
  created_at: '',
  id_jenisbarang: '',
}
const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')
  const [file, setFile] = useState('')
  const [fileupload, setFileupload] = useState('')
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
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    const callEditbarang = async () => {
      await axios.get(`${process.env.APP_API}master/barang/show/${props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      }).then((data) => {
        reset(data.data.data)
      }).catch((errors) => {
        Swal.fire('info', `Gagal mendapatkan data ${errors}`, 'info')
      })
    }
    callEditbarang()
  }, [])
  const onSubmit = async (data) => {
    try {
      // const formData = new FormData();
      // formData.append('namaBarang', data.namaBarang);
      // formData.append('kategori', data.kategori);
      // formData.append('diberikanoleh', data.diberikanoleh);
      // formData.append('lokasi', data.lokasi);
      // formData.append('tahun', data.tahun);
      // // if (data.file[0]) {
      // formData.append('file', fileupload);
      // }
      const payload = {
        param: 'barang_keluar'
      }
      const paramdata = {
        payload,
        ...data,
      }
      await axios.post(`${process.env.APP_API}master/barang/updatestock`, paramdata, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data Stok Barang berhasil update')
        route.push('/barang/list')
      })
    } catch (error) {

      Swal.fire('error', error.message, 'error')
      if (error.response) {
        console.error('Server responded with:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received');
      } else {
        console.error('Error:', error.message);
      }
    }
  }

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
  const handleClose = () => {
    route.push('/award/list');
  }
  return (
    <>
      <Headtitle title={'Tambah Barang'} />
      <Card>
        <Header>
          <Typography variant='h5'>
            <Icon icon='tabler:edit' />
            Tambah Barang</Typography>
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
      </Card>
      <br />
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='nama_barang'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Nama Barang'
                    onChange={onChange}
                    disabled={true}
                    placeholder='Nama Barang'
                    error={Boolean(errors.namabarang)}
                    {...(errors.title && { helperText: errors.namabarang.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='hargabarang'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    type="number"
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Harga Barang'
                    onChange={onChange}
                    disabled={true}
                    placeholder='Harga Barang'
                    error={Boolean(errors.hargabarang)}
                    {...(errors.title && { helperText: errors.hargabarang.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='kd_barang'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    type="number"
                    label='Kode Barang'
                    onChange={onChange}
                    disabled={true}
                    placeholder='Kode Barang'
                    error={Boolean(errors.kode_barang)}
                    {...(errors.kode_barang && { helperText: errors.kode_barang.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='stok_awal'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type="number"
                    value={value}
                    sx={{ mb: 4 }}
                    label='Stok Awal'
                    onChange={onChange}
                    placeholder='Stok Awal'
                    disabled={true}
                    error={Boolean(errors.stok)}
                    {...(errors.title && { helperText: errors.stok.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='stok_akhir'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    type="number"
                    label='Stok Akhir'
                    onChange={onChange}
                    disabled={true}
                    placeholder='Stok Akhir '
                    error={Boolean(errors.stok)}
                    {...(errors.title && { helperText: errors.stok.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='stok_keluar'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    type="number"
                    sx={{ mb: 4 }}
                    label='Stok Keluar Sebelumnya'
                    onChange={onChange}
                    disabled={true}
                    placeholder='Stok Keluar '
                    error={Boolean(errors.stok_keluar)}
                    {...(errors.stok_keluar && { helperText: errors.stok_keluar.message })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='id_jenisbarang'

                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField select fullWidth label='Status Jenis Barang:' id='form-layouts-tabs-select'
                    value={value}
                    disabled={true}

                    onChange={onChange}
                    error={Boolean(errors.publish)}
                    defaultValues={'Y'}
                    placeholder='Status Publish:'
                    {...(errors.publish && { helperText: errors.publish.message })}
                  >
                    {jenisbarang.map((jenisbarangs, j) => {
                      return (<MenuItem key={`Y`} value={`${jenisbarangs.id}`}>
                        {jenisbarangs.jenis_barang}
                      </MenuItem>)
                    })
                    }

                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='lokasi'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth

                    value={value}
                    sx={{ mb: 4 }}
                    label='Lokasi'
                    onChange={onChange}
                    placeholder='Lokasi'
                    disabled={true}
                    error={Boolean(errors.lokasi)}
                    {...(errors.lokasi && { helperText: errors.lokasi.message })}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>

            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='stok_keluar'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      type="number"
                      sx={{ mb: 4 }}
                      label='Stok Keluar Sekarang'
                      onChange={onChange}
                      disabled={true}
                      placeholder='Stok Keluar '
                      error={Boolean(errors.stok_keluar)}
                      {...(errors.stok_keluar && { helperText: errors.stok_keluar.message })}
                    />
                  )}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item xs={12} sm={3}>
                      <Button type='submit' variant='contained' sx={{ width: '100%', marginRight: '8px' }}>
                        Save
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button variant='tonal' color='info' onClick={handleClose} sx={{ width: '100%' }}>
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </form>
          </Grid>
        </CardContent>
      </Card >
    </>
  )
}

export default Index
