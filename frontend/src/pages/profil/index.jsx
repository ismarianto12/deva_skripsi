// ** React Imports
import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import axios from 'axios'
import Headtitle from 'src/@core/components/Headtitle'
import { getAuthuser } from 'src/@core/utils/auth'
import toast from 'react-hot-toast'
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
  // username: yup.string().required(),
  password: yup.string().required(),
  password_ulang: yup.string().required(),
})
const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props
  const [userdata, setUserdata] = useState([])
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
      username: userdata?.username,
      email: userdata.email,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    const confirmusername = getUserlogin('username')
    const userid = getUserlogin('id')
    console.log(userid, 'detail userid')
    if (data.password !== data.password_ulang) {
      toast.error('Password tidak sama silahkan ulang.' + userid)
    } else {
      const config = {
        method: 'post',
        url: `${process.env.APP_API}user/update/${userid}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: {
          user_id: userid,
          username: confirmusername,
          password: data.password,
          email: data.email
        }
      }
      axios(config)
        .then(() => {
          toast.success("Berhasil update password")
        })
        .catch((err) => {
          toast.error(err)
        });
    }
  }
  const handleClose = () => {
    reset()
    route.push('/home');
  }

  useEffect(() => {
    const call = async () => {
      await getAuthuser({ userdata, setUserdata, reset })
    }
    call()
  }, [])

  return (
    <>
      <Headtitle title={`Tambah halaman`} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:users' />
              Update Password Users</Typography>
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
                    name='username'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label='Username'
                        onChange={onChange}
                        placeholder='Username'
                        InputProps={{
                          readOnly: true, // Add this line to make the input readonly
                        }}
                        error={Boolean(errors.title)}
                        {...(errors.title && { helperText: errors.title.message })}
                      />
                    )}
                  />

                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type="password"
                        value={value}
                        sx={{ mb: 4 }}
                        label='Password'
                        onChange={onChange}
                        placeholder='Password'
                        error={Boolean(errors.seotitle)}
                        {...(errors.seotitle && { helperText: errors.seotitle.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password_ulang'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        type="password"
                        sx={{ mb: 4 }}
                        label='Password'
                        onChange={onChange}
                        placeholder='Ulangi Password'
                        error={Boolean(errors.seotitle)}
                        {...(errors.seotitle && { helperText: errors.seotitle.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        type="email"
                        sx={{ mb: 4 }}
                        label='Email :'
                        onChange={onChange}
                        placeholder='Email'
                        error={Boolean(errors.seotitle)}
                        {...(errors.seotitle && { helperText: errors.seotitle.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                <Button type='submit' variant='contained' sx={{ mr: 10, width: '50%' }} >
                  Save
                </Button>
                <Button variant='tonal' color='secondary' sx={{ mr: 0, width: '50%' }} onClick={handleClose}>
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
