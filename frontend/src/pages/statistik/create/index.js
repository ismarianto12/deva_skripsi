// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
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

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import { Card, CardContent } from '@mui/material'
import axios from 'axios'
import Headtitle from 'src/@core/components/Headtitle'

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
  title: yup.string().required(),
  seotitle: yup.string().required(),
  active: yup.string().required(),

})
const defaultValues = {
  title: '',
  seotitle: '',
  active: '',
}
const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props

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

  const onSubmit = data => {
    const config = {
      method: 'post',
      url: '/admin/api/category/insert',
      headers: {
        'Content-Type': 'application/json',
        'token': '123'
      },
      data: data
    }
    axios(config)
      .then((res) => {
        route.push('/category/list');
      })
      .catch((err) => {
        console.error(err);
      });
    reset()
  }
  const handleClose = () => {
    reset()
    route.push('/category/list');
  }


  return (
    <>
      <Headtitle title={`Kategory Tambah`} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' />
              Create Categori</Typography>
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
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label=''
                    onChange={onChange}
                    placeholder='Judul'
                    error={Boolean(errors.title)}
                    {...(errors.title && { helperText: errors.title.message })}
                  />
                )}
              />
              <Controller
                name='seotitle'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    sx={{ mb: 4 }}
                    label=''
                    onChange={onChange}
                    placeholder='Seotitle'
                    error={Boolean(errors.seotitle)}
                    {...(errors.seotitle && { helperText: errors.seotitle.message })}
                  />
                )}
              />
              <Controller
                name='active'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (

                  <Grid item xs={12} sm={6}>
                    <CustomTextField select fullWidth id='form-layouts-tabs-select'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.active)}
                      placeholder='Active'
                      {...(errors.active && { helperText: errors.active.message })}
                    >
                      <MenuItem value='Y'>Active</MenuItem>
                      <MenuItem value='N'>Non active</MenuItem>
                    </CustomTextField>
                  </Grid>
                )}
              />
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
