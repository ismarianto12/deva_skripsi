import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { getUserlogin } from 'src/@core/utils/encp'
import Icon from 'src/@core/components/icon'
import { Card, CardContent } from '@mui/material'
import Headtitle from 'src/@core/components/Headtitle'
import { getAlbum } from 'src/@core/utils/getcategory'
import axios from 'axios'
import toast from 'react-hot-toast'
import Editordata from 'src/@core/components/Editordata'
import Swal from 'sweetalert2'
import Action from 'src/@core/utils/action'

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
  gambar1: yup.string().required("Gambar 1 Harap di upload"),
  gambar2: yup.string().required("Gambar 2 Harap di upload")

})
const defaultValues = {
  deskripsiId: '',
  deskripsiEn: '',
  title: '',
  id_album: "",
  gambar: '',
}
const Index = props => {
  const route = useRouter();
  const { open, toggle } = props
  const [album, setAlbum] = useState([]);
  const [fileupload, setFileupload] = useState('')
  const [file, setFile] = useState('')
  const [deskripsiEn, setDeskripsiEn] = useState('')
  const [deskripsiId, setDeskripsiId] = useState('')
  const [editdata, setEditData] = useState([])


  const [fileupload1, setFileupload1] = useState('');
  const [fileupload2, setFileupload2] = useState('');
  const [fileupload3, setFileupload3] = useState('');
  const [fileupload4, setFileupload4] = useState('');
  const [fileupload5, setFileupload5] = useState('');
  const [fileupload6, setFileupload6] = useState('');
  const [fileupload7, setFileupload7] = useState('');
  const [fileupload8, setFileupload8] = useState('');
  const [fileupload9, setFileupload9] = useState('');
  const [fileupload10, setFileupload10] = useState('');


  const [file1, setFile1] = useState('');
  const [file2, setFile2] = useState('');
  const [file3, setFile3] = useState('');
  const [file4, setFile4] = useState('');
  const [file5, setFile5] = useState('');
  const [file6, setFile6] = useState('');
  const [file7, setFile7] = useState('');
  const [file8, setFile8] = useState('');
  const [file9, setFile9] = useState('');
  const [file10, setFile10] = useState('');

  const {
    reset,
    control,
    setValue,
    setError,
    trigger,
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
    const id = props.id
    Action().callEditGalery({
      setDeskripsiEn,
      setDeskripsiId,
      setEditData,
      setFile1,
      setFile2,
      setFile3,
      setFile4,
      setFile5,
      setFile6,
      setFile7,
      setFile8,
      setFile9,
      setFile10,
      id,
      reset,
    })
    call();
  }, [])
  const onSubmit = async (data) => {

    Swal.fire('Saving data please wait')
    Swal.showLoading();

    const formData = new FormData();
    const user_id = getUserlogin('id')
    const level = getUserlogin('role')

    formData.append('title', data.title)
    formData.append('deskripsiId', deskripsiId)
    formData.append('deskripsiEn', deskripsiEn)
    formData.append('id_album', data.id_album)
    formData.append('user_id', user_id)
    formData.append('level', level)

    formData.append("fileupload[]", fileupload1)
    formData.append("fileupload[]", fileupload2)
    formData.append("fileupload[]", fileupload3)
    formData.append("fileupload[]", fileupload4)
    formData.append("fileupload[]", fileupload5)
    formData.append("fileupload[]", fileupload6)
    formData.append("fileupload[]", fileupload7)
    formData.append("fileupload[]", fileupload8)
    formData.append("fileupload[]", fileupload9)
    formData.append("fileupload[]", fileupload10)


    await axios.post(`${process.env.APP_API}galery/update/${props.id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).then((res) => {
      Swal.fire('succes', 'data berhasil update', 'success');
      route.push('/galery/list')
    }).catch((emp) => {
      Swal.fire('error', emp, 'error');
    })
  }
  const uploadFile1 = (e) => {
    trigger('file')
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile1(URL.createObjectURL(e.target.files[0]));
      setFileupload1(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }

  const uploadFile2 = (e) => {
    trigger('file')

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile2(URL.createObjectURL(e.target.files[0]));
      setFileupload2(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }

  const uploadFile3 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile3(URL.createObjectURL(e.target.files[0]));
      setFileupload3(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const uploadFile4 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile4(URL.createObjectURL(e.target.files[0]));
      setFileupload4(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const uploadFile5 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile5(URL.createObjectURL(e.target.files[0]));
      setFileupload5(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const uploadFile6 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile6(URL.createObjectURL(e.target.files[0]));
      setFileupload6(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const uploadFile7 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile7(URL.createObjectURL(e.target.files[0]));
      setFileupload7(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const uploadFile8 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile8(URL.createObjectURL(e.target.files[0]));
      setFileupload8(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const uploadFile9 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile9(URL.createObjectURL(e.target.files[0]));
      setFileupload9(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }
  const uploadFile10 = (e) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'bmp'];
    const fileExtension = e.target.files[0]?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setFile10(URL.createObjectURL(e.target.files[0]));
      setFileupload10(e.target.files[0])
    } else {
      toast.error("Erro silahkan koreksi , File yang di izinkan adalah png jpg dan bmp")
    }
  }


  const handleClose = () => {
    route.push('/galery/list');
  }

  console.log(file1, 'passing file image 1')

  return (
    <div data-aos="slide-left">

      <Headtitle title={'List galery'} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>

              <Icon icon='tabler:edit' />
              Edit Galery</Typography>
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
                    label='Judul Galery'
                    onChange={onChange}
                    placeholder='Judul Galery'
                    error={Boolean(errors.title)}
                    {...(errors.title && { helperText: errors.title.message })}
                  />
                )}
              />
              <br /><br /><br />

              <Controller
                name='deskripsiId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <span style={{ 'fontWeight': 'bold' }}>Deskripsi (Bahasa Indonesia)</span>
                    <Editordata content={deskripsiId} setContent={setDeskripsiId} />
                  </>
                )}
              />
              <br /><br />
              <Controller
                name='deskripsiEn'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <span style={{ 'fontWeight': 'bold' }}>Deskripsi (Bahasa Indonesia)</span>
                    <Editordata content={deskripsiEn} setContent={setDeskripsiEn} />
                  </>

                )}
              />
              <br /><br />

              <Controller
                name='id_album'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField select fullWidth label='Pilih Album :' id='form-layouts-tabs-select'
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.id_album)}
                    placeholder='Album'
                    {...(errors.id_album && { helperText: errors.id_album.message })}
                  >
                    {album.map((albums) => (
                      <MenuItem key={albums.id} value={albums.title}>
                        {albums.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
              <br /><br />
              <br />
              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar1'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile1(e)
                        }}
                        error={Boolean(errors.gambar1)}
                        placeholder='Gambar'
                        {...(errors.gambar1 && { helperText: errors.gambar1.message })}
                      />
                    )}
                  />
                  <img src={file1} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar2'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile2(e)
                        }}
                        error={Boolean(errors.gambar2)}
                        placeholder='Gambar'
                        {...(errors.gambar2 && { helperText: errors.gambar2.message })}
                      />
                    )}
                  />
                  <img src={file2} style={{
                    'width': '50%'
                  }}
                    onError={(e) => {
                      e.target.src = '/admin/404.png';
                      e.target.style.width = '100%';
                    }}

                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar3'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile3(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                  <img src={file3} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar4'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile4(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                  <img src={file4} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar5'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile5(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  /> <img src={file5} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar6'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile6(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                  <img src={file6} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar7'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile7(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                  <img src={file7} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar8'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile8(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                  <img src={file8} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar9'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile9(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                  <img src={file9} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='gambar10'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type='file'
                        label='Gambar'
                        value={value}
                        sx={{ mb: 4 }}
                        onChange={(e) => {
                          onChange(e)
                          uploadFile10(e)
                        }}
                        error={Boolean(errors.gambar)}
                        placeholder='Gambar'
                        {...(errors.gambar && { helperText: errors.gambar.message })}
                      />
                    )}
                  />
                  <img src={file10} style={{
                    'width': '50%'
                  }} onError={(e) => {
                    e.target.src = '/admin/404.png';
                    e.target.style.width = '100%';
                  }} />
                </Grid>
              </Grid>
              <br /><br />
              <br /> <br />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' color='success' sx={{ mr: 3, 'width': '50%' }}><Icon icon='tabler:device-floppy' />
                  Save
                </Button>
                <Button variant='tonal' color='warning' onClick={handleClose} sx={{ mr: 3, 'width': '50%' }}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

export default Index

export async function getServerSideProps(context) {
  const id = context.query.index;
  return {
    props: {
      id
    },
  };
}
