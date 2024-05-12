// ** React Imports
import { useEffect, useState, useCallback, useMemo } from 'react'

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


const RowOptions = ({ id, onDeleteSuccess, setLoading }) => {
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
    axios.delete(`${process.env.APP_API}galery/destroy/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }
    })
      .then((response) => {
        toast.success('Data Kategory Berhasil di hapus')
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
        {/* <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/galery/edit/${id}`}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          {`View`}
        </MenuItem> */}
        <MenuItem
          component={Link}
          onClick={handleRowOptionsClose}
          href={`/galery/edit/${id}`}
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

const Galery = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('desc')
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
  }
  const fetchTableData = useCallback(
    async (sort, q, column) => {
      setLoading(true)
      await axios
        .get(`${process.env.APP_API}galery/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }, {
          params: {
            q,
            sort,
            column
          }
        })
        .then(res => {
          setLoading(false)
          const search = q.toLowerCase()
          const resdata = res.data[0]
          const filteredData = res.data.filter(galery => (
            galery.title?.toLowerCase().includes(search) || galery.deskripsiId?.toLowerCase().includes(search) || galery.deskripsiEn?.toLowerCase().includes(search)
          ))

          setTotal(res.data.length)
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
  const generateAutoIncrement = useCallback((rowIndex) => {
    let start = rowIndex.length
    console.log(start, 'detail')
    return start + 1;
  }, []);

  return (
    <Card data-aos="slide-left">
      <Headtitle title="Master Galery" />
      <CardHeader title={
        (<>
          <Icon fontSize='1.25rem' icon='tabler:news' />
          {`Master Galery`}
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
              flex: 1,
              minWidth: 250,
              field: 'title',
              headerName: 'Judul',
              renderCell: ({ row }) => {
                if (row.title === null) {
                  return (<b>Kosong</b>)
                } else {
                  return row.title
                }
              }

            },
            {
              flex: 0.25,
              minWidth: 168,
              field: 'albumtitle',
              headerName: 'albumtitle',
              renderCell: ({ row }) => {
                if (row.albumtitle) {
                  return row.albumtitle
                } else {
                  return (<b>Kosong</b>)

                }
              }
            },
            {
              flex: 0.25,
              minWidth: 168,

              field: 'gambar',
              headerName: 'Gambar',
              renderCell: ({ row }) => {
                const dataArrayImage = row?.images?.length > 0 ? row?.images?.split('\r\n') : [];

                if (row.gambar === null) {
                  return (<b>Kosong</b>)
                } else {
                  return (<img src={`https://www.mncsekuritas.id/po-content/po-upload/${dataArrayImage}`} style={{ 'width': '100%' }}
                    onError={(e) => {
                      e.target.src = 'https://www.mncsekuritas.id/po-content/mnc/img/logo_new1.png?1'; // Replace with your fallback image URL
                      e.target.style.width = '100%'; // Set width for the fallback image
                    }}


                  />)
                }
              }
            },
            {
              flex: 1,
              field: 'created_on',
              minWidth: 168,

              headerName: 'created On',
              renderCell: ({ row }) => {
                if (row.created_on) {
                  return (row.created_on)
                } else {
                  return 'Data Kosong'
                }
              }
            },

            {
              flex: 1,
              field: 'created_by',
              minWidth: 168,
              headerName: 'Created By',
              renderCell: ({ row }) => {
                if (row.created_by) {
                  return row.created_by
                } else {
                  return (<b>Kosong</b>)
                }
              }
            },
            {
              flex: 1,
              field: 'updated_on',
              minWidth: 168,

              headerName: 'Updated on',
              renderCell: ({ row }) => {
                if (row.updated_on) {
                  return (row.updated_on)
                } else {
                  return 'Data Kosong'
                }
              }
            },
            {
              flex: 1,
              field: 'updated_by',
              minWidth: 168,

              headerName: 'Updated By',
              renderCell: ({ row }) => {
                if (row.updated_by) {
                  return row.updated_by
                } else {
                  return (<b>Kosong</b>)
                }
              }
            },
            {
              flex: 0.20,
              minWidth: 100,
              sortable: false,
              field: 'actions',
              headerName: 'Actions',
              renderCell: ({ row }) => <RowOptions id={row.id} onDeleteSuccess={onDeleteSuccess} setLoading={setLoading} />
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

export default Galery
