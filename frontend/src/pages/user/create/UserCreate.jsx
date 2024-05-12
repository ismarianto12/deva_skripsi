// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import axios from 'axios';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { calluser } from 'src/@core/utils/encp'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

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
  email: yup.string().email().required(),
  // contact: yup
  //   .number()
  //   .typeError('Contact Number field is required')
  //   .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
  //   .required(),
  nama_lengkap: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  nama_lengkap: '',
  username: '',
  email: '',
  user_level: ''
}

const UserCreate = props => {
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('')
  const [levelakses, setLevelakses] = useState([])
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

  // const
  useEffect(() => {
    calluser({ setLevelakses })
  }, []);
  const onSubmit = data => {
    axios.post(`${process.env.APP_API}user/insert/`, {
      email: data.email,
      nama_lengkap: data.nama_lengkap,
      user_level: data.user_level,
      username: data.username
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
    }).then((data) => {
      Swal.fire('Success', data, 'success')
    }).catch((err) => {
      Swal.fire('Error', err.data, 'error')
    })
    toggle()
    reset()
  }
  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    // setValue('contact', Number(''))
    toggle()
    reset()
  }


  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 600 } } }}
    >
      <Header>
        <Typography variant='h5'>Tambah User</Typography>
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
            name='nama_lengkap'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Nama Lengkap'
                onChange={onChange}
                placeholder='Example :Jhone Doe'
                error={Boolean(errors.nama_lengkap)}
                {...(errors.nama_lengkap && { helperText: errors.nama_lengkap.message })}
              />
            )}
          />
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
                placeholder='johndoe'
                error={Boolean(errors.username)}
                {...(errors.username && { helperText: errors.username.message })}
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
                type='email'
                label='Email'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.email)}
                placeholder='johndoe@email.com'
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />


          <Controller
            name='user_level'
            control={control}
            rules={{ required: true }}
            render={({ field, value }) => (
              <CustomTextField
                select
                fullWidth
                value={value}
                label='Level Akses :'
                id='form-layouts-tabs-select'
                sx={{ mb: 4 }}
                {...field} // Menggunakan field dari Controller untuk mengelola nilai dan perubahan
                error={Boolean(errors.user_level)}
                placeholder='Level Akses'
                {...(errors.user_level && { helperText: errors.user_level.message })}
              >
                {levelakses.map((level, i) => (
                  <MenuItem key={i} value={level.id_level}>
                    {level.level}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}
export default UserCreate
