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
import { useTheme } from '@mui/material/styles'
import toast from 'react-hot-toast'
import Preloading from 'src/@core/components/Preloading'
import Editordata from 'src/@core/components/Editordata'
import { getUserlogin } from 'src/@core/utils/encp'


const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))
const schema = yup.object().shape({
  // id_category: yup.string().required(),
  title: yup.string().required("wajib diisi"),
  judul: yup.string().required("Wajib diisi"),
  // content: yup.string().required(),
  // isi: yup.string().required(),
  // tags: yup.string().required(),
  active: yup.string().required("Status Publish Wajib diisi"),
  // picture: yup.string().required(""),
})



const Index = props => {
  const route = useRouter();
  const theme = useTheme()
  const { open, toggle } = props
  const [data, setData] = useState([])
  const [tagdata, setTagdata] = useState([])
  const [loading, setLoading] = useState(true)

  const [fileupload, setFileupload] = useState('')
  const [contenin, setContentIn] = useState('')
  const [contening, setContentIng] = useState('')

  const [editdata, setEditdata] = useState([])
  const [fileimage, setFileimage] = useState('')

  const [file, setFile] = useState('')
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
    formState: { errors }
  } = useForm({
    defaultValues: {
      id_category: "",
      title: "",
      judul: "",
      content: "",
      isi: "",
      tags: "",  //editdata.tags === undefined ? [] : JSON.parse(JSON.stringify(editdata?.tags)),
      active: "", //'Y',
      picture: "" //editdata?.picture,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    callEdit()
  }, [])

  const callEdit = () => {
    axios.get(`${process.env.APP_API}artikel/edit/${props.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then((res) => {
      setEditdata(res.data)
      setFileimage(`${process.env.ASSETS_API}/files/${res?.data?.picture}`)
      setContentIng(res?.data?.content)
      setContentIn(res?.data?.isi)

      reset(res.data)

    }).catch((err) => {
      console.log(err)
    })
  }

  const onSubmit = async (data) => {
    try {


      setLoading(true)
      const formData = new FormData();

      const user_id = getUserlogin('id')
      const level = getUserlogin('role')

      formData.append('id_category', data.id_category);
      formData.append('judul', data.judul);
      formData.append('title', data.title);
      formData.append('isi', contenin);
      formData.append('content', contening);
      formData.append('tags', JSON.stringify(data.tags));
      formData.append('protect', data.protect);
      formData.append('_method', 'POST');
      formData.append('user_id', user_id);
      formData.append('level', level);



      if (data.picture[0]) {
        formData.append('picture', fileupload);
      }
      await axios.post(`${process.env.APP_API}artikel/update/${props.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data berita berhasil ubah', {
          style: {
            padding: '16px',
            color: theme.palette.primary.main,
            border: `1px solid ${theme.palette.primary.main}`
          },
          iconTheme: {
            primary: theme.palette.primary.main,
            secondary: theme.palette.primary.contrastText
          }
        })


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
  const uploadFile = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'pdf', 'word', 'ppt'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setFileupload(e.target.files[0])
    } else {
      toast.error("Error silahkan koreksi , File yang di izinkan adalah jpg, jpeg, png, bmp, pdf, word, ppt")
    }
  }
  const handleClose = () => {
    route.push('/news');
  }
  return (
    <div>

      <Headtitle title="Edit Berita" />

      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' fontSize={20} />
              {`Edit Berita`}</Typography>
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
              <Grid container spacing={5}>

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
              <Grid container spacing={5}>

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
                        defaultValues={tagdata ? tagdata : []}
                        options={tagdata ? tagdata : []}
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
                    name='active'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField select fullWidth label='Status Berita :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.active)}
                        placeholder='Status Publish:'
                        {...(errors.active && { helperText: errors.active.message })}
                      >
                        <MenuItem key={``} value={``}>
                          {`Status Publish`}
                        </MenuItem>
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
                    <Editordata content={contenin} setContent={setContentIn} />
                  </>
                )}
              />

              <Controller
                name='content'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    Isi (Bahasa Inggris)
                    <Editordata content={contening} setContent={setContentIng} />
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='id_category'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField select fullWidth label='Kategory Berita :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={onChange}
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

              <img src={file ? file : fileimage} style={{
                'width': '50%'
              }}
                onError={(e) => {
                  e.target.src = 'https://www.mncsekuritas.id/po-content/mnc/img/logo_new1.png?1'; // Replace with your fallback image URL
                  e.target.style.width = '100%'; // Set width for the fallback image
                }}

              />
              <br /><br />


              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' color='success' sx={{ mr: 3, width: '50%' }}>
                  Save
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

export async function getServerSideProps(context) {
  const id = context.query.edit;
  return {
    props: {
      id
    },
  };
}


export default Index




