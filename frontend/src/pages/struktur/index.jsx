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
import Swal from 'sweetalert2'

import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import TableHeader from 'src/@core/components/TableHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Headtitle from 'src/@core/components/Headtitle'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import Grid from '@mui/material/Grid'


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
        .get(`${process.env.APP_API}struktur/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          params: {
            value,
            sort,
            column
          }
        })
        .then(res => {
          setLoading(false)
          setTotal(res.data.length)
          const queryLowered = value.toLowerCase()
          const filterData = res.data.filter(struktur => struktur.jabatan.toLowerCase().includes(queryLowered) || struktur.nama.toLowerCase().includes(queryLowered))
          setRows(loadServerRows(paginationModel.page, filterData))
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
          axios.delete(`${process.env.APP_API}struktur/destroy/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
            .then(response => {
              toast.success('Data Berita Berhasil di hapus')
              setLoading(false)
              fetchTableData(sort, searchValue, sortColumn)

            })
            .catch(error => {
              toast.error(`gagal di hapus ${error}`)
              setLoading(false)
              fetchTableData(sort, searchValue, sortColumn)

            });

        }
      })
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
            href={`/struktur/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            href={`/struktur/edit/${id}`}
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

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }


  const handleFilter = useCallback(val => {
    setValue(val)
    fetchTableData()
  }, [])
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
          // subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats='19,860'
            trendDiff='-14'
            trend='negative'
            title='Active'
            avatarColor='success'
            icon='tabler:user-check'
          // subtitle='Last week analytics'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats='19,860'
            trendDiff='-14'
            trend='positive'
            title='Suspense'
            avatarColor='success'
            icon='tabler:user-check'
          // subtitle='Last week analytics'
          />
        </Grid>
      </Grid>

      <br />


      <Card>
        <Headtitle title={`Master Struktur Perusahaan`} />
        <CardHeader title={
          (<>
            <Icon fontSize='1.25rem' icon='tabler:news' />
            {`Master Struktur Perusahaan`}

          </>)
        } />
        <TableHeader value={value} handleFilter={handleFilter} url={'/struktur/create'} />

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
                minWidth: 290,
                field: 'nama',
                headerName: 'Nama'
              },
              {
                flex: 0.25,
                minWidth: 290,
                field: 'jabatan',
                headerName: 'Jabatan',

              },
              {
                flex: 0.125,
                field: 'picture',
                minWidth: 100,
                headerName: 'Picture',
                renderCell: ({ row }) => {
                  return (<img src={`${process.env.ASSETS_API}struktur/${row.picture}`} style={{ width: '100%' }}

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
                  return <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={'Active'}
                    color={'success'}
                    sx={{ textTransform: 'capitalize' }}
                  />
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
