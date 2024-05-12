// ** React Imports
import { useState } from 'react'
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
  namapenghargaan: yup.string().required(),
  kategori: yup.string().required('Wajib diisi'),
  diberikanoleh: yup.string().required('Di keluarkan oleh'),
  lokasi: yup.string().required('Lokasi Wajib diisi'),
  tahun: yup.string().required('Tahun Wajib di isi'),
  // file: yup.mixed().required('A file is required'),

})


const defaultValues = {
  namapenghargaan: '',
  kategori: '',
  diberikanoleh: '',
  lokasi: '',
  tahun: '',
  file: '',
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
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('namapenghargaan', data.namapenghargaan);
      formData.append('kategori', data.kategori);
      formData.append('diberikanoleh', data.diberikanoleh);
      formData.append('lokasi', data.lokasi);
      formData.append('tahun', data.tahun);
      // if (data.file[0]) {
      formData.append('file', fileupload);
      // }
      await axios.post(`${process.env.APP_API}award/insert`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data Award berhasil ditambahkan')
        route.push('/award/list')
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
      <Headtitle title={'Tambah Penghargaan'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>

              <Icon icon='tabler:edit' />
              Tambah Penghargaan</Typography>
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='namapenghargaan'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Nama Penghargaan'
                        onChange={onChange}
                        placeholder='Nama Penghargaan'
                        error={Boolean(errors.title)}
                        {...(errors.title && { helperText: errors.title.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='kategori'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Kategori Penghargaan'
                        onChange={onChange}
                        placeholder='Kategori Penghargaan '
                        error={Boolean(errors.title)}
                        {...(errors.title && { helperText: errors.title.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='diberikanoleh'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Diberikan Oleh'
                        onChange={onChange}
                        placeholder='Diberikan Oleh'
                        error={Boolean(errors.diberikanoleh)}
                        {...(errors.diberikanoleh && { helperText: errors.diberikanoleh.message })}
                      />
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
                        error={Boolean(errors.lokasi)}
                        {...(errors.lokasi && { helperText: errors.lokasi.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='tahun'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type="date"
                        value={value}
                        sx={{ mb: 4 }}
                        label='Tahun'
                        onChange={onChange}
                        placeholder='Tahun'
                        error={Boolean(errors.tahun)}
                        {...(errors.tahun && { helperText: errors.tahun.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='file'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          uploadFile(e)
                          onChange()
                        }
                        }
                        error={Boolean(errors.file)}
                        placeholder='Gambar'
                        {...(errors.file && { helperText: errors.file.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <img src={file} style={{ 'width:': '80%' }} />
              <br /><br />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' sx={{ mr: 3, 'width': '50%' }}>
                  Save
                </Button>
                <Button variant='tonal' color='secondary' onClick={handleClose} sx={{ mr: 3, 'width': '50%' }}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default Index
