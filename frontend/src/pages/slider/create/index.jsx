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
import { getUserlogin } from 'src/@core/utils/encp'


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
  // judul: yup.string().required(),
  // title: yup.string().required(),
  // link: yup.string().required(),
  // image: yup.string().required(),
  // created_at: yup.string().required(),
  // updated_at: yup.string().required(),
})
const defaultValues = {
  judul: '',
  title: '',
  link: '',
  image: '',
  created_at: '',
  updated_at: ''
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
    if (data.gambar === '') {
      Swal.fire({
        title: 'Info!',
        text: 'Thumnail wajib di upload',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    } else {
      try {
        setLoading(true)
        const formData = new FormData()
        formData.append('id_category', data.title)
        formData.append('tags', data.link)
        formData.append('titlen', data.titlen)
        formData.append('judul', data.titlen)
        formData.append('active', data.active)
        formData.append('link', data.link)
        formData.append('user_id', getUserlogin('id'))

        if (fileupload) {
          formData.append('gambar', fileupload);
        }
        await axios.post(`${process.env.APP_API}slider/insert`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }).then(() => {
          toast.success('Data slider berhasil ditambahkan')
          route.push('/slider/list')
        })
      } catch (error) {
        setLoading(false)
        Swal.fire({
          title: 'Info!',
          text: error,
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
    route.push('/slider/list');
  }
  return (
    <>
      <Headtitle title="Tambah Slider" />

      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:create' fontSize={20} />
              {`Tambah Slider`}</Typography>
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
                    name='judul'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='text'
                        label='Judul (Bahasa Indonesia)'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.headlineIn)}
                        placeholder='Judul (Bahasa Indonesia)'
                        {...(errors.headlineIn && { helperText: errors.headlineIn.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='titlen'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='text'
                        label='Judul dalam (Bahasa Inggris)'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.titlen)}
                        placeholder='Judul Dalam Bahasa Inggris'
                        {...(errors.titlen && { helperText: errors.titlen.message })}
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
                      <CustomTextField select fullWidth label='Status Slider :' id='form-layouts-tabs-select'
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
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange
                          uploadFile(e)
                        }
                        }
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='link'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        type='text'
                        label='Link Source :'
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.link)}
                        placeholder='Link Source (https://example.com)'
                        {...(errors.link && { helperText: errors.link.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <br />
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
