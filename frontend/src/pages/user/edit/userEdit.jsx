// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
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
  // company: yup.string().required(),
  // billing: yup.string().required(),
  // country: yup.string().required(),
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


const UserEdit = props => {

  const { open, toggle, id, editdata } = props
  console.log(editdata, 'edit data passing component')

  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('')
  const [levelakses, setLevelakses] = useState([])
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
      id_user: editdata.id_user,
      username: editdata.username,
      password: editdata.password,
      nama_lengkap: editdata.nama_lengkap,
      email: editdata.email,
      no_telp: editdata.no_telp,
      sector: editdata.sector,
      bio: editdata.bio,
      userpicture: editdata.userpicture,
      level: editdata.level,
      user_level: editdata.level,
      blokir: editdata.blokir,
      id_session: editdata.id_session,
      tgl_daftar: editdata.tgl_daftar,
      forget_key: editdata.forget_key,
      locktype: editdata.locktype,
      token: editdata.token,
      statuslogin: editdata.statuslogin
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset(editdata)
  })

  useEffect(() => {
    calluser({ setLevelakses })
  }, []);
  const onSubmit = data => {
    axios.post(`${process.env.APP_API}user/update/${editdata.id_user}`, {
      email: data.email,
      nama_lengkap: data.nama_lengkap,
      user_level: data.user_level,
      username: data.username
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
    }).then((data) => {
      Swal.fire('Success', 'Data berhasil di edit', 'success')
    }).catch((err) => {
      toast.error('Gagal Mengambil data  user ...' + err)
    })
    toggle()
    reset()
  }
  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    setValue('contact', Number(''))
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
        <Typography variant='h5'>Edit User {editdata.nama_lengkap} </Typography>
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
                error={Boolean(errors.fullName)}
                {...(errors.fullName && { helperText: errors.fullName.message })}
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
                value={editdata.level}
                select
                fullWidth
                label='Level Akses :'
                sx={{ mb: 4 }}
                id='form-layouts-tabs-select'
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

          {/* <Controller
            name='user_level'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='User level'
                onChange={onChange}
              >
                {
                  levelakses.map((level, i)
                    (<>
                      <MenuItem value={level.id_level}>{level.level}</MenuItem>
                    </>)
                  )
                }
              </CustomTextField>

            )}
          /> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Save
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
export default UserEdit
