// ** React Imports
import { useEffect, useState, useCallback } from 'react'

import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'

import Comheader from 'src/@core/components/Comheader'
import axios from 'axios'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import TableHeader from 'src/@core/components/TableHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Headtitle from 'src/@core/components/Headtitle'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/page'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import Grid from '@mui/material/Grid'
import Swal from 'sweetalert2'
import { getUserlogin } from 'src/@core/utils/encp'
import Action from 'src/@core/utils/action'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'

const RowOptions = ({ id, onDeleteSuccess }) => {

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

        axios.delete(`${process.env.APP_API}artikel/destroy/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
          .then(response => {
            toast.success('Data Berita Berhasil di hapus')
            onDeleteSuccess()
          })
          .catch(error => {
            toast.error(`gagal di hapus ${error}`)
            onDeleteSuccess()

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
          vertical: 'bottom',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >

        <MenuItem
          component={Link}
          href={`/news/edit/${id}`}
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


const News = () => {
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const route = useRouter();
  const [sort, setSort] = useState('desc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [filter, setFilter] = useState('35')
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    console.log(data, 'slice data');
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const onDeleteSuccess = () => {
    fetchTableData();
  };

  const fetchTableData = useCallback(
    async (sort, q, filter, column) => {
      setLoading(true)
      const level = {
        level: getUserlogin('role'),
        user_id: getUserlogin('id')
      }
      await axios
        .post(`${process.env.APP_API}artikel/list`,
          {
            parameter_id: 'artikel',
            level: getUserlogin('role'),
            user_id: getUserlogin('id'),
            page: paginationModel.page,
            q: value,
            filter,
            sort,
            column

          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          },)
        .then(res => {

          const getdata = res?.data?.data?.data
          const total = res?.data?.data.total
          setTotal(total)
          const search = q?.toLowerCase()
          const filteredData = getdata
          setRows(filteredData)

        }).finally(() => {
          setLoading(false)
        })
    },
    [value, paginationModel]
  )
  // const dispatch = useDispatch()
  // const store = useSelector(state => state.post)

  useEffect(() => {
    fetchTableData(sort, searchValue, filter, sortColumn)
  }, [fetchTableData, searchValue, sort, filter, sortColumn])
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
    setLoading(true)
    setSearchValue(value)
    fetchTableData(sort, value, filter, sortColumn)
  }
  const handleNextPage = () => {
    const nextPage = paginationModel.page + 1;
    setPaginationModel({ ...paginationModel, page: nextPage });
    // fetchTableData(sort, searchValue, sortColumn, nextPage);
  };

  const handleFilter = (val) => {
    console.log(val, 'detail value')
    setValue(val)
    fetchTableData(sort, searchValue, filter, sortColumn)
  }

  const confirmActive = (param, artikel_id) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: param === 'N' ? 'Non Aktifkan Berita' : 'Aktifkan Berita yang dipilih.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.isConfirmed) {
        Action().activenewsNews(param, artikel_id)
        fetchTableData(sort, searchValue, filter, sortColumn)
      }
    })
  }

  const handlePageSizeChange = (newPageSize) => {
    // You can access the new page size here
    console.log(`New page size: ${newPageSize}`);

    // You can update your state or perform any other action with the new page size
    // For example, set it in a state variable
    // setPageSize(newPageSize);
  };

  const filterNews = (a) => {
    setFilter(a)
    const filterdata = a
    fetchTableData(sort, searchValue, filterdata, sortColumn)

  }

  return (
    <div>
      <Headtitle title={`Artikel & News Update`} />
      <CardHeader title={
        (<>
          <Icon fontSize='1.25rem' icon='tabler:news' />
          {`Artikel & News Update`}

        </>)
      } />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={`${total}`}
            trend='negative'
            title='Total data'
            avatarColor='success'
            icon='tabler:report-analytics'
          // subtitle=''
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={`${total}`}
            trend='negative'
            title='Total data'
            avatarColor='success'
            icon='tabler:report-analytics'
          // subtitle=''
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <CardStatsHorizontalWithDetails
            stats={rows.length}
            trend='negative'
            title='Artikel Perpage'
            avatarColor='success'
            icon='tabler:list-check'
          // subtitle=''
          />
        </Grid>

      </Grid>
      <br /><br />

      <Card>
        <CardContent>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} style={{ 'marginTop': '15px' }}>


                <Button variant='contained' sx={{ '& svg': { mr: 2 } }}
                  onClick={() =>
                    route.push('/news/create')
                  }
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Tambah
                </Button>

              </Grid>
              <Grid item xs={12} sm={4} style={{ 'marginTop': '15px' }}>

                <CustomTextField
                  select
                  fullWidth
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterNews(e.target.value)
                  }}
                >
                  <MenuItem key={0} value={null}>
                    --Semua data--
                  </MenuItem>
                  <MenuItem value="36">
                    Press Release
                  </MenuItem>
                  <MenuItem value="35">
                    News Update
                  </MenuItem>

                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    py: 4,
                    px: 6,
                    rowGap: 2,
                    columnGap: 12,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <CustomTextField
                    value={value}
                    sx={{ mr: 8 }}
                    placeholder='Search Data'
                    onChange={e => handleFilter(e.target.value)}
                  />

                </Box>
              </Grid>

            </Grid>
          </Box>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />



        <DataGrid
          autoHeight
          pagination
          rows={rows}
          onClick={handleNextPage}
          rowCount={total}
          columns=
          {

            [

              {
                flex: 1,
                minWidth: 290,
                field: 'formatted_title',
                headerName: 'Judul',
                renderCell: ({ row }) => {
                  if (row.formatted_title) {
                    return row.formatted_title
                  } else {
                    return 'Un Active'
                  }
                }
              },
              {
                flex: 2,
                field: 'picture',
                minWidth: 230,
                height: 230,
                headerName: 'Picture',
                renderCell: ({ row }) => {
                  if (row.picture) {

                    return <img src={`${process.env.ASSETS_API}/files/${row.picture}`} style={{ width: '100%' }}
                      onError={(e) => {
                        e.target.src = '/404.jpeg';
                        e.target.style.width = '100%';
                      }}
                    />
                  } else {
                    return 'data kosong'
                  }

                }
              },
              {
                flex: 1.8,
                minWidth: 100,

                field: 'active',
                headerName: 'active',
                renderCell: ({ row }) => {
                  if (getUserlogin('role') === '1') {

                    if (row.active === 'N') {
                      return <Button variant='tonal' color='warning'
                        onClick={() =>
                          confirmActive('Y', row.id)
                        }
                      >
                        <Icon fontSize='10px' icon='tabler:list' />
                      </Button>

                    } else {
                      return <Button variant='tonal' color='success'
                        onClick={() =>
                          confirmActive('N', row.id)
                        }
                      >
                        <Icon fontSize='10px' icon='tabler:check' />

                      </Button>

                    }


                  } else {

                    if (row.active === 'Y') {
                      return (<b>Active</b>)
                    } else {
                      return 'Un Active'
                    }
                  }
                }
              },
              {
                flex: 2.5,
                minWidth: 290,
                field: 'date',
                headerName: 'created On'
              },

              {
                flex: 1,
                minWidth: 250,
                sortable: false,
                field: 'created_by',
                headerName: 'Created By'
              },
              {
                flex: 2.5,
                minWidth: 168,
                field: 'updated_on',
                headerName: 'Update On'
              },
              {
                flex: 2.5,
                minWidth: 168,

                sortable: false,
                field: 'updated_by',
                headerName: 'Update By'
              },
              {
                flex: 1,
                minWidth: 100,
                sortable: false,
                field: 'id',
                headerName: 'Actions',
                renderCell: ({ row }) => <RowOptions id={row.id} onDeleteSuccess={onDeleteSuccess} />
              }
            ]
          }
          checkboxSelection
          sortingMode='server'
          paginationMode='server'
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
          onPaginationModelChange={setPaginationModel}
          onPageSizeChange={(newPageSize) => {
            console.log('ada', newPageSize)

            handlePageSizeChange(newPageSize)
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
          loading={loading}

        />
      </Card>
    </div >
  )
}

export default News
