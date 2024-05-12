import { useState, useEffect } from 'react'

import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
import CardHeader from '@mui/material/CardHeader'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import axios from 'axios'

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
  id_provinsi: yup.string().required(),
  nama_cabang: yup.string().required(),
  alamat1: yup.string().required(),
  alamat2: yup.string().required(),
  no_telp: yup.string().required(),
  email: yup.string().required(),
  latitude: yup.string().required(),
  longitude: yup.string().required(),
  tipe: yup.string().required(),
})

const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  const [cabangdata, setCabangdata] = useState([])
  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Hooks
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
    defaultValues: {
      id_provinsi: cabangdata.id_provinsi,
      nama_cabang: cabangdata.nama_cabang,
      alamat1: cabangdata?.alamat1,
      alamat2: cabangdata?.alamat2,
      no_telp: cabangdata?.no_telp,
      email: cabangdata?.email,
      latitude: cabangdata?.latitude,
      longitude: cabangdata?.longitude,
      tipe: cabangdata?.tipe
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    calledit()
  }, [])
  const calledit = () => {
    const config = {
      method: 'get',
      url: '/admin/api/cabang/' + props.id,
      headers: {
        'Content-Type': 'application/json',
        'token': '123'
      },
    }
    axios(config)
      .then((res) => {
        console.log(res.data[0].id_cabang, 's')
        setCabangdata(res.data[0])
        reset(res.data[0])
      })
      .catch((err) => {
        console.error(err);
      });
  }


  const onSubmit = data => {
    const config = {
      method: 'put',
      url: '/admin/api/cabang/' + props.id,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    }
    axios(config)
      .then((res) => {
        toast.success("Data cabang berhasil di edit")
        route.push('/cabang/list');
      })
      .catch((err) => {
        console.error(err);
      });
    reset()
  }
  const handleClose = () => {
    reset()
    route.push('/cabang/list');
  }

  return (
    <>
      <Headtitle title="Edit data cabang" />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' fontSize='1.125rem' />
              {`Edit Data Cabang`}</Typography>
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
                name='nama_cabang'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Nama Cabang'
                    onChange={onChange}
                    placeholder='Nama cabang'
                    error={Boolean(errors.nama_cabang)}
                    {...(errors.nama_cabang && { helperText: errors.nama_cabang.message })}
                  />
                )}
              />
              <Controller
                name='alamat1'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    minRows={4}
                    value={value}
                    onChange={onChange}
                    label='Alamat 1'
                    placeholder='Alamat ...'
                    sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                    error={Boolean(errors.alamat1)}
                    {...(errors.alamat1 && { helperText: errors.alamat1.message })}
                  />
                )}
              />
              <Controller
                name='alamat2'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    minRows={4}
                    value={value}
                    onChange={onChange}
                    label='Alamat 2'
                    placeholder='Alamat ...'
                    sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                    error={Boolean(errors.alamat2)}
                    {...(errors.alamat2 && { helperText: errors.alamat2.message })}
                  />
                )}
              />
              <Controller
                name='no_telp'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}

                    label='Telepone cabang'
                    onChange={onChange}
                    placeholder='Telepon cabang'
                    error={Boolean(errors.no_telp)}
                    {...(errors.no_telp && { helperText: errors.no_telp.message })}
                  />
                )}
              />
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label='Email cabang'
                    onChange={onChange}
                    placeholder='Email cabang'
                    error={Boolean(errors.email)}
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' sx={{
                  mr: 3,
                  width: '50%'

                }}>
                  Save
                </Button>
                <Button variant='tonal' color='secondary' sx={{
                  width: '50%'
                }} onClick={handleClose}>
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



export async function getServerSideProps(context) {
  const id = context.query.edit;
  return {
    props: {
      id
    },
  };
}


export default Index
