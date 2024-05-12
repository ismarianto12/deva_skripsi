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
// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import { getAlbum } from 'src/@core/utils/getcategory'
import axios from 'axios'
import toast from 'react-hot-toast'
import Editordata from 'src/@core/components/Editordata'
import Preloading from 'src/@core/components/Preloading'

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
  titleID: yup.string().required(),
  titleEn: yup.string().required(),
  filethumnaild: yup.string().required(),
  imagepopup: yup.string().required(),
  filethumnaild: yup.string().required(),
  imagepopup: yup.string().required(),
  imageheader: yup.string().required(),
  document1: yup.string().required(),
  document2: yup.string().required(),
  linkvideo: yup.string().required(),
})

const defaultValues = {
  titleID: '',
  titleEn: '',
  deskripsiId: '',
  deskripsiEn: '',
  filethumnaild: '',
  imagepopup: '',
  imageheader: '',
  document1: '',
  document2: '',
  linkvideo: '',
}

// titleID
// titleEn
// deskripsiId
// deskripsiEn
// imagepopup
// filethumnaild
// imagepopup
// imageheader
// document1
// document2
// linkvideo

const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')
  const [album, setAlbum] = useState([]);
  const [fileupload, setFileupload] = useState('')
  const [file, setFile] = useState('')
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  // file
  const [filethumnaild, setParfilethumnaild] = useState('')
  const [imagepopup, setParimagepopup] = useState('')
  const [imageheader, setParimageheader] = useState('')
  const [document1, setPardocument1] = useState('')
  const [document2, setPardocument2] = useState('')
  const [deskripsiId, setDeskripsiId] = useState('')
  const [deskripsiEn, setDeskripsiEn] = useState('')
  const [loading, setLoading] = useState(true);

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
    }, [loading]);
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('titleID', data.titleID);
      formData.append('titleEn', data.titleEn);
      formData.append('deskripsiId', deskripsiId);
      formData.append('deskripsiEn', deskripsiEn);
      formData.append('filethumnaild', filethumnaild);
      formData.append('imagepopup', imagepopup);
      formData.append('imageheader', imageheader);
      formData.append('document1', document1);
      formData.append('document2', document2);
      formData.append('linkvideo', data.linkvideo);

      await axios.post(`${process.env.APP_API}promo/insert`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data Promo berhasil ditambahkan')
        route.push('/promo/list')
      })
    } catch (error) {
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

  const handlefilethumnaild = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bpm', 'pdf', 'ppt']
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase()
    if (allowedExtensions.includes(fileExtension)) {
      setParfilethumnaild(e.target.files[0])
    } else {
      toast.error('Error', 'Esktensi Fitdak di izinkan')
    }
  }
  const handleimagepopup = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bpm', 'pdf', 'ppt']
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase()
    if (allowedExtensions.includes(fileExtension)) {
      setParimagepopup(e.target.files[0])
    } else {
      toast.error('Error', 'Esktensi Fitdak di izinkan')
    }
  }
  const handleimageheader = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bpm', 'pdf', 'ppt']
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase()
    if (allowedExtensions.includes(fileExtension)) {
      setParimageheader(e.target.files[0])
    } else {
      toast.error('Error', 'Esktensi Fitdak di izinkan')
    }
  }
  const handledocument1 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bpm', 'pdf', 'ppt']
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase()
    if (allowedExtensions.includes(fileExtension)) {
      setPardocument1(e.target.files[0])
    } else {
      toast.error('Error', 'Esktensi Fitdak di izinkan')
    }
  }
  const handledocument2 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bpm', 'pdf', 'ppt']
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase()
    if (allowedExtensions.includes(fileExtension)) {
      setPardocument2(e.target.files[0])
    } else {
      toast.error('Error', 'Esktensi Fitdak di izinkan')
    }
  }

  const handleClose = () => {
    route.push('/promo/list');
  }

  //
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


  return (
    <>
      <Headtitle title={'List Promo'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>

              <Icon icon='tabler:edit' />
              Tambah Promo</Typography>
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
                    name='titleID'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Judul (ID)'
                        onChange={onChange}
                        placeholder='Judul (ID)'
                        error={Boolean(errors.titleID)}
                        {...(errors.titleID && { helperText: errors.titleID.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>

                  <Controller
                    name='titleEn'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Judul (En)'
                        onChange={onChange}
                        placeholder='Judul (EN)'
                        error={Boolean(errors.title)}
                        {...(errors.title && { helperText: errors.title.message })}
                      />
                    )}
                  />

                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>


                <Controller
                  name='deskripsiId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Editordata content={deskripsiId} setContent={setDeskripsiId} />
                  )}
                />
              </Grid>
              <br />
              <Grid item xs={12} sm={6}>


                <Controller
                  name='deskripsiEn'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Editordata content={deskripsiEn} setContent={setDeskripsiEn} />
                  )}
                />
                <br />
              </Grid>


              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='filethumnaild'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'

                        value={value}
                        sx={{ mb: 4 }}
                        label='Insert Image Thumnail'
                        onChange={(e) => {
                          onChange(e)
                          handlefilethumnaild(e)

                        }}
                        placeholder='Insert Image Thumnail'
                        error={Boolean(errors.filethumnaild)}
                        {...(errors.filethumnaild && { helperText: errors.filethumnaild.message })}
                      />
                    )}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>

                  <Controller
                    name='imagepopup'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'

                        value={value}
                        sx={{ mb: 4 }}
                        label='Insert Image Pop Up'
                        onChange={(e) => {
                          onChange(e)
                          handleimagepopup(e)

                        }}
                        placeholder='Insert Image Pop Up'
                        error={Boolean(errors.imagepopup)}
                        {...(errors.imagepopup && { helperText: errors.imagepopup.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>


              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='document1'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        value={value}
                        sx={{ mb: 4 }}
                        label='Insert Document 1 (Pelengkap)'
                        onChange={(e) => {
                          onChange(e)

                          handledocument1(e)

                        }}
                        placeholder='Insert Document 1 (Pelengkap)'
                        error={Boolean(errors.document1)}
                        {...(errors.document1 && { helperText: errors.document1.message })}
                      />
                    )}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='document2'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        value={value}
                        sx={{ mb: 4 }}
                        label='Insert Document 2 (Pelengkap)'
                        onChange={(e) => {
                          onChange(e)
                          handledocument2(e)
                        }}
                        placeholder='Insert Document 2 (Pelengkap)'
                        error={Boolean(errors.document2)}
                        {...(errors.document2 && { helperText: errors.document2.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='linkvideo'
                    control={control}
                    type='text'
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Link Video'
                        onChange={onChange}
                        placeholder='Link Video'
                        error={Boolean(errors.linkvideo)}
                        {...(errors.linkvideo && { helperText: errors.linkvideo.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='imageheader'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'

                        value={value}
                        sx={{ mb: 4 }}
                        label='Gambar Header'
                        onChange={(e) => {
                          onChange(e)
                          handleimageheader(e)

                        }}
                        placeholder='Judul Galery'
                        error={Boolean(errors.imageheader)}
                        {...(errors.imageheader && { helperText: errors.imageheader.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

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
