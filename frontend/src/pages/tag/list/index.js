import { useEffect, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Swal from 'sweetalert2'
// impo

import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
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


const Index = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get('/admin/api/tag/all', {
          params: {
            q,
            sort,
            column
          }
        })
        .then(res => {
          const search = q.toLowerCase()
          const filteredData = res.data.filter(tags => (
            tags.tag_title?.toLowerCase().includes(search) || tags.tag_title?.toLowerCase().includes(search) || tags.tag_seo?.toLowerCase().includes(search)
          ))
          setTotal(filteredData.length)
          setRows(loadServerRows(paginationModel.page, filteredData))
        })
    },
    [paginationModel]
  )
  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn)
  }, [fetchTableData, searchValue, sort, sortColumn])

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('tag_title')
    }
  }
  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }


  const columns = [
    {
      flex: 0.2,
      field: 'id',
      minWidth: 100,
      headerName: 'ID',
      renderCell: ({ row }) => (
        <Typography href={`/tag/preview/${row.id}`}>{`#${row.id}`}</Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 290,
      field: 'tag_title',
      headerName: 'Title'
    },
    {
      flex: 0.25,
      minWidth: 290,
      field: 'active',
      headerName: 'active',
      renderCell: ({ row }) => {
        if (row.active === 'Y') {
          return (<b>Active</b>)
        } else {
          return 'Un Active'

        }
      }
    },
    {
      flex: 0.25,
      minWidth: 290,
      field: 'created_at',
      headerName: 'Created At',
      renderCell: ({ row }) => {
        if (row.created_at === null) {
          return (<b>Kosong</b>)
        } else {
          return row.created_at
        }
      }

    },
    {
      flex: 0.25,
      minWidth: 290,
      field: 'updated_at',
      headerName: 'Updated At',
      renderCell: ({ row }) => {
        if (row.updated_at === null) {
          return (<b>Kosong</b>)
        } else {
          return row.updated_at
        }
      }

    },
    {
      flex: 0.25,
      minWidth: 290,
      field: 'user_id',
      headerName: 'Created By',
      renderCell: ({ row }) => {
        if (row.user_id === null) {
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
      renderCell: ({ row }) => <RowOptions id={row.id} />
    }
  ]


  const RowOptions = ({ id }) => {
    // ** Hooks
    // const dispatch = useDispatch()

    // ** State
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
    const handleDelete = (id) => {
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
          axios.delete(`${process.env.APP_API}tags/destroy/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
            .then(response => {
              toast.success('Data tag Berhasil di hapus')
              fetchTableData(sort, searchValue, sortColumn)

            })
            .catch(error => {
              Swal.fire('error', `detai ${error}`, 'error')
              // onDeleteSuccess()
              fetchTableData(sort, searchValue, sortColumn)


            })
        }
      })
      handleRowOptionsClose()
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
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            href={`/tag/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            href={`/tag/edit/${id}`}
            onClick={handleRowOptionsClose}
            sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:edit' fontSize={20} />
            {`Edit`}
          </MenuItem>
          <MenuItem onClick={() => handleDelete(id)}
            sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:trash' fontSize={20} />
            {`Delete`}
          </MenuItem>
        </Menu>
      </>
    )
  }


  return (
    <Card>
      <Headtitle title="Master Tag Berita" />
      <CardHeader title={
        (<>
          <Icon fontSize='1.25rem' icon='tabler:news' />
          {`Master Tag Berita`}
        </>)
      } />
      <Comheader
        value={searchValue}
        handleFilter={handleSearch}
        url={`/tag/create`}
      />
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
        onPaginationModelChange={setPaginationModel}
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
  )
}

export default Index
