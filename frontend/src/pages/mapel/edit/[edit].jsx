// ** React Imports
import { useState, useEffect } from 'react'

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
  kode_mapel: yup.string().required(),
  nama: yup.string().required(),
  tingkat: yup.string().required(),

})
const defaultValues = {
  kode_mapel: '',
  nama: '',
  tingkat: '',
  kelas: '',
}
const Index = props => {
  // ** Props
  const route = useRouter();
  const { open, toggle } = props

  const [datatingkat, setDatatingkat] = useState([])
  const [datakelas, setDataKelas] = useState([])

  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const {
    reset,
    control,
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const callUnit = async (
      id, setData, reset
    ) => {
      await axios.get(`${process.env.APP_API}tingkat/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).then((data) => {
        setDatatingkat(data.data)
      }).catch((err) => {
        Swal.fire('error', 'gagal mengambil', 'error')
        // setData([])
      })
    }

    const callKelas = async (
      id, setData, reset
    ) => {
      await axios.get(`${process.env.APP_API}kelas/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).then((data) => {
        setDataKelas(data.data)
      }).catch((err) => {
        Swal.fire('error', 'gagal mengambil', 'error')
        // setData([])
      })
    }

    callUnit()
    callKelas()


  }, []);

  const onSubmit = data => {
    console.info(data, 'passig  data to server ..')
    const config = {
      method: 'post',
      url: `${process.env.APP_API}mapel/insert`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${localStorage.getItem('accessToken')}`
      },
      data: data
    }
    axios(config)
      .then((res) => {
        route.push('/mapel/list');
      })
      .catch((err) => {
        console.error(err)
      })
    reset()
  }
  const handleClose = () => {
    reset()
    route.push('/mapel/list');
  }


  return (
    <>
      <Headtitle title={`Tambah Mapel`} />
      <Card>
        <CardContent>
          <Header>
            <Typography variant='h5'>
              <Icon icon='tabler:edit' />
              Tambah Mata Pelajaran.</Typography>
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
              <div className="row">
                <div className="col-md-6">

                  <div className="form-group mb-4">
                    <label>Kode Mapel</label>
                    <input
                      type="text"
                      className={`form-control ${errors.kode_mapel ? 'is-invalid' : ''}`}
                      id="kode_mapel"
                      name="kode_mapel"
                      placeholder="Kode Mapel"
                      defaultValue=""
                      {...register('kode_mapel', { required: true })}
                    />
                    {errors.kode_mapel && <div className="invalid-feedback">This field is required.</div>}

                  </div>

                  <div className="form-group mb-4">
                    <label>Nama Mapel</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nama ? 'is-invalid' : ''}`}
                      id="nama"
                      name="Nama"
                      placeholder="Nama Mata Pelajaran"
                      defaultValue=""
                      {...register('nama', { required: true })}
                    />
                    {errors.nama && <div className="invalid-feedback">This field is required.</div>}
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="jk" className="col-form-label">Tingkat :</label>
                    <select
                      className={`form-control ${errors.tingkat ? 'is-invalid' : ''}`}
                      id="tingkat"
                      name="tingkat"
                      {...register('tingkat', { required: true })}
                    >
                      {
                        datatingkat.map(units => (
                          <option value={`${units.id}`}>{units.kode} {units.tingkat}</option>
                        ))

                      }

                    </select>
                    {errors.tingkat && <div className="invalid-feedback">Please select a gender.</div>}
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="jk" className="col-form-label">Kelas :</label>
                    <select
                      className={`form-control ${errors.kelas ? 'is-invalid' : ''}`}
                      id="kelas"
                      name="kelas"
                      {...register('kelas', { required: true })}
                    >
                      {
                        datakelas.map(kelasdata => (
                          <option value={`${kelasdata.id}`}>{kelasdata.kode} {kelasdata.tingkat}</option>
                        ))

                      }

                    </select>
                    {errors.tingkat && <div className="invalid-feedback">Please select a gender.</div>}
                  </div>


                </div>
                <div className="col-md-6">



                </div>

              </div>
              <div className="_stepbackgroundalkdmsaldkma exssubmitform pt-3 form-group mb-4 row" >
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn-block btn btn-success" style={{
                    'width': '40%', 'marginRight': '15px'
                  }}>Daftar</button>
                  <button type="reset" onClick={() => confirmbatal()} className="btn-block btn btn-danger" style={{
                    'width': '40%'
                  }}>Batal</button>
                </div>
              </div>
              {/* <Comodal handleClose={handleClose} show={show} setConfirm={setConfirm} /> */}
            </form>

          </Box>
        </CardContent>
      </Card >
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
