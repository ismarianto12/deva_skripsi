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
import toast from 'react-hot-toast'
import FormLabel from '@mui/material/FormLabel'

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
  nama_biaya: yup.string().required(),
  nominal: yup.string().required(),
  // description: yup.string().required(),
  // tingkat: yup.string().required()
})
const defaultValues = {
  nama_biaya: '',
  nominal: '',
  tingkat: '',
  catatan: ''
}

const Index = props => {
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

  const onSubmit = async (data) => {
    await axios.post(`${process.env.APP_API}parameterbiaya/insert`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).then(() => {
      toast.success('Data berita berhasil ditambahkan')
      route.push('/parameterbiaya/list')
    })
    reset()
  }
  const handleClose = () => {
    reset()
    route.push('/parameterbiaya/list')
  }



  const Jenjang = [
    {
      'id': 1,
      'value': 'TKA',

    },
    {
      'id': 2,
      'value': 'TKB',
    },
    {
      'id': 3,
      'value': 'SD',

    }, {
      'id': 4,
      'value': 'MTSI',

    },
  ]

  const filterByjenjang = () => {

  }

  return (
    <>
      <Headtitle title={`Tambah Biaya`} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:money' />
              Parameter Biaya</Typography>
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
                    name='nama_biaya'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label=''
                        onChange={onChange}
                        placeholder='Nama Biaya'
                        error={Boolean(errors.title)}
                        {...(errors.title && { helperText: errors.title.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nominal'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label=''
                        onChange={onChange}
                        placeholder='Example : Nama Catatan'
                        error={Boolean(errors.url)}
                        {...(errors.url && { helperText: errors.url.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>


                <Grid item xs={12} sm={6}>
                  <FormLabel>Jenjang : </FormLabel>
                  <Controller
                    name='tingkat'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        SelectProps={{
                          displayEmpty: true,
                          onChange: e => filterByjenjang(e)
                        }}
                      >
                        <MenuItem key={0} value={''}>
                          --Semua data--
                        </MenuItem>
                        {Jenjang.map((level) => (
                          <MenuItem key={level.value} value={level.id}>
                            {level.value.toUpperCase()}
                          </MenuItem>
                        ))}
                      </CustomTextField>)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>

                  <Controller
                    name='catatan'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder='Catatan Tambahan ...'
                        sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
                        error={Boolean(errors.description)}
                        {...(errors.description && { helperText: errors.description.message })}
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
