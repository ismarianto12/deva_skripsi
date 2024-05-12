// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

import axios from 'axios'

// ** Custom Table Components
// import TableHeader from 'src/views/apps/user/list/TableHeader'
// import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import UserCreate from '../create/UserCreate'
import { calluser, calluserEdit } from 'src/@core/utils/encp'
import UserEdit from '../edit/userEdit'
import Swal from 'sweetalert2'

const userRoleObj = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders client column
// ** MUI Imports

const Comheader = props => {
  // ** Props
  const route = useRouter()
  const { handleFilter, value,
    addUserOpen,
    setAddUserOpen, setAction } = props
  const updateAction = () => {
    setAddUserOpen(true)
    setAction('tambah')
  }
  return (
    <Box
      sx={{
        // py: 4,
        px: 6,
        rowGap: 2,
        // columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 10 }}
          placeholder='Search'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button variant='contained' sx={{ '& svg': { mr: 2 } }}
          onClick={() => updateAction()}
        >
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Tambah
        </Button>
      </Box>
    </Box>
  )
}


const renderClient = row => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}





const UserList = ({ apiData }) => {
  // ** State
  const [sortColumn, setSortColumn] = useState('level')
  const [action, setAction] = useState('tambah')
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('asc')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const [levelakses, setLevelakses] = useState([])
  const [id, setId] = useState('')
  const [editdata, setEditdata] = useState([])

  const fetchTableData = ({ sort, value, sortColumn }) => {

    dispatch(
      fetchData({
        role: role,
        q: value,
      })
    ).then(() => {
      setLoading(false)
    })
  }

  const RowOptions = ({ id, setAction }) => {
    // ** Hooks
    const dispatch = useDispatch()

    // ** State
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleDelete = () => {

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteUser(id))
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
      handleRowOptionsClose()
    }
    const editUser = (id) => {

      console.log(id, 'detail passing id')
      setId(id)
      calluserEdit({ setEditdata, id })
      setAddUserOpen(true)
      setAction('edit')
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
            onClick={() => editUser(id)}
          >
            <Icon icon='tabler:eye' fontSize={20} />
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

  const columns = [
    {
      flex: 0.2,
      field: 'id',
      minWidth: 100,
      headerName: 'ID',
      renderCell: ({ row }) => (
        <Typography href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 280,
      field: 'username',
      headerName: 'User',
      renderCell: ({ row }) => {
        const { fullName, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {fullName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.15,
      field: 'nama_lengkap',
      minWidth: 170,
      headerName: 'Nama Lengkap',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.nama_lengkap}
            </Typography>
          </Box>
        )
      }
    },

    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Email',
      field: 'email',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.email}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'blokir',
      headerName: 'Status',
      renderCell: ({ row }) => {
        if (row.blokir === 'Y') {
          return (<b>Active</b>)
        } else {
          return (<b style={{ 'color': 'red' }}>Un Active</b>)

        }
      }
    },
    {
      flex: 0.25,
      field: 'create_at',
      headerName: 'created at',
      renderCell: ({ row }) => {
        if (row.create_at) {
          return (<b>Kosong</b>)
        } else {
          return row.create_at ? row.create_at : 'Data kosong'
        }
      }

    },
    {
      flex: 0.25,
      field: 'update_at',
      headerName: 'udataed at',
      renderCell: ({ row }) => {
        if (row.updated_at === '') {
          return (<b>Kosong</b>)
        } else {
          return row.update_at
        }
      }

    },
    {
      flex: 0.25,
      field: 'user_id',
      headerName: 'User id',
      renderCell: ({ row }) => {
        if (row.user_id === '') {
          return (<b>Kosong</b>)
        } else {
          return row.user_id
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

  useEffect(() => {
    calluser({ setLevelakses })
    dispatch(
      fetchData({
        role: role,
        q: value,
      })
    ).then(() => {
      setLoading(false)
    })

  }, [dispatch, plan, role, status, value])

  const handleFilter = useCallback(val => {
    setLoading(true)
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target?.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])


  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const fhandleRoleChange = (e) => {
    setLoading(true)
    setRole(e.target.value)
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Master User dan Hak Akses' />
          <CardContent>
            <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>

              <Grid container spacing={5}>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    value={role} // Ganti defaultValue dengan value
                    SelectProps={{
                      displayEmpty: true,
                      onChange: e => fhandleRoleChange(e)
                    }}
                  >
                    <MenuItem key={0} value={null}>
                      --Semua data--
                    </MenuItem>
                    {levelakses.map((level) => (
                      <MenuItem key={level.id_level} value={level.id_level}>
                        {level.level}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Comheader addUserOpen={addUserOpen} setAddUserOpen={setAddUserOpen}
                    handleFilter={handleSearch} setAction={setAction}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <DataGrid
            autoHeight
            rowHeight={62}
            checkboxSelection
            loading={loading}
            rows={store.data ? store.data : []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      {
        action === 'edit' ?
          <UserEdit open={addUserOpen} toggle={toggleAddUserDrawer} editdata={editdata} />
          : <UserCreate open={addUserOpen} toggle={toggleAddUserDrawer} />

      }


    </Grid>
  )
}
export default UserList
