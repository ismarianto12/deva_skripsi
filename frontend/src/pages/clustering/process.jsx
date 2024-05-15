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
  namaBarang: yup.string().required(),
  kategori: yup.string().required('Wajib diisi'),
  diberikanoleh: yup.string().required('Di keluarkan oleh'),
  lokasi: yup.string().required('Lokasi Wajib diisi'),
  tahun: yup.string().required('Tahun Wajib di isi'),
  // file: yup.mixed().required('A file is required'),
})
const kodebarang = [
  {
    id: "C1",
    name: 'BANYAK TERJUAL',
  },
  {
    id: "C2",
    name: 'SEDIKIT TERJUAL',

  },
  {
    id: "C3",
    name: 'TIDAK LARIS TERJUAL',
  }
]

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
    try { } catch (error) {

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

  const handleClose = () => {
    route.push('/barang/list');
  }
  return (
    <>
      <Headtitle title={'Tambah Barang'} />
      <Card>
        <Header>
          <Typography variant='h5'>
            <Icon icon='tabler:edit' />
            Proses Iterasi</Typography>
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
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='jumlah_iterasi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Jumlah Cluster'
                        onChange={onChange}
                        placeholder='Jumlah Cluster'
                      // error={Boolean(errors.namabarang)}
                      // {...(errors.title && { helperText: errors.namabarang.message })}
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
                      <CustomTextField select fullWidth label='Status Berita :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.publish)}
                        defaultValues={'Y'}
                        placeholder='Status Publish:'
                        {...(errors.publish && { helperText: errors.publish.message })}
                      >
                        {kodebarang.map((kodebarangs) => (
                          <MenuItem key={kodebarangs.id} value={kodebarangs.name}>
                            {kodebarangs.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='jumlah_iterasi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Maximal Perulangan'
                        onChange={onChange}
                        placeholder='Max Perulangan'
                      // error={Boolean(errors.namabarang)}
                      // {...(errors.title && { helperText: errors.namabarang.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='periode'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type="date"
                        value={value}
                        sx={{ mb: 4 }}
                        label='Periode'
                        onChange={onChange}
                        placeholder='Periode'
                      // error={Boolean(errors.namabarang)}
                      // {...(errors.title && { helperText: errors.namabarang.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>


              <img src={file} style={{ 'width:': '80%' }} />
              <br /><br />
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
                      Process
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
