// ** React Imports
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
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
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import { getAlbum } from 'src/@core/utils/Masterdata'
import toast from 'react-hot-toast'
import Editordata from 'src/@core/components/Editordata'
import Preloading from 'src/@core/components/Preloading'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Icons from 'react-feather'

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
  // deskripsiId: yup.string().required(),
  // deskripsiEn: yup.string().required(),
  filethumnaild: yup.string().required(),
  imagepopup: yup.string().required(),
  filethumnaild: yup.string().required(),
  imagepopup: yup.string().required(),
  imageheader: yup.string().required(),
  document1: yup.string().required(),
  document2: yup.string().required(),
  linkvideo: yup.string().required(),
})


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
  const [data, setData] = useState([])

  const [filethumnaild, setParfilethumnaild] = useState('')
  const [imagepopup, setParimagepopup] = useState('')
  const [imageheader, setParimageheader] = useState('')
  const [document1, setPardocument1] = useState('')
  const [document2, setPardocument2] = useState('')
  const [deskripsiId, setDeskripsiId] = useState('')
  const [deskripsiEn, setDeskripsiEn] = useState('')
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false)
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const {

    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      titleID: data.titleId,
      titleEn: data?.titleEn,
      deskripsiId: data?.deskripsiId,
      deskripsiEn: data?.deskripsiEn,
      filethumnaild: data?.filethumnaild,
      imagepopup: data?.imagepopup,
      imageheader: data?.imageheader,
      document1: data?.document1,
      document2: data?.document2,
      linkvideo: data?.linkvideo
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    const call = async () => {
      await getAlbum({ album, setAlbum })
    }
    call()
    callEdit()
  }, []);

  const callEdit = () => {
    axios.get(`${process.env.APP_API}promo/edit/${props.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then((res) => {
      setDeskripsiId(res?.data?.deskripsiId)
      setDeskripsiEn(res?.data?.deskripsiEn)
      setLoading(false)
      setData(res.data)
      reset(res.data)

    }).catch((err) => {
      console.log('error data')
    })
  }
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

      await axios.post(`${process.env.APP_API}promo/update/${props.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data Promo berhasil update')
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
    setPlan('basic')
    setRole('subscriber')
    setValue('contact', Number(''))
    route.push('/promo/list');
  }

  return (
    <>
      <Headtitle title={'List Promo'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>

              <Icon icon='tabler:edit' />
              Edit Promo</Typography>
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
                        label='Judul Bahasa Indonesia'
                        onChange={onChange}
                        placeholder='Judul Bahasa Indonesia'
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
                        error={Boolean(errors.titleEn)}
                        {...(errors.titleEn && { helperText: errors.titleEn.message })}
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
                    <>
                      Deskripsi Promo (Bahasa Indonesia)
                      <Editordata content={deskripsiId} setContent={setDeskripsiEn} />
                    </>
                  )}
                />
              </Grid>
              <br /><br />
              <Grid item xs={12} sm={6}>
                <Controller
                  name='deskripsiEn'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      Deskripsi Promo (En)
                      <Editordata content={deskripsiEn} setContent={setDeskripsiEn} />
                    </>
                  )}
                />
              </Grid>
              <br />
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

                        // value={value}
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

                  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                      expandIcon={<>
                        <Icons.ArrowDown />
                      </>}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Gambar Thumnail
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {
                          data?.filethumnaild ? (<>
                            <img src={`${process.env.ASSETS_API}/public/promosi/filethumnaild/${data?.filethumnaild}`}
                              className='img-resposive' style={{ 'width': '40%' }} />
                          </>) : ''

                        }
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <br />



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

                        // value={value}
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
                  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                      expandIcon={<>
                        <Icons.ArrowDown />
                      </>}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Gambar Thumnail
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {
                          data?.imagepopup ? (<>
                            <img src={`${process.env.ASSETS_API}/public/promosi/imagepopup/${data?.imagepopup}`} className='' style={{ 'width': '40%' }} />
                          </>) : ''

                        }
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <br />



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
                        // value={value}
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

                  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                      expandIcon={<>
                        <Icons.ArrowDown />
                      </>}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Gambar Document 1
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {
                          data?.document1 ? (<>
                            <a href={`${process.env.ASSETS_API}/public/document1/${data?.document1}`} className='btn btn-primary' target='_blank'>Download File</a>

                          </>) : ''

                        }
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <br />
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
                        // value={value}
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
                  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                      expandIcon={<>
                        <Icons.ArrowDown />
                      </>}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Gambar Document 2
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {
                          data?.document2 ? (<>
                            <a href={`${process.env.ASSETS_API}/public/promo/document2/${data?.document2}`} className='btn btn-primary'>Download </a>

                          </>) : ''

                        }
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <br />
                </Grid>
              </Grid>
              <br />
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
                        // value={value}
                        sx={{ mb: 4 }}
                        label='Gambar Header'
                        onChange={(e) => {
                          onChange(e)
                          handleimageheader(e)

                        }}
                        placeholder='Gambar Header'
                        error={Boolean(errors.imageheader)}
                        {...(errors.imageheader && { helperText: errors.imageheader.message })}
                      />
                    )}
                  />
                  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                      expandIcon={<>
                        <Icons.ArrowDown />
                      </>}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Gambar Header 2
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {
                          data?.imageheader ? (<>
                            <img src={`${process.env.ASSETS_API}/public/promosi/imageheader/${data?.imageheader}`} className='' style={{
                              'width': '40%'
                            }} />
                          </>) : ''
                        }
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <br />


                </Grid>
              </Grid>




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
      </Card >
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
