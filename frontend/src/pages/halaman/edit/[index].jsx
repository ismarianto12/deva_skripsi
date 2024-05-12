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
import Editordata from 'src/@core/components/Editordata'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import Preloading from 'src/@core/components/Preloading'
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
  // id_category: yup.string().required(),
  // headline: yup.string().required(),
  // content: yup.string().required(),
  // contenten: yup.string().required()
  // content: yup.string().required(),
  // tag: yup.string().required(),
  // active: yup.string().required(),
  // headline: yup.string().required(),
  // picture: yup.string().required(),
})


const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [data, setData] = useState([])
  const [reqdata, setReqdata] = useState([])
  const [tagdata, setTagdata] = useState([])
  const [fileupload, setFileupload] = useState('')
  const [file, setFile] = useState('')
  const [setcontenin, setContenin] = useState('')
  const [setcontenten, setContenEn] = useState('')
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  useEffect(() => {
    const call = async () => {
      await getcategory({ data, setData })
    }
    const calltag = async () => {
      await getTag({
        tagdata,
        setTagdata
      })
    }
    call()
    calltag()
    callEdit()
  }, []);

  const callEdit = () => {
    setLoading(true)
    axios.get(`${process.env.APP_API}halaman/detail/${props.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then((res) => {
      setLoading(false)
      setContenin(res.data.content)
      setContenEn(res.data.contenten)
      setReqdata(res.data)
      reset(res.data)
    }).catch((err) => {
      setLoading(false)
      Swal.fire({
        title: 'Info!',
        text: 'Failed fetch data from server reason : ' + err,
        icon: 'error',
        confirmButtonText: 'OK'
      })
      console.log(err)
    })
  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      id_pages: "", // reqdata.id_pages,
      title: "", // reqdata.title,
      titleen: "",// reqdata.titleen ? reqdata.titleen : reqdata.title,
      content: "",// reqdata.content,
      contenten: "",// reqdata.contenten,
      seotitle: "", //reqdata.seotitle,
      tags: "",// reqdata.tags,
      active: "", //reqdata.active,
    },
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
        const formData = new FormData();
        const user_id = getUserlogin('id')
        const level = getUserlogin('id')

        formData.append('id_category', data.id_category);
        formData.append('tags', JSON.stringify(data.tags));
        formData.append('active', data.active);
        formData.append('title', data.title);
        formData.append('titleen', data.titleen);
        formData.append('content', setcontenin);
        formData.append('contenten', setcontenten);

        formData.append('user_id', user_id);
        formData.append('level', level);

        if (data.picture[0]) {
          formData.append('picture', fileupload);
        }
        await axios.post(`${process.env.APP_API}halaman/update/${props.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }).then(() => {
          toast.success('Data berita berhasil edit / updated')
          route.push('/halaman')
        })
      } catch (error) {
        Swal.fire({
          title: 'Info!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
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
    route.push('/halaman');
  }
  return (
    <>
      <Headtitle title="Edit Halaman" />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' fontSize={20} />
              {`Edit Halaman`}</Typography>
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
                    name='title'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='text'
                        label='Judul (Indonesia)'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.title)}
                        placeholder='Headline Indonesia'
                        {...(errors.title && { helperText: errors.title.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='titleen'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='text'
                        label='Judul (English)'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.title)}
                        placeholder='Headline English'
                        {...(errors.titleen && { helperText: errors.titleen.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='active'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField select fullWidth label='Status Publish :' id='form-layouts-tabs-select'
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
                    <Editordata content={setcontenin} setContent={setContenin} />
                  </>
                )}
              />

              <br /><br />

              <br />
              <Controller
                name='contentEN'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Isi (Bahasa Inggris)
                    <Editordata content={setcontenten} setContent={setContenEn} />
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

export async function getServerSideProps(context) {
  const id = context.query.index;
  return {
    props: {
      id
    },
  };
}


export default Index
