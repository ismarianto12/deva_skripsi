// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import axios from 'axios'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import { Button, Divider, FormLabel } from '@mui/material'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardContent from '@mui/material/CardContent';
// import { CustomTextField, MenuItem } from 'src/@core/components/mui';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

// import   from 'src/@core/components/mui/text-field'
import Comheader from 'src/@core/components/Comheader';
import { getparamPend } from 'src/@core/utils/encp';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import CustomTextField from 'src/@core/components/mui/text-field'
import { StyledDataGridTable } from 'src/layouts/StyledDataGridTable';

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

const months = [
  { id: 1, name: 'Januari' },
  { id: 2, name: 'Februari' },
  { id: 3, name: 'Maret' },
  { id: 4, name: 'April' },
  { id: 5, name: 'Mei' },
  { id: 6, name: 'Juni' },
  { id: 7, name: 'Juli' },
  { id: 8, name: 'Agustus' },
  { id: 9, name: 'September' },
  { id: 10, name: 'Oktober' },
  { id: 11, name: 'November' },
  { id: 12, name: 'Desember' }
];

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


const datastatus = [
  {
    'id': '1', 'status': 'Diterima',

  },
  {
    'id': '2', 'status': 'Di tolak',
  }
]

const List = () => {
  // ** States
  const router = useRouter()
  const [total, setTotal] = useState(0)
  const [action, setAction] = useState('tambah')
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [jenisbarang, setJenisBarang] = useState([])
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [month, setMonth] = useState('')
  const [loading, setLoading] = useState(true)

  const [takademik, setTakademik] = useState('')
  const [status, setStatus] = useState('')
  const [jenjang, setJenjang] = useState('')

  const [tahunakademik, setTahunakademik] = useState([])

  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('full_name')
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, q, column, page) => {
      await axios
        .get(`${process.env.APP_API}logic/clustering/clusteresult`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
          params: {
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            q: q,
            sort: sort,
            column: column,
            month: month
          }
        })
        .then(res => {
          console.log(res.data.data, 'response server');
          setTotal(res.data.total)
          setRows(res.data.data)
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
      await axios.get(`${process.env.APP_API}master/jenis?q=&sort=asc&column=created_at`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      }).then((res) => {
        setJenisBarang(res.data.data)
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

  const filterByMonth = (e) => {
    console.log(e.target.value)
    setMonth(e.target.value)
    fetchTableData(sort, searchValue, sortColumn)
  }
  const RowOptions = ({ id, status }) => {
    // ** Hooks
    // const dispatch = useDispatch()
    // ** State
    // console.log(status, 'status barang')
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }
    const router = useRouter()
    const handleRowOptionsClose = (id, params) => {
      if (params === 'edit') {
        router.push(`/barang/edit/${id}`)
      } else if (params === 'view') {
        router.push(`/barang/edit/${id}`)
      } else if (params === 'confirm') {
        router.push(`/barang/confirm/${id}`)
      } else if (params === 'delete') {
        // router.push(`/barang/edit/${id}`)
      }
      setAnchorEl(null)
    }
    const Delete = async (id) => {
      await axios.post(`${process.env.APP_API}master/barang/delete/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      }).then((data) => {
        Swal.fire('success', `Success Delete Data`, 'success')
        fetchTableData(sort, searchValue, sortColumn)
      }).catch((errors) => {
        Swal.fire('info', `Gagal mendapatkan data ${errors}`, 'info')
      })
    }
    const handleDelete = () => {
      Delete(id)
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
          <MenuItem onClick={() => handleRowOptionsClose(id, 'confirm')} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:check' fontSize={20} />
            Detail
          </MenuItem>
        </Menu>
      </>
    )
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

  const kodebarang = [
    {
      id: "C1",
      name: 'BANYAK TERJUAL',

    },
    {
      id: "C2",
      name: 'SEDIKIT TERJUAL',

    },
    {
      id: "C3",
      name: 'TIDAK LARIS TERJUAL',
    }
  ]

  const customCellClassName = (params) => {
    console.log(params.value, 'get value')
    if (params.value == 'C1') {
      return 'text-right'
    } else if (params.value == 'C2') {
      return 'text-left'

    } else if (params.value == 'C3') {
      return 'text-center'

    }
    // return params.value === 'C1' ? 'text-center' : 'text-right';
  }
  return (
    <div data-aos="slide-left">
      <Head>
        <title>Hasil - Cluster</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats={rows.length}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='info'
            title='Total Barang'
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
            title='Total List'
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
            title='Total Sales'
            subtitle='Last week'
            avatarIcon='tabler:chart-bar'
          />
        </Grid>
      </Grid>
      <br /><br />
      <Card>
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
          <Grid container spacing={2}>
            {/* Left side with lg=3 */}
            <Grid item xs={12} lg={3}>
              <Typography variant='h5'>
                <Icon icon='tabler:calendar' />
                Periode Clustering
              </Typography>
            </Grid>

            {/* Middle side with lg=4 */}
            <Grid item xs={12} lg={4}>
              <Select
                value={month}
                size='small'
                sx={{
                  minWidth: '100%',
                }}
                onChange={(e) => filterByMonth(e)}
              >
                {months.map((monthsdata, i) => (
                  <MenuItem key={`Y-${i}`} value={i + 1}>
                    {monthsdata.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Right side with lg=4 */}
            <Grid item xs={12} lg={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <CustomTextField
                sx={{ marginLeft: 'auto', minWidth: 250 }} // Adjust margin and width as needed
                placeholder='Search Data'
                onChange={(e) => handleSearch(e.target.value)} // Assuming handleSearch is defined
              />
            </Grid>
          </Grid>

        </Box>
        <br />
        <StyledDataGridTable
          autoHeight
          pagination
          // rows={rows}
          rows={rows.map((item, index) => ({ id: index + 1, ...item }))}
          rowCount={total}
          columns={
            [
              {
                flex: 1,
                minWidth: 10,
                field: "id",
                headerName: 'No.',
                renderCell: ({ row }) => (
                  <Typography href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
                )
              },
              {
                flex: 1,
                minWidth: 30,
                field: 'hasil_cluster',
                // cellClassName: customCellClassName,
                headerName: 'Hasil Cluster',

              },
              {
                flex: 1,
                minWidth: 180,
                field: 'kd_barang',
                headerName: 'Kode Barang'
              },
              {
                flex: 1,
                minWidth: 280,
                field: 'nama_barang',
                headerName: 'Nama Barang'
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'keterangan',
                headerName: 'Keterangan',
                renderCell: ({ row }) => {
                  if (row.keterangan) {
                    return row.keterangan
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
          pageSizeOptions={[7, 10, 25, 50, 100, 'All']}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
          getRowId={(row) => row.id}
          slots={{
            toolbar: (props) => (
              <div style={{ marginBottom: '20px' }}>
                <GridToolbar {...props} />
              </div>
            ),
          }}
          onRowModesModelChange={mode => {
            console.log('lengthdata', mode)
          }}
          // onPaginationModelChange={setPaginationModel}
          onPaginationModelChange={newModel => {
            console.log(newModel, 'pagenya')
            setPaginationModel(newModel);
            // fetchTableData(sort, searchValue, sortColumn, newModel.page);
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
