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
import { Card, CardContent, Divider } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import { getAlbum } from 'src/@core/utils/Masterdata'

import axios from 'axios'
import toast from 'react-hot-toast'
import Editordata from 'src/@core/components/Editordata'
import { getUserlogin } from 'src/@core/utils/encp'

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
  judulin: yup.string().required(),
  judulEn: yup.string().required(),
  // isi: yup.string().required(),
  // isiEng: yup.string().required(),
  category_donwload_id: yup.string().required()
})

const defaultValues = {
  judulin: '',
  judulEn: '',
  isi: '',
  isiEng: '',
  file: '',
  category_donwload_id: '',
}


const Index = props => {
  const route = useRouter()
  const { open, toggle } = props
  const [album, setAlbum] = useState([])
  const [fileupload, setFileupload] = useState('')

  const [deskripsiIn, setDeskripsiIn] = useState('')
  const [deskripsiEn, setDeskripsiEn] = useState('')

  const [file, setFile] = useState('')
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
    call()
  }, [])

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      const user_id = getUserlogin('id')
      const level = getUserlogin('role')
      formData.append('user_id', user_id)
      formData.append('level', level)
      formData.append('judulin', data.judulin)
      formData.append('judulEn', data.judulEn)
      formData.append('isi', deskripsiIn)
      formData.append('isiEng', deskripsiEn)
      formData.append('category_donwload_id', data.category_donwload_id)
      formData.append('file', fileupload)
      await axios.post(`${process.env.APP_API}download/insert`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data Galery berhasil ditambahkan')
        route.push('/download/list')
      })
    } catch (error) {
      if (error.response) {
        console.error('Server responded with:', error.response.status)
        console.error('Response data:', error.response.data)
      } else if (error.request) {
        console.error('No response received')
      } else {
        console.error('Error:', error.message)
      }
    }
  }
  const uploadFile = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp']
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase()
    if (allowedExtensions.includes(fileExtension)) {
      setFile(URL.createObjectURL(e.target.files[0]))
      setFileupload(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const handleClose = () => {
    route.push('/download/list')
  }

  return (
    <>
      <Headtitle title={'Tambah data download'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:list' />
              Tambah Download</Typography>
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
                    name='judulin'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Judul Indonesia'
                        onChange={onChange}
                        placeholder='Judul Indonesia'
                        error={Boolean(errors.judulin)}
                        {...(errors.judulin && { helperText: errors.judulin.message })}
                      />
                    )}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>


                  <Controller
                    name='judulEn'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Judul'
                        onChange={onChange}
                        placeholder='Judul English'
                        error={Boolean(errors.judulEn)}
                        {...(errors.judulEn && { helperText: errors.judulEn.message })}
                      />
                    )}
                  />

                </Grid>
              </Grid>



              <br /> <br />
              <Divider variant="middle" />
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>

                  <Controller
                    name='isi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      // <CustomTextField
                      //   fullWidth
                      //   multiline
                      //   minRows={3}
                      //   label='Deskripsi Indonesia'
                      //   onChange={onChange}
                      //   value={value}
                      //   placeholder='Deskripsi Indonesia'
                      //   sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                      //   InputProps={{
                      //     startAdornment: (
                      //       <InputAdornment position='start'>
                      //         <Icon fontSize='1.25rem' icon='tabler:message' />
                      //       </InputAdornment>
                      //     )
                      //   }}
                      //   error={Boolean(errors.isi)}
                      //   {...(errors.isi && { helperText: errors.isi.message })}
                      // />
                      <>
                        <span>Deskripsi Indonesia</span>
                        <Editordata content={deskripsiIn} setContent={setDeskripsiIn} />
                      </>
                    )}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='isiEng'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <span>Deskripsi English</span>
                        <Editordata content={deskripsiEn} setContent={setDeskripsiEn} />
                      </>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>

                  <Controller
                    name='category_donwload_id'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField select fullWidth label='Pilih Album :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.category_donwload_id)}
                        placeholder='Kategory Donwload'
                        {...(errors.category_donwload_id && { helperText: errors.category_donwload_id.message })}
                      >
                        {album.map((albums) => (
                          <MenuItem key={albums.id} value={albums.title}>
                            {albums.title}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />


                </Grid>
                <Grid item xs={12} sm={6}>



                  <Controller
                    name='gambar'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='File Extensi yang bisa di terima  (xls,pdf,jpg,bmp)'
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
    </>
  )
}

export default Index
