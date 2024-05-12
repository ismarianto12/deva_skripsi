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
      <Headtitle title={`Tambah Pegawai`} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' />
              Tambah Pegawai</Typography>
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
                    name='id_fingerprint'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="ID FINGERPRINT"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.id_fingerprint)}
                        helperText={errors.id_fingerprint?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nik'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="NIK"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.nik)}
                        helperText={errors.nik?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nama'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="NAMA"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.nama)}
                        helperText={errors.nama?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='jk'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="JK"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.jk)}
                        helperText={errors.jk?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='ttl'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="Tempat Tanggal lahir"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.ttl)}
                        helperText={errors.ttl?.message}
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
                        sx={{ mb: 4 }}
                        label="EMAIL"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="PASSWORD"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='alamat'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="ALAMAT"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.alamat)}
                        helperText={errors.alamat?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='telp'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="TELP"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.telp)}
                        helperText={errors.telp?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='id_divisi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="ID DIVISI"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.id_divisi)}
                        helperText={errors.id_divisi?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='dept'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="DEPT"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.dept)}
                        helperText={errors.dept?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='intensif'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="INTENSIF"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.intensif)}
                        helperText={errors.intensif?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='jam_mengajar'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="JAM MENGAJAR"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.jam_mengajar)}
                        helperText={errors.jam_mengajar?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nominal_jam'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="NOMINAL JAM"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.nominal_jam)}
                        helperText={errors.nominal_jam?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='bpjs'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="BPJS"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.bpjs)}
                        helperText={errors.bpjs?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='koperasi'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="KOPERASI"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.koperasi)}
                        helperText={errors.koperasi?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='simpanan'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="SIMPANAN"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.simpanan)}
                        helperText={errors.simpanan?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='tabungan'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="TABUNGAN"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.tabungan)}
                        helperText={errors.tabungan?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='id_pend'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="ID PEND"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.id_pend)}
                        helperText={errors.id_pend?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='kode_reff'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="KODE REFF"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.kode_reff)}
                        helperText={errors.kode_reff?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='jumlah_reff'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="JUMLAH REFF"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.jumlah_reff)}
                        helperText={errors.jumlah_reff?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='role_id'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="ROLE ID"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.role_id)}
                        helperText={errors.role_id?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="STATUS"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.status)}
                        helperText={errors.status?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='date_created'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        sx={{ mb: 4 }}
                        label="DATE CREATED"
                        onChange={onChange}
                        placeholder="Field Required"
                        error={Boolean(errors.date_created)}
                        helperText={errors.date_created?.message}
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
