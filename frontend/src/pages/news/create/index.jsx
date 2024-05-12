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
import draftToHtml from "draftjs-to-html"
import toast from 'react-hot-toast'
import Preloading from 'src/@core/components/Preloading'
import Editordata from 'src/@core/components/Editordata'
import Swal from 'sweetalert2'
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
  // id_category: yup.string().required(),
  title: yup.string().typeError('Judul Dalam Bahasa Inggris Wajib di isi').required(),
  judul: yup.string().typeError('Judul Wajib di isi').required(),
  // content: yup.string().required(),
  // isi: yup.string().required(),
  // tags: yup.string().required(),
  // publish: yup.string().required(),
  picture: yup.string().required(),
})

const defaultValues = {
  id_category: '',
  title: '',
  judul: '',
  content: '',
  isi: '',
  tags: '',
  publish: '',
  picture: '',
}

const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [data, setData] = useState([])
  const [tagdata, setTagdata] = useState([])
  const [loading, setLoading] = useState(true)

  const [fileupload, setFileupload] = useState('')
  const [contenin, setContentIn] = useState('')
  const [contening, setContentIng] = useState('')
  const [file, setFile] = useState('')
  const [category, setCategory] = useState('')
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

    setLoading(false);

  }, []);

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const onSubmit = async (data) => {

    if (contenin === '' && contening === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Silahkan isi konten berita dalam bahasa inggris dan indonesia',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    } else if (data.picture === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Gambar wajib di upload',
        icon: 'error',
        confirmButtonText: 'Cool'
      })

    } else {
      try {
        setLoading(true)

        const formData = new FormData()
        const user_id = getUserlogin('id')
        const level = getUserlogin('role')
        formData.append('id_category', data.id_category);
        formData.append('judul', data.judul);
        formData.append('title', data.title);
        formData.append('isi', contenin);
        formData.append('content', contening);
        formData.append('tags', JSON.stringify(data.tags));
        formData.append('publish', data.active)
        formData.append('id_user', user_id)
        formData.append('level_id', level)

        if (data.picture[0]) {
          formData.append('picture', fileupload);
        }
        await axios.post(`${process.env.APP_API}artikel/insert`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }).then(() => {
          toast.success('Data berita berhasil ditambahkan')
          route.push('/news')
        })
      } catch (error) {
        setLoading(false)
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

  const uploadFile = async (e) => {
    const valid = await trigger("file");


    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'pdf', 'word', 'ppt'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setFileupload(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const handleClose = () => {
    route.push('/news');
  }
  return (
    <div>
      <Headtitle title="Tambah Berita" />

      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' fontSize={20} />
              {`Tambah Berita`}</Typography>
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
                        label='Judul (Indonesia)'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={
                          onChange
                        }
                        error={Boolean(errors.judul)}
                        placeholder='Headline Indonesia'
                        {...(errors.judul && { helperText: errors.judul.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='title'
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
                        {...(errors.title && { helperText: errors.title.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='tags'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        isOptionEqualToValue={(option, value) => option.id === value.id}

                        multiple
                        limitTags={2}
                        value={value || []}
                        options={tagdata ? tagdata : []}
                        defaultValues={0}
                        // isOptionEqualToValue={value}
                        id='autocomplete-limit-tags'
                        getOptionLabel={option => option?.tag_title || ''}
                        onChange={(e, newValue) => {
                          onChange(newValue); // Update the field value with the new array of selected tags
                        }}
                        renderInput={params => <CustomTextField {...params} label='Tag Berita' placeholder='Tag Berita' />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='publish'
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

              <br />


              <Controller
                name='isi'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Isi (Bahasa Indonesia)
                    <Editordata content={value} setContent={setContentIn} />
                  </>
                )}
              />

              <br /><br /><br />

              <br />
              <Controller
                name='content'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Isi (Bahasa Inggris)
                    <Editordata content={value} setContent={setContentIng} />
                  </>
                )}
              />
              <br />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='picture'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label={category === 35 ? `Gambar` : `Document PDF:`}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile(e)
                        }
                        }
                        error={Boolean(errors.picture)}
                        placeholder='Gambar'
                        {...(errors.picture && { helperText: errors.picture.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='id_category'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField select fullWidth label='Kategory Berita :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={(e) => {
                          console.log(e.target.value)

                          onChange(e),
                            setCategory(e.target.value)
                        }
                        }
                        error={Boolean(errors.id_category)}
                        placeholder='Category'
                        {...(errors.id_category && { helperText: errors.id_category.message })}
                      >
                        {data.map((category) => (
                          <MenuItem key={category.id_category} value={category.id_category}>
                            {category.title}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>
              </Grid>
              <br /><br />

              <img src={file} style={{
                'width': '50%'
              }} />


              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' color='success' sx={{ mr: 3, width: '50%' }}>
                  <Icon icon='tabler:device-floppy' />Save
                </Button>
                <Button variant='tonal' color='warning' sx={{ mr: 3, width: '50%' }} onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Card>
      <Preloading show={loading} />
    </div>
  )
}

export default Index
