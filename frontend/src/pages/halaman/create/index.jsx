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
import { addUser } from 'src/store/apps/user'
import { Card, CardContent, Divider } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import { getcategory, getTag } from 'src/@core/utils/getcategory'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw } from 'draft-js'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import axios from 'axios'
import draftToHtml from "draftjs-to-html";

import toast from 'react-hot-toast'
import Editordata from 'src/@core/components/Editordata'
import Swal from 'sweetalert2'
import Preloading from 'src/@core/components/Preloading'


const convertToHtml = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const rawContentState = convertToRaw(contentState);
  const markup = draftToHtml(rawContentState); // You will need to import and use an HTML converter library, like draftjs-to-html
  return markup;
};

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
  // titleen: yup.string().required(),
  // title: yup.string().required(),
})
const defaultValues = {
  id_category: '',
  headline: '',
  tags: '',
  active: '',
  title: '',
  titleen: '',
  contentIN: '',
  contentENG: '',
  picture: ''
}

const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [data, setData] = useState([])
  const [tagdata, setTagdata] = useState([])
  const [fileupload, setFileupload] = useState('')
  const [setcontenin, setContenin] = useState('')
  const [setcontenten, setContenEn] = useState('')
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState('')
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  useEffect(() => {
    const call = async () => {
      await getcategory({ data, setData }).then(() => {
        setLoading(false)
      })
    }
    const calltag = async () => {
      await getTag({
        tagdata,
        setTagdata
      })
    }
    call()
    calltag()
  }, []);
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
    if (data.picture[0] === '') {
      Swal.fire({
        title: 'Info!',
        text: 'Thumnail wajib di upload',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    } else if (setcontenin === '' &&
      setcontenten === '') {
      Swal.fire({
        title: 'Info!',
        text: 'Content bahasa indonesia dan bahasa inggris wajib di isi',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    } else {
      try {
        setLoading(true)
        const formData = new FormData();
        formData.append('id_category', data.id_category);
        formData.append('tags', JSON.stringify(data.tags));
        formData.append('active', data.active);
        formData.append('title', data.headlineIn);
        formData.append('titleen', data.headlineIn);
        formData.append('content', setcontenin);
        formData.append('contenten', setcontenten);
        if (data.picture[0]) {
          formData.append('picture', fileupload);
        }
        await axios.post(`${process.env.APP_API}halaman/insert`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }).then(() => {
          toast.success('Data berita berhasil ditambahkan')
          route.push('/halaman')
        })
      } catch (error) {
        console.error('Server responded with:', error.response.status);
        console.error('Response data:', error.response.data);
        Swal.fire({
          title: 'Info!',
          text: error.response.data,
          icon: 'error',
          confirmButtonText: 'OK'
        })

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
    route.push('/halaman');
  }
  return (
    <>
      <Headtitle title="Tambah Halaman" />

      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' fontSize={20} />
              {`Tambah Halaman`}</Typography>
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
                    name='headlineIn'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='text'
                        label='Headline Indonesia'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.headlineIn)}
                        placeholder='Headline Indonesia'
                        {...(errors.headlineIn && { helperText: errors.headlineIn.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='headlineEng'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='text'
                        label='Headline English'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.headlineEng)}
                        placeholder='Headline English'
                        {...(errors.headlineEng && { helperText: errors.headlineEng.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='active'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField select fullWidth label='Status Halaman :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.active)}
                        placeholder='Status Publish:'
                        {...(errors.active && { helperText: errors.active.message })}
                      >
                        <MenuItem key={`Y`} value={`Y`}>
                          {`Publish`}
                        </MenuItem>
                        <MenuItem key={`N`} value={`N`}>
                          {`Draf`}
                        </MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
              </Grid>
              <br />
              <Controller
                name='contentID'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Isi (Bahasa Indonesia)
                    <Editordata content={value} setContent={setContenin} />
                  </>
                )}
              />
              <br /><br />
              <Controller
                name='contentEN'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Isi (Bahasa Inggris)
                    <Editordata content={value} setContent={setContenEn} />
                  </>
                )}
              />

              <br />
              <br />
              <Controller
                name='picture'
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
                    }
                    }
                    error={Boolean(errors.gambar)}
                    placeholder='Gambar'
                    {...(errors.gambar && { helperText: errors.gambar.message })}
                  />
                )}
              />

              <br /><br />

              <img src={file} style={{
                'width': '50%'
              }} />


              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' sx={{ mr: 3, width: '50%' }}>
                  Save
                </Button>
                <Button variant='tonal' color='secondary' sx={{ mr: 3, width: '50%' }} onClick={handleClose}>
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
