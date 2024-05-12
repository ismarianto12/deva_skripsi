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
  // tahun: yup.string().required(),
  // Semester: yup.string().required(),
  // active: yup.string().required()
})

const defaultValues = {
  tahun: '',
  Semester: '',
  active: ''
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
      formData.append('tahun', user_id)
      formData.append('Semester', data.semester)
      formData.append('active', data.active)
      await axios.post(`${process.env.APP_API}tahunakademik/insert/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }).then(() => {
        toast.success('Data akademik berhasil ditambahkan')
        route.push('/takademik/list')
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
    route.push('/takademik/list')
  }

  return (
    <>
      <Headtitle title={'Tambah data download'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:list' />
              Edit tahun akademik</Typography>
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
                    name='tahun'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Tahun'
                        onChange={onChange}
                        placeholder='Tahun'
                        error={Boolean(errors.tahun)}
                        {...(errors.tahun && { helperText: errors.tahun.message })}
                      />
                    )}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='semester'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField select fullWidth label='Semester :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.semester)}
                        placeholder='Semester'
                        {...(errors.semester && { helperText: errors.semester.message })}
                      >
                        {['Genap', 'Ganjil'].map((albums) => (
                          <MenuItem key={albums} value={albums}>
                            {albums.toUpperCase()}
                          </MenuItem>
                        ))}
                      </CustomTextField>
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
                      <CustomTextField select fullWidth label='Status :' id='form-layouts-tabs-select'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.active)}
                        placeholder='Kategory Donwload'
                        {...(errors.active && { helperText: errors.active.message })}
                      >
                        {['active', 'nonactive'].map((albums) => (
                          <MenuItem key={albums} value={albums}>
                            {albums.toUpperCase()}
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

