// ** React Imports
import { useState, useEffect } from 'react'
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
import { Autocomplete, Divider } from '@mui/material'
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField';
// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
// import { barangfetch } from 'src/pages/purcashing/edit/callapi'
import { barangfetch } from 'src/store/callapi'

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
  namaBarang: yup.string().required(),
  kategori: yup.string().required('Wajib diisi'),
  diberikanoleh: yup.string().required('Di keluarkan oleh'),
  lokasi: yup.string().required('Lokasi Wajib diisi'),
  tahun: yup.string().required('Tahun Wajib di isi'),
})


const defaultValues = {
  namaBarang: '',
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
  const [masterbarang, setMasterBarang] = useState([])

  const [fileupload, setFileupload] = useState('')


  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  useEffect(() => {
    barangfetch().then((data) => {
      const filteredData = data.data.data.map((f) => ({
        label: f.nama_barang,
        barang_id: f.id
      }))
      console.log(filteredData, 'filteredData')
      setMasterBarang(filteredData)
    })
  }, [])

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
      formData.append('namaBarang', data.namaBarang);
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
      <Headtitle title={'Setting Barang'} />
      <Card>
        <Header>
          <Typography variant='h5'>
            <Icon icon='tabler:edit' />
            Edit Barang Masuk</Typography>
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
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='stok_awal'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        disablePortal
                        onChange={() => {

                        }}
                        id="combo-box-demo"
                        options={masterbarang ? masterbarang : []}
                        sx={{ width: '100%', 'height': '40px' }}
                        renderInput={(params) => <TextField {...params} label="Barang" size="small" />}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='stok_akhir'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Harga Barang'
                        onChange={onChange}
                        placeholder='Harga Barang'
                        error={Boolean(errors.hargabarang)}
                        {...(errors.title && { helperText: errors.hargabarang.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='stock_awal'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Tambah Stok Barang'
                        onChange={onChange}
                        placeholder='Stock Barang '
                        error={Boolean(errors.stock)}
                        {...(errors.title && { helperText: errors.stock.message })}
                      />
                    )}
                  />
                </Grid>
                {/* </Grid> */}

                {/* <Typography variant='h5' sx={{ mb: 0.5 }}>
                <Icon icon='tabler:files' fontSize='1.125rem' />
                Jenis Barang
              </Typography>
              <hr />
              <br /> */}
                {/* <Grid container spacing={2}> */}

              </Grid>

              <hr />
              {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Grid container justifyContent="flex-end">
                  <Grid item xs={12} sm={6} spacing={2} sx={{
                    'padding': '10px'
                  }}>
                    <Button type='submit' variant='contained' sx={{ 'width': '50%' }}>
                      Save
                    </Button>

                    <Button variant='tonal' color='secondary' onClick={handleClose} sx={{ 'width': '50%' }}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box> */}
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
            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default Index
