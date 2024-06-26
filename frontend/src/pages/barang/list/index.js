// ** React Imports
import { useEffect, useState, useCallback } from 'react'
// import { makeStyles } from '@mui/styles';
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
import TableHeader from './Tableheader';
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#18a6db', // Grey background for headers
    color: '#fff', // Black text color for headers
    fontSize: '12px', // Smaller font size for compact appearance
    // padding: '2px 5px', // Compact padding for header cells
    borderLeft: '1px solid #d3d3d3'
  },
  '& .MuiDataGrid-cell': {
    // borderRadius: '10px 10px 10px',
    fontSize: '12px', // Smaller font size for cells
    padding: '2px 5px', // Compact padding for cells
    borderBottom: 'none', // Remove border-bottom from cells

  },
  '& .MuiDataGrid-row': {
    boxShadow: '0px 4px #ddd',
    borderTopLeftRadius: '10px', // Border radius for left edge
    borderTopRightRadius: '10px', // Border radius for right edge
    // borderRadius: '0px 10px 10px 10px',
    // padding: '10px 10px 10px',
    maxHeight: '40px !important', // Compact row height
    minHeight: '40px !important', // Compact row height
    border: 'none !importatant'
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none', // Hide the column separator icon for a cleaner look
  },
});

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
  const [idkategori, setIdkategori] = useState('')

  const [jenisbarang, setJenisBarang] = useState([])
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
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }



  const fetchTableData = useCallback(
    async (sort, q, column, page) => {
      await axios
        .get(`${process.env.APP_API}master/barang`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
          params: {
            page: paginationModel.page,
            q: q,
            idkategori: idkategori,
            sort: sort,
            column: column,
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

  const filterByjenjang = (e) => {
    console.log('filter bya je' + e.target.value)
    setJenjang(e.target.value)
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
          <MenuItem
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => handleRowOptionsClose(id, 'view')}
          >
            <Icon icon='tabler:edit' fontSize={20} />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:trash' fontSize={20} />
            Delete
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
      name: 'BANYAK TERJUAL'
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
  const defaultColumnOptions = {
    resizable: true,
    width: '100%'
  };


  return (
    <div data-aos="slide-left">

      <Head>
        <title>Master - Barang</title>
      </Head>

      <br /><br />
      <Card>

        <Divider sx={{ m: '0 !important' }} />
        {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
        <CardContent>
          {/* <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={4} paddingBottom={10} sx={{
              display: 'flex'
            }}>
              <Grid item xs={12} sm={3}>
                <FormLabel>Jenjang : </FormLabel>
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
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormLabel>Tahun Akademik : </FormLabel>

                <CustomTextField
                  select
                  fullWidth
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => setTakademik(e.target.value)
                  }}
                >
                  <MenuItem key={0} value={null}>
                    --Semua data--
                  </MenuItem>
                  {tahunakademik.map((takademik) => (
                    <MenuItem key={takademik.id} value={takademik.id}>
                      {takademik.tahun} - {takademik.Semester}
                    </MenuItem>
                  ))}
                </CustomTextField>
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
                  width: '50%'
                }}
                  onClick={() => caridata()}
                >
                  Cari
                </Button>
              </Grid>
            </Grid>

          </Box> */}
          <Typography variant='h5' sx={{ mb: 0.5 }}>
            <Icon icon='tabler:files' fontSize='1.125rem' />
            Master Barang
          </Typography>


          <Box
            sx={{
              py: 8,
              px: 0,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Grid item xs={12} sm={4}>
              <Box sx={{ rowGap: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'right' }}>
                <Button
                  variant='contained'
                  sx={{ '& svg': { mr: 1 } }}
                  onClick={() => router.push('/barang/create')}
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Tambah
                </Button>
                &nbsp;
                <CustomTextField
                  sx={{ mr: 8 }}
                  placeholder='Search Data'
                  onChange={(e) => handleSearch(e.target.value)}
                />

              </Box>
            </Grid>

            <Grid item xs={8} sm={8}>
              <CustomTextField
                sx={{
                  width: '100%'
                }}
                select
                value={idkategori}
                fullWidth
                label="Pilih Kategori Barang"
                name="kategori"
                SelectProps={{
                  displayEmpty: true,
                  onChange: e => { setIdkategori(e.target.value), fetchTableData(sort, searchValue, sortColumn) }
                }}
              >
                <MenuItem key={0} value={null}>
                  --Semua data--
                </MenuItem>
                {jenisbarang.map((jenisbarangs) => (
                  <MenuItem key={jenisbarangs.id} value={jenisbarangs.id}>
                    {jenisbarangs.id} - {jenisbarangs.jenis_barang}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Box>

        </CardContent>
        <StyledDataGrid
          autoHeight
          pagination
          rowHeight={40}
          // className={classes.root}
          // rows={rows}
          rows={rows.map((item, index) => ({ id: index + 1, ...item }))}
          rowCount={total}
          columns={
            defaultColumnOptions,
            [
              {
                flex: 1,
                maxWidth: 80,
                field: "id",
                headerName: 'No.',
                renderCell: ({ row }) => (
                  <Typography href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
                )
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
                minWidth: 80,
                field: 'stok_akhir',
                headerName: 'Stock',
                renderCell: ({ row }) => {
                  if (row.stok_akhir) {
                    return row.stok_akhir + '/Pcs'
                  } else {
                    return (<b>Kosong</b>)
                  }
                }
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'harga',
                headerName: 'Harga Satuan',
                renderCell: ({ row }) => {
                  if (row.harga) {
                    return 'Rp' + row.harga
                  } else {
                    return (<small>Kosong</small>)
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
          getRowId={(row) => row.id}
          slots={{
            toolbar: (props) => (
              <div style={{ marginBottom: '20px' }}>
                <GridToolbar {...props} />
              </div>
            ),
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
    </div>
  )

}


export default List
