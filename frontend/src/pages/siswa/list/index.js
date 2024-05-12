// ** React Imports
import { useEffect, useState, useCallback } from 'react'

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
//
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import { Button, Divider } from '@mui/material'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TableHeader from './Tableheader';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import CrmSalesWithAreaChart from 'src/views/dashboards/crm/CrmSalesWithAreaChart'
// import CrmSessions from 'src/views/dashboards/crm/CrmSessions'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardContent from '@mui/material/CardContent';
import Swal from 'sweetalert2';

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

const Jenjang = [
  {
    'value': 'PAUD',

  },
  {
    'value': 'TK',

  }, {
    'value': 'SD',

  }, {
    'value': 'SMP',

  },
]

const statusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}


const Comheader = props => {
  // ** Props
  // const [use]
  const route = useRouter()
  const { handleFilter, value,
    addUserOpen,
    setAddUserOpen, setAction } = props
  const updateAction = () => {

    Swal.fire('Info', 'Untuk menambahkan siswa silahkan prose data dari ppdb yang aktif', 'success')
    // setAddUserOpen(true)
    // setAction('tambah')
  }
  return (
    <>
      <Grid item xs={12} sm={3}>

        <CustomTextField
          value={value}
          sx={{ mr: 10 }}
          placeholder='Search'
          onChange={e => handleFilter(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button variant='contained' sx={{ '& svg': { mr: 2 } }}
          onClick={() => updateAction()}
        >
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Tambah
        </Button>
      </Grid>
    </>


  )
}

const Siswa = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')

  const [filjenjang, , setJenjang] = useState('')
  const [filkelas, setFilkelas] = useState('')

  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('nama')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }
  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get(`${process.env.APP_API}siswa/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }, {
          params: {
            q,
            sort,
            column
          }
        })
        .then(res => {
          setTotal(res.data.length)
          const search = q.toLowerCase()
          const resdata = res.data[0]

          const filteredData = res.data.filter(galery => (
            galery.nama?.toLowerCase().includes(search) || galery.kelas?.toLowerCase().includes(search) || galery.Jenjang?.toLowerCase().includes(search)
          ))

          setRows(loadServerRows(paginationModel.page, filteredData))
        })
    },
    [paginationModel]
  )
  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn)
  }, [fetchTableData, searchValue, sort, sortColumn])
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('nik')
    }
  }


  const RowOptions = ({ id }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)



    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const router = useRouter()

    const handleRowOptionsClose = (id, params) => {
      if (params === 'edit') {
        router.push(`/siswa/edit/${id}`)
      } else if (params === 'view') {
        router.push(`/siswa/edit/${id}`)
      } else if (params === 'delete') {
        router.push(`/siswa/edit/${id}`)

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
            // component={Link}
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => handleRowOptionsClose(id, 'view')}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            View
          </MenuItem>
          <MenuItem onClick={() => handleRowOptionsClose(id, 'edit')} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:edit' fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem href={`/siswa/edit/${id}`} onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:trash' fontSize={20} />
            Delete
          </MenuItem>
        </Menu>
      </>
    )
  }


  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      renderCell: ({ row }) => (
        <Typography href={`/siswa/preview/${row.id}`}></Typography>
      )
    },
    {
      minWidth: 200,
      field: 'email',
      headerName: 'Email'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'nama',
      headerName: 'Nama',

    },
    {
      flex: 0.25,
      field: 'jk',
      minWidth: 200,
      headerName: 'Jk',
      renderCell: ({ row }) => {
        if (row.jk === 'P') {
          return "Perempuan"
        } else {
          return "Laki - laki"
        }
      }
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'kelas_id',
      headerName: 'Kelas'
    },
    {
      flex: 0.25,
      minWidth: 290,
      field: 'tingkat_id',
      headerName: 'Jenjang'
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions id={row.id} />
    }
  ]
  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }


  const fhandleRoleChange = (e) => {
    const level = e.target.value

  }

  const filterjenjang = (e) => {
    fetchTableData(sort, searchValue, sortColumn, filjenjang, filkelas)

  }
  return (
    <div data-aos="slide-left">

      <Head>
        <title>Master - Siswa</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            chipText={rows.length}
            avatarColor='success'
            title='Total Data Barang'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            avatarColor='success'
            title='Total Data Barang'

          />
        </Grid>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            avatarColor='success'
            title='Total Data Barang'

          />
        </Grid>
        <Grid item xs={6} sm={4} lg={3}>
          <CardStatsVertical
            avatarColor='success'
            title='Total Data Barang'

          />
        </Grid>
      </Grid>
      <br /><br />
      <Card>
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={4} paddingBottom={10}>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  select
                  fullWidth
                  // value={role} // Ganti defaultValue dengan value
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterjenjang(e)
                  }}
                >
                  <MenuItem key={0} value={null}>
                    --Semua data--
                  </MenuItem>
                  {Jenjang.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.value.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={3}>
                <CustomTextField
                  select
                  fullWidth
                  // value={role} // Ganti defaultValue dengan value
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterjenjang(e)
                  }}
                >
                  <MenuItem key={0} value={null}>
                    --Kelas--
                  </MenuItem>
                  {Jenjang.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.value.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Comheader addUserOpen={null} setAddUserOpen={null}
                handleFilter={handleSearch} setAction={null}
              />
            </Grid>

          </Box>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          columns={columns}
          checkboxSelection
          sortingMode='server'
          paginationMode='server'
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
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
      </Card>
    </div>
  )
}

export default Siswa
