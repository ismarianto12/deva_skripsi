// ** React Imports
import { useEffect, useState, useCallback } from 'react'
import Grid from '@mui/material/Grid'

// ** MUI Imports
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

import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

const RowOptions = ({ id, onDeleteSuccess }) => {
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
  const DeleteCat = (id) => {
    axios.delete(`${process.env.APP_API}guru/destroy/${id}`, {
      headers: {
        Authorization: `Bearer :${localStorage.getItem('accessToken')}`
      }
    })
      .then(e => {
        toast.success('Data Guru Berhasil di hapus')
        onDeleteSuccess()
      })
      .catch(error => {
        toast.error(`gagal di hapus ${error}`)
        onDeleteSuccess()
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
          href={`/promo/edit/${id}`}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          {`View`}
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleRowOptionsClose}
          href={`/promo/edit/${id}`}
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

const Index = () => {
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
        .get(`${process.env.APP_API}karyawan/list`, {
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
          console.log(res.data[0], 'response server')
          setTotal(res.data.length)


          // const
          const search = q.toLowerCase()
          const resdata = res.data[0]

          const filteredData = res.data.filter(galery => (
            galery.nama?.toLowerCase().includes(search) || galery.deskripsiId?.toLowerCase().includes(search) || galery.deskripsiEn?.toLowerCase().includes(search)
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

  return (
    <div data-aos="slide-left">

      <Headtitle title="List Data pegawai" />


      <br /><br />
      <Card>
        <CardHeader title={
          (<>
            <Icon fontSize='1.25rem' icon='tabler:list' />
            {`Data Karyawan`}
          </>)
        } />
        <Comheader
          value={searchValue}
          handleFilter={handleSearch}
        />
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          columns={
            [
              {
                flex: 0.25,
                minWidth: 290,
                field: 'nama',
                headerName: 'Nama',
                renderCell: ({ row }) => {
                  if (row.nama === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.nama
                  }
                }

              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'jk',
                headerName: 'Jenis Kelamin',
                renderCell: ({ row }) => {
                  if (row.jk === 'P') {
                    return (<b>Perempuan</b>)
                  } else {
                    return 'Laki - laki'
                  }
                }

              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'email',
                headerName: 'Email'

              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'create_at',
                headerName: 'created at ',
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
                field: 'update_at',
                headerName: 'udataed at',
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
                renderCell: ({ row }) => <RowOptions id={row.id} onDeleteSuccess={onDeleteSuccess} />
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
    </div>
  )
}

export default Index
