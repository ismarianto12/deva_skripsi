// ** React Imports
import { useEffect, useState, useCallback } from 'react'

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
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import Grid from '@mui/material/Grid'



const Index = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('topic')
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
        .get(`${process.env.APP_API}jadwal/list`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },

        },
          {
            params: {
              q,
              sort,
              column
            }
          })
        .then(res => {
          console.log(res.data[0], 'response server')

          const search = q.toLowerCase()
          const filteredData = res.data.filter(jadwal => (
            jadwal.topic?.toLowerCase().includes(search) || jadwal.topic.toLowerCase().includes(search)
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
      axios.delete(`${process.env.APP_API}jadwal/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
        .then(response => {
          toast.success('Data Kategory Berhasil di hapus')
          // onDeleteSuccess()
          fetchTableData(sort, searchValue, sortColumn)
        })
        .catch(error => {
          toast.error(`gagal di hapus ${error}`)
          // onDeleteSuccess()
          fetchTableData(sort, searchValue, sortColumn)
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
            href={`/jadwal/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}

            onClick={handleRowOptionsClose}
            href={`/jadwal/edit/${id}`}
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

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('topic')
    }
  }
  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  return (

    <>


      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={`${total}`}
            trendDiff='-14'
            trend='negative'
            title='Total data'
            avatarColor='success'
            icon='tabler:user-check'
            subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats='19,860'
            trendDiff='-14'
            trend='negative'
            title='Jadwal active'
            avatarColor='success'
            icon='tabler:user-check'
            subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats='19,860'
            trendDiff='-14'
            trend='negative'
            title='Jadwal Expired'
            avatarColor='success'
            icon='tabler:user-check'
            subtitle='Last week analytics'
          />
        </Grid>


      </Grid>

      <br />
      <Card>
        <Headtitle title="Jadwal" />
        <CardHeader title={
          (<>
            <Icon fontSize='1.25rem' icon='tabler:news' />
            {`Jadwal Edukasi`}
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
          loading={loading}
          rowCount={total}
          columns={
            [
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
                minWidth: 290,
                field: 'topic',
                headerName: 'Topic',
                renderCell: ({ row }) => {
                  if (row.topic === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.topic
                  }
                }

              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'type_edukasi',
                headerName: 'Type Edukasi',
                renderCell: ({ row }) => {
                  if (row.type_edukasi === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.type_edukasi
                  }
                }
              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'created_at',
                headerName: 'Tanggal',
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
                field: 'create_at',
                headerName: 'created at '
              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'update_at',
                headerName: 'udataed at'
              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'user id',
                headerName: 'User id'
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
          // loading={loading}
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
    </>
  )
}

export default Index
