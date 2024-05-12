// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// ** MUI Imports
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import { Button, Divider, FormLabel } from '@mui/material'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TableHeader from './Tableheader';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardContent from '@mui/material/CardContent';
import CustomTextField from 'src/@core/components/mui/text-field';
import Comheader from 'src/@core/components/Comheader';
import { getparamPend } from 'src/@core/utils/encp';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Search } from 'react-feather'
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

}

const statusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
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
const RowOptions = ({ id, status }) => {
  // ** Hooks
  // const dispatch = useDispatch()
  // ** State
  // console.log(status, 'status ppdb')
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)



  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const router = useRouter()

  const handleRowOptionsClose = (id, params) => {
    if (params === 'edit') {
      router.push(`/ppdb/edit/${id}`)
    } else if (params === 'view') {
      router.push(`/ppdb/edit/${id}`)
    } else if (params === 'confirm') {
      router.push(`/ppdb/confirm/${id}`)
    } else if (params === 'delete') {
      router.push(`/ppdb/edit/${id}`)

    }
    setAnchorEl(null)
  }

  const handleDelete = () => {
    // dispatch(deleteUser(id))
    handleRowOptionsClose(id, 'delete')
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          sx={{ '& svg': { mr: 2 } }}
          onClick={() => handleRowOptionsClose(id, 'view')}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={() => handleRowOptionsClose(id, 'confirm')} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:check' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem href={`/ppdb/edit/${id}`} onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const datastatus = [
  {
    'id': '1', 'status': 'Barang Masuk',

  },
  {
    'id': '2', 'status': 'Barang Keluar',
  }
]

