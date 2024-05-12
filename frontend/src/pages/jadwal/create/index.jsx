// ** React Imports
import { useState, useEffect } from 'react'
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
// import FormLabel
// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent, FormLabel } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import { getAlbum } from 'src/@core/utils/getcategory'
import axios from 'axios'
import toast from 'react-hot-toast'
import Editordata from 'src/@core/components/Editordata'
import Radio from '@mui/material/Radio'
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
  // deskripsiId: yup.string().required(),
  // deskripsiEn: yup.string().required(),
  topic: yup.string().required()
})

const defaultValues = {
  deskripsiId: '',
  deskripsiEn: '',
  topic: '',
  gambar: '',
}


const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [deskripsiId, setdeskripsiId] = useState('')
  const [deskripsiEn, setdeskripsiEn] = useState('')
  const [role, setRole] = useState('subscriber')
  const [album, setAlbum] = useState([]);
  const [fileupload, setFileupload] = useState('')
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(true)
  const [typeedu, setTypeedu] = useState('')
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
    const call = async () => {
      await getAlbum({ album, setAlbum })
    }
    call().then(() => {
      setLoading(false)
    });
  }, []);

  const onSubmit = async (data) => {

    if (deskripsiId === '' && deskripsiEn === '') {
      toast.error('Silahkan isi deskripsi bahasa indonesia dan bahasa inggris .');
    } else {
      try {

        setLoading(true)

        const formData = new FormData();
        formData.append('topic', data.topic);
        formData.append('deskripsiId', deskripsiId);
        formData.append('deskripsiEn', deskripsiEn);
        formData.append('jam_mulai', data.jam_mulai);
        formData.append('jam_berakhir', data.jam_berakhir);
        formData.append('type_edukasi', typeedu);

        if (data.gambar[0]) {
          formData.append('gambar', fileupload);
        }
        await axios.post(`${process.env.APP_API}jadwal/insert`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }).then(() => {
          setLoading(false)
          toast.success('Data Galery berhasil ditambahkan')
          Swal.fire({
            title: 'Success',
            text: 'Data Jadwal Berhasil di tambahkan ',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          route.push('/jadwal/list')
        })
      } catch (error) {
        setLoading(false)
        Swal.fire({
          title: 'error',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })

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
  }
  const uploadFile = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setFileupload(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }

  const handleClose = () => {
    route.push('/jadwal/list');
  }

  return (
    <>
      <Headtitle title={'Jadwal Edukasi.'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>

              <Icon icon='tabler:edit' />
              Jadwal edukasi </Typography>
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
              <Controller
                name='topic'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Topic'
                    onChange={onChange}
                    placeholder='Topic'
                    error={Boolean(errors.title)}
                    {...(errors.title && { helperText: errors.title.message })}
                  />
                )}
              />
              <br /><br />
              <Controller
                name='deskripsiId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Deskripsi (Bahasa Indonesia)
                    <Editordata content={deskripsiId} setContent={setdeskripsiId} />
                  </>

                )}
              />
              {errors.deskripsiId && (
                <span className="error">{errors.deskripsiId.message}</span>
              )}
              <br /><br />
              <Controller
                name='deskripsiEn'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Deskripsi (Bahasa Inggris)
                    <Editordata content={deskripsiEn} setContent={setdeskripsiEn} />
                  </>
                )}
              />
              {errors.deskripsiEn && (
                <span className="error">{errors.deskripsiEn.message}</span>
              )}
              <br /><br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='tangal_edukasi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='date'
                        label='Tanggal Edukasi'
                        sx={{ mb: 4 }}
                        onChange={(e) => { onChange }
                        }
                        error={Boolean(errors.gambar)}
                        placeholder='Tanggal Edukasi'
                        {...(errors.tanggal_edukasi && { helperText: errors.tanggal_edukasi.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='jam_mulai'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='time'
                        label='Jam Mulai'
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                        }
                        }
                        error={Boolean(errors.jam_mulai)}
                        placeholder='Jam Mulai'
                        {...(errors.jam_mulai && { helperText: errors.jam_mulai.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='jam_berakhir'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='time'
                        label='Jam berakhir'
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                        }
                        }
                        error={Boolean(errors.tangal_edukasi)}
                        placeholder='Jam berakhir'
                        {...(errors.tangal_edukasi && { helperText: errors.tangal_edukasi.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <br /><br />
              <Grid container spacing={2}>

                <Grid item xs={12} sm={3}>
                  Type Edukasi
                </Grid>

                {['Konvensional', 'Syariah', 'Eksternal'].map((lisdataPtops, i) => {
                  return (
                    <Grid item xs={12} sm={3}>
                      {`${lisdataPtops}`}
                      <Controller
                        name='type_edukasi'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Radio
                            size='small'
                            value={i + 1}
                            onChange={(e, value) => {
                              console.log(typeedu, 'value')
                              onChange,
                                setTypeedu(e.target.value)
                            }
                            }
                            checked={i + 1 == typeedu}
                            sx={{ mb: -2, mt: -2.5, ml: -2.75 }}
                          />
                        )}
                      />
                    </Grid>)

                })

                }


              </Grid>




              <br /><br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar'
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
                          onChange(e)
                          uploadFile(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='link_registrasi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='text'
                        label='Link Registrasi'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Link Registrasi'
                        {...(errors.link_registrasi && { helperText: errors.link_registrasi.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <br /><br />

              <img src={file} style={{
                'width': '50%'
              }} />

              <br /> <br />
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

      <Preloading show={loading} />
    </>
  )
}

export default Index
