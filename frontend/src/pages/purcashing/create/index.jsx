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
import TextField from '@mui/material/TextField';
import { barangfetch, distributorfetch } from 'src/store/callapi'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Autocomplete, Card, CardContent, Divider } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import Preloading from 'src/@core/components/Preloading'
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
  // id_barang: yup.string().required("Wajib diisi"),
  jumlah: yup.string().required('Wajib diisi'),
  // tanggal_purchasing: yup.string().required('Wajib diisi'),
  // lokasi: yup.string().required('Lokasi Wajib diisi'),
  // tahun: yup.string().required('Tahun Wajib di isi'),
  // file: yup.mixed().required('A file is required'),
})

const defaultValues = {
  id: '',
  id_purchasing: '',
  id_barang: '',
  jumlah: '',
  tanggal_purchasing: '',
  total_biaya: '',
  id_distributor: '',
  created_at: '',
  updated_at: '',
  no_faktur: '',
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
  const [stockavail, setStockavaild] = useState('')
  const [loading, setLoading] = useState(false)
  const [masterbarang, setMasterBarang] = useState([])
  const [masterdistributor, setMasterDistributor] = useState([])
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  useEffect(() => {
    barangfetch().then((data) => {
      const filteredData = data.data.data.map((f) => ({
        label: `${f.nama_barang}`,
        stock: `${f.jumlah_stok}`,
        value: f.id
      }))
      console.log(filteredData, 'filteredData')
      setMasterBarang(filteredData)
    })
    distributorfetch().then((data) => {
      const filteredDistributot = data.data.data.map((r) => ({
        label: r.nama_distributor,
        value: r.id,
      }))
      console.log(filteredDistributot, 'filteredDistributot')
      setMasterDistributor(filteredDistributot)
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
    setLoading(true)
    console.log(data, 'data')
    try {
      await axios.post(`${process.env.APP_API}master/purchasing/insert`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data Award berhasil ditambahkan')
        route.push('/purcashing/list')
      })
    } catch (error) {
      setLoading(false)
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
    route.push('/purcashing/list');
  }
  return (
    <>
      <Headtitle title={'Tambah Purchasing'} />
      <Card>
        <Header>
          <Typography variant='h5'>
            <Icon icon='tabler:edit' />
            Tambah Purchasing</Typography>
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
          <br />
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <Typography variant='h5' sx={{ mb: 0.5 }}>
              <br />
              <Icon icon='tabler:cube' fontSize='1.125rem' />
              Barang
            </Typography>
            <br />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='id_barang'

                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      // <Autocomplete
                      //   value={masterbarang.find(option => option.value === value) || null}
                      //   // disablePortal
                      //   id="tags-outlined"
                      //   filterSelectedOptions
                      //   onChange={(event, newValue) => {
                      //     console.log(newValue, 'data onchange');
                      //     onChange(newValue ? newValue.value : null);
                      //     setStockavaild(newValue?.stock)
                      //   }}
                      //   // id="combo-box-demo"
                      //   options={masterbarang ? masterbarang : []}
                      //   sx={{ width: '100%', 'height': '40px' }}
                      //   renderInput={(params) =>
                      //     <TextField {...params} label="Barang" size="small" />
                      //   }
                      //   {...(errors.id_barang && { helperText: errors.id_barang.message })}

                      // />
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={masterbarang}
                        getOptionLabel={(option) => option.label}
                        filterSelectedOptions
                        onChange={(event, newValue) => {
                          onChange(newValue); // Memanggil fungsi onChange dengan nilai newValue
                          setStockavaild(newValue ? newValue.stock : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Pilih data barang"
                            placeholder="Favorites"
                            size="small"
                          />
                        )}
                      />

                    )}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='no_faktur'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='No Faktur'
                        onChange={onChange}
                        placeholder='No Faktur'
                        error={Boolean(errors.no_faktur)}
                        {...(errors.title && { helperText: errors.no_faktur.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{
                  'marginTop': '2px'
                }}>
                  <Controller
                    name='jumlah'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Jumlah'
                        onChange={onChange}
                        placeholder='Jumlah'
                        error={Boolean(errors.jumlah)}
                        {...(errors.jumlah && { helperText: errors.jumlah.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Stock Avaliable'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        disabled
                        value={`${stockavail} /PCS`}
                        sx={{ mb: 4 }}
                        label='Stock Avaliable'
                        onChange={onChange}
                        placeholder='Jumlah'
                        error={Boolean(errors.stock)}
                        {...(errors.title && { helperText: errors.stock.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <br />
              <hr />
              <Typography variant='h5' sx={{ mb: 0.5 }}>
                <br />
                <Icon icon='tabler:files' fontSize='1.125rem' />
                Tanggal Purchasing Barang
              </Typography>
              <br />
              <Grid container spacing={3} md={12}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='tanggal_purchasing'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField type="date" fullWidth label='Tgl Purchasing:'
                        value={value}
                        error={Boolean(errors.publish)}
                        defaultValues={'Y'}
                        onChange={(value) => onChange(value)}
                        placeholder='tanggal_purcashing'
                        {...(errors.tanggal_purchasing && { helperText: errors.tanggal_purchasing.message })}
                      />

                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='id_distributor'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        // value={value}
                        value={masterdistributor.find(option => option.value === value) || null}

                        disablePortal
                        // onChange={(event, newValue) => onChange(newValue)} // Menambahkan onChange untuk mengubah nilai
                        onChange={(event, newValue) => onChange(newValue ? newValue.value : null)}
                        id="combo-box-demo"
                        options={masterdistributor}
                        sx={{ width: '100%', 'height': '40px' }}
                        renderInput={(params) => <TextField {...params} label="Disributor" size="small" />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>

                  <Controller
                    name='total_harga'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        disabled
                        value={`${stockavail} /PCS`}
                        sx={{ mb: 4 }}
                        label='Estimasi Total Purcashse Barang'
                        onChange={onChange}
                        placeholder='Jumlah'
                        error={Boolean(errors.stock)}
                        {...(errors.title && { helperText: errors.stock.message })}
                      />
                    )}
                  />
                  <Typography variant='h5' sx={{ mb: 0.5 }}>


                    Total Purchasing
                  </Typography>
                  <small>
                    Estimasi
                  </small>
                  <br /><br /><br />
                </Grid>


                <Divider sx={{ marginTop: '110px' }} />
              </Grid>


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
            <Preloading show={loading} />
          </Box>
        </CardContent>
      </Card>

    </>
  )
}

export default Index