const List = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [action, setAction] = useState('tambah')
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)

  const [takademik, setTakademik] = useState('')
  const [status, setStatus] = useState('')
  const [jenjang, setJenjang] = useState('')

  const [tahunakademik, setTahunakademik] = useState([])

  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('full_name')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, q, column,
      status,
      jenjang,) => {
      await axios
        .get(`${process.env.APP_API}master/barang`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
          params: {
            status,
            jenjang,
            q,
            sort,
            column,
          }
        })
        .then(res => {
          console.log(res.data.data, 'response server');
          setTotal(res.data.length)
          const search = q.toLowerCase()
          const filteredData = res.data.data
          // const filteredData = res.data.data.filter(galery => (
          //   galery.nama?.toLowerCase().includes(search) || galery.jenjang?.toLowerCase().includes(search)
          // ))
          setRows(loadServerRows(paginationModel.page, filteredData))
        }).finally(() => {
          setLoading(false)
        }).catch((err) => {
          console.log(err.response.data.msg, 'get data')
          toast.success(`Token Unactive ${err.response.data} Silahkan login`);
          Swal.fire('error', `${err.response.data.msg} : Sesi login berakhir Silahkan login kembali`, 'error')
        })
    },
    [paginationModel]
  )

  useEffect(() => {
    const calltahun = async () => {
      await axios.get(`${process.env.APP_API}tahunakademik/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      }).then((res) => {
        setTahunakademik(res.data)
      }).catch((err) => {
        console.log('gagal mengabil data tahun akademik', err)
      })
    }
    calltahun()
  }, [
    status,
    jenjang
  ])

  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn)
  }, [fetchTableData, searchValue, sort, sortColumn])
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const filterByjenjang = (e) => {
    console.log('filter bya je' + e.target.value)
    setJenjang(e.target.value)
    fetchTableData(sort, searchValue, sortColumn)
  }

  const filterByStatus = (e) => {
    // console.log(e.target.value, 'status')
    setStatus(e.target.value)
    fetchTableData(sort, searchValue, sortColumn, e.target.value, jenjang)
  }

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('title')
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const fhandleRoleChange = (e) => {
    const level = e.target.value

  }
  const caridata = () => {
    // setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }
  return (
    <div data-aos="slide-left">

      <Head>
        <title>Master - Barang</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats={rows.length}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='info'
            title='Total Barang Masuk'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats={rows.length}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='Total Barang Keluar'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats='1.28k'
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='Total List'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats='24.67k'
            chipText='+25.2%'
            avatarColor='info'
            chipColor='default'
            title='Total Purchasing'
            subtitle='Last week'
            avatarIcon='tabler:chart-bar'
          />
        </Grid>
      </Grid>
      <br /><br />
      <Card>

        <Divider sx={{ m: '0 !important' }} />
        {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
        <CardContent>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={4} paddingBottom={10} sx={{
              display: 'flex'
            }}>
              <Grid item xs={12} sm={3}>
                <FormLabel>Dari : </FormLabel>
                {/* <CustomTextField
                  value={value}
                  type="date"
                  sx={{
                    mr: 8, width: '100%'
                  }}
                  placeholder='Search Data'
                  onChange={(e) => handleFilter(e.target.value)}
                /> */}
                {/* <DatePicker defaultValue={dayjs('2022-04-17')} /> */}
                <DatePicker
                  className='form-control'
                  selected={null}
                  onChange={null}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                />


              </Grid>
              <Grid item xs={12} sm={3}>
                <FormLabel>Sampai : </FormLabel>
                {/* <CustomTextField

                  type="date"
                  value={value}
                  sx={{
                    mr: 8, width: '100%'
                  }}
                  placeholder='Search Data'
                  onChange={(e) => handleFilter(e.target.value)}
                /> */}

                {/* <DatePicker defaultValue={dayjs('2022-04-17')} /> */}
                <DatePicker
                  className='form-control'
                  selected={null}
                  onChange={null}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                />

              </Grid>
              <Grid item xs={12} sm={3}>

                <FormLabel>Status : </FormLabel>

                <CustomTextField
                  select
                  fullWidth
                  // value={role} // Ganti defaultValue dengan value
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterByStatus(e)
                  }}
                >
                  <MenuItem key={0} value={''}>
                    --Status--
                  </MenuItem>
                  {datastatus.map((lll) => (
                    <MenuItem key={lll.id} value={lll.id}>
                      {lll.status.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <br />
                <Button type='submit' variant='contained' sx={{
                  mr: 3,
                  width: '100%'
                }}
                  onClick={() => caridata()}
                >
                  <Search />
                  Cari
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography variant='h5' sx={{ mb: 0.5, ml: 7 }}>
            <Icon icon='tabler:files' fontSize='1.125rem' />
            Report Barang
          </Typography>
          {/* <Comheader
            value={searchValue}
            handleFilter={handleSearch}
            url={`/barang/create`}
          /> */}

          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Grid item xs={12} sm={6}>
              <Box sx={{ rowGap: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'right' }}>
                <CustomTextField
                  value={value}
                  sx={{ mr: 8 }}
                  placeholder='Search Data'
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Box>

            </Grid>
            <Grid item xs={12} sm={3}>

              &nbsp; &nbsp;
              <Button
                variant='contained'
                type="primary"
                sx={{ '& svg': { mr: 2 } }}
                onClick={() => {
                  const url = `/report/1/barang`
                  window.open(url, '_blank');
                }}
              >
                <Icon fontSize='1.125rem' icon='tabler:printer' />
                Print Report
              </Button>
            </Grid>
          </Box>
        </CardContent>

        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          columns={
            [
              {
                flex: 1,
                minWidth: 180,
                headerName: 'ID',
                renderCell: ({ row }) => (
                  <Typography href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
                )
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'created_at',
                headerName: 'Tgl & Jam'
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'nama_barang',
                headerName: 'Nama Barang'
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'harga',
                headerName: 'Harga'
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'jumlah_stok',
                headerName: 'Stoct',
                renderCell: ({ row }) => {
                  if (row.jumlah_stok) {
                    return row.jumlah_stok + '/Pcs'
                  } else {
                    return (<b>Kosong</b>)
                  }
                }
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'jenis_barang',
                headerName: 'Jenis Barang',
                renderCell: ({ row }) => {
                  if (row.jenis_barang) {
                    return row.jenis_barang
                  } else {
                    return (<b>Kosong</b>)
                  }
                }
              },
              {
                flex: 0.1,
                minWidth: 100,
                sortable: false,
                field: 'actions',
                headerName: 'Actions',
                renderCell: ({ row }) => <RowOptions id={row.id} setAction={setAction} />
              }
            ]
          }
          checkboxSelection
          sortingMode='server'
          paginationMode='server'
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
          // slots={{ toolbar: ServerSideToolbar }}
          // onPaginationModelChange={setPaginationModel}
          onPaginationModelChange={newModel => {
            setPaginationModel(newModel);
            fetchTableData(sort, searchValue, sortColumn, newModel.page);
          }}

          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'tonal'
            },
            toolbar: {
              value: searchValue,
              clearSearch: () => handleSearch(''),
              onChange: event => handleSearch(event.target.value)
            }
          }}
        />
      </Card >
    </div >
  )
}

export default List
