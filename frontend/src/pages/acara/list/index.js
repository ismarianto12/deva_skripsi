// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'
import axios from 'axios'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
//
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Headtitle from 'src/@core/components/Headtitle'
import TableHeader from 'src/@core/components/TableHeader'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Link from 'next/link'
import CardContent from '@mui/material/CardContent'
import CustomTextField from 'src/@core/components/mui/text-field'
import Comheader from 'src/@core/components/Comheader'
import Swal from 'sweetalert2'



const Award = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }
  const onDeleteSuccess = () => {
    fetchTableData();
  };
  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get(`${process.env.APP_API}award/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }, {
          params: {
            q,
            sort,
            column
          }
        })
        .then(res => {
          // console.log(res.data, 'response server')
          setTotal(res?.data?.length)
          const search = q.toLowerCase()
          const filteredData = res.data.filter(award => (
            award?.namapenghargaan?.toLowerCase().includes(search) || award?.kategori?.toLowerCase().includes(search)
          ))
          setRows(loadServerRows(paginationModel.page, filteredData))
        }).finally(() => {
          setLoading(false)
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
      setSortColumn('title')
    }
  }
  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }
  const RowOptions = ({ id, setLoading }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const DeleteCat = (id) => {
      axios.delete(`${process.env.APP_API}award/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
        .then(response => {
          Swal.fire('success', 'data berhasil menghapus data', 'success')
          fetchTableData(sort, searchValue, sortColumn)
        })
        .catch(error => {
          Swal.fire('error', 'gagal menghapus data' + error, 'error')
        }).finally(() => {
          setLoading(false)
        });
    }

    const handleDelete = (id) => {
      DeleteCat(id)
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
            href={`/award/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            href={`/award/edit/${id}`}
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
      <Headtitle title="Master Penghargaan" />
      <CardHeader title={
        (<>
          <Icon fontSize='1.25rem' icon='tabler:news' />
          {`Penghargaan`}
        </>)
      } />

      <Comheader
        value={searchValue}
        handleFilter={handleSearch}
        url={`/award/create`}
      />
      <DataGrid
        autoHeight
        pagination
        rows={rows}
        rowCount={total}
        columns={
          [
            {
              flex: 0.2,
              field: 'id',
              minWidth: 100,
              headerName: 'ID',
              renderCell: ({ row }) => (
                <Typography href={`/award/edit/${row.id}`}>{`#${row.id}`}</Typography>
              )
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'namapenghargaan',
              headerName: 'Title'
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'tahun',
              headerName: 'Tahun'
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'diberikanoleh',
              headerName: 'Di berikan Oleh',
              renderCell: ({ row }) => {
                if (row.diberikanoleh === null) {
                  return (<b>Kosong</b>)
                } else {
                  return row.diberikanoleh
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'create_at',
              headerName: 'created at ',
              renderCell: ({ row }) => {
                if (row.create_at === null) {
                  return (<b>Kosong</b>)
                } else {
                  return row.create_at
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'update_at',
              headerName: 'updataed at',
              renderCell: ({ row }) => {
                if (row.updated_at === null) {
                  return (<b>Kosong</b>)
                } else {
                  return row.update_at
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'user_id',
              headerName: 'User id',
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
              renderCell: ({ row }) => <RowOptions id={row.id} setLoading={setLoading} />
            }
          ]
        }
        loading={loading}
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


export default Award
