// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'

// ** ThirdParty Components
import axios from 'axios'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import TableHeader from 'src/@core/components/TableHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Headtitle from 'src/@core/components/Headtitle'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import Grid from '@mui/material/Grid'
import Swal from 'sweetalert2'


const Index = () => {
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const onDeleteSuccess = () => {
    fetchTableData();
  };

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      setLoading(true)
      await axios
        .get(`${process.env.APP_API}slider/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }, {
          params: {
            value,
            sort,
            column
          }
        })
        .then(res => {
          setLoading(false)
          setTotal(res.data?.length)
          const values = q
          console.log(values.length, 'length data')
          if (values?.length > 0) {
            const queryLowered = values?.toLowerCase()
            const filterData = res.data.filter(slider => slider.title?.toLowerCase().includes(queryLowered) || slider.judul?.toLowerCase().includes(queryLowered))
            setRows(loadServerRows(paginationModel.page, filterData))
          } else {
            setRows(loadServerRows(paginationModel.page, res.data))
          }
        }).finally(() => {
          setLoading(false)
        }).catch((err) => {
          Swal.fire('error', err.message, 'error')
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

    const DeleteCat = ({ id, setLoading }) => {

      setLoading(true)
      axios.delete(`${process.env.APP_API}slider/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      },
      )
        .then(response => {
          toast.success('Data slider berhasil di hapus')
          // onDeleteSuccess()
          fetchTableData(sort, searchValue, sortColumn)

          setLoading(false)
        })
        .catch(error => {
          toast.error(`gagal di hapus ${error}`)
          // onDeleteSuccess()
          fetchTableData(sort, searchValue, sortColumn)

        });
    }

    const handleDelete = ({ id, setLoading }) => {
      DeleteCat({ id, setLoading })
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
            href={`/slider/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            href={`/slider/edit/${id}`}
            onClick={handleRowOptionsClose}
            sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:edit' fontSize={20} />
            {`Edit`}
          </MenuItem>
          <MenuItem onClick={() => handleDelete({ id, setLoading })}
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
      setSortColumn('title')
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }


  const handleFilter = useCallback(val => {
    setValue(val)
    fetchTableData()
  }, [])
  // console.log(rows, 'det')
  return (

    <>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={`${total}`}
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
            trend='negative'
            title='Slider Active'
            avatarColor='success'
            icon='tabler:user-check'
            subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats='19'
            trendDiff='-14'
            trend='negative'
            title='Slider Unactive  :' b avatarColor='success'
            icon='tabler:user-check'
            subtitle='Last week analytics'
          />
        </Grid>
      </Grid>

      <br />


      <Card>
        <Headtitle title={`Data slider`} />
        <CardHeader title={
          (<>
            <Icon fontSize='1.25rem' icon='tabler:news' />
            {`Slider`}
          </>)
        } />
        <TableHeader value={value} handleFilter={handleFilter} url={'/slider/create'} />

        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          columns=
          {

            [

              {
                flex: 0.25,
                field: 'title',
                headerName: 'Judul'
              },
              {
                flex: 0.125,
                field: 'link',
                headerName: 'Link',
                renderCell: ({ row }) => {
                  return (<img src={`https://www.mncsekuritas.id/${row.picture}`} style={{ width: '100%' }}

                    onError={(e) => {
                      e.target.src = '/logo_maza.png'; // Replace with your fallback image URL
                      e.target.style.width = '100%'; // Set width for the fallback image
                    }}
                  />)
                }
              },
              {
                flex: 0.25,
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
                field: 'created_at',
                headerName: 'created at',
                headerName: 'active',
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
                field: 'updated_at',
                headerName: 'Updated At',
                renderCell: ({ row }) => {
                  if (row.updated_at === null) {
                    return (<b>Kosong</b>)
                  } else {
                    return row.created_at
                  }
                }
              },
              {
                flex: 0.25,
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
                sortable: false,
                field: 'actions',
                headerName: 'Actions',
                renderCell: ({ row }) => <RowOptions id={row.id} setLoading={setLoading} />
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
          loading={loading}
        />

      </Card>

    </>
  )
}

export default Index
