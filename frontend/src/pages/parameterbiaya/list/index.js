import { useEffect, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

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
import { getparamPend } from 'src/@core/utils/encp'
import Action from 'src/store/action'
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


const Category = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [unitdata, setUnitdata] = useState([])
  const [unitid, setUnitid] = useState('')
  const [kelas, setKelas] = useState([])
  const [kelas_id, setKelas_id] = useState('')


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
        .post(`${process.env.APP_API}parameterbiaya/list`,
          {
            q,
            sort,
            column,
            kelas_id: kelas_id,
            unit_id: unitid
          }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }
        )
        .then(res => {
          setTotal(res.data.length)

          const search = q.toLowerCase()
          const resdata = res.data[0]
          const filteredData = res.data?.filter(galery => (
            galery.nama_biaya?.toLowerCase().includes(search) || galery.nominal?.toLowerCase().includes(search) || galery.tingkat?.toLowerCase().includes(search)
          ))
          // nama_biaya
          // nominal
          // tingkat
          setRows(loadServerRows(paginationModel.page, filteredData))
        }).finally(() => {
          setLoading(false)
        })
    },
    [paginationModel]
  )
  useEffect(() => {
    fetchTableData(sort, searchValue, sortColumn)
    const callData = (async () => {
      const callunit = await Action().callUnit()
      setUnitdata(callunit)
    })

    callData()
  }, [fetchTableData, searchValue, sort, sortColumn, kelas_id])



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
      axios.post(`${process.env.APP_API}parameterbiaya/destroy/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })
        .then(succes => {
          fetchTableData(sort, searchValue, sortColumn)
          setLoading(true)
          toast.success('Berhasil hapus data')
        }).catch(() => {
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
            href={`/parameterbiaya/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            href={`/parameterbiaya/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
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

  const searchKelas = async (e) => {
    setKelas([])
    const dataunit_id = e.target.value
    const restkelas = await Action().callKelas(dataunit_id)
    setUnitid(dataunit_id)
    setKelas(restkelas)

  }

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('tingkat')
    }
  }
  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }
  const searchdata = () => {
    fetchTableData(sort, searchValue, sortColumn)

  }

  return (
    <div data-aos="slide-left">


      <Card>
        <div className="accordion mb-3">
          <div className="accordion-item">
            <div className="accordion-header">
              <h2 className="accordion-button" data-bs-toggle="collapse" data-bs-target="#tab-filter" aria-expanded="true" style={{ cursor: 'pointer' }} onClick={() => setShow((show) => !show)}>
                {show ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-filter" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5" />
                </svg>

                  :
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>


                }
                Filter Data
              </h2>
            </div>
            <div id="tab-filter" className={`accordion-collapse collapse ${show ? '' : 'show'}`} style={{}}>
              <div className="accordion-body pt-0">
                <form id="filter-form" action='#'>
                  <div className="row">
                    <div className="col-sm-4 col-md-4 mb-3">
                      <label className="form-label">
                        Pilih Unit
                      </label>
                      <select name="unit" id="filter-unit" className="form-select"
                        onChange={(e) => searchKelas(e)}
                      >
                        <option value={``}>Pilih Unit</option>
                        {unitdata?.map((data, i) => {
                          return (
                            <option value={`${data?.id}`}>{data?.tingkat}</option>
                          )
                        }
                        )}
                      </select>
                    </div>
                    <div className="col-sm-4 col-md-4 mb-3">
                      <label className="form-label">
                        Pilih Kelas
                      </label>
                      <select name="class_name" id="class-name" className="form-select"
                        onChange={(e) => setKelas_id(e.target.value)}
                      >
                        <option value={``}>Pilih Kelas</option>
                        {kelas?.map((fdata) => (
                          <option value={`${fdata?.id}`}>{fdata?.kelas} - {fdata?.tingkat}</option>
                        )
                        )}
                      </select>

                    </div>
                    <div className="col-sm-4 col-md-4 mt-4">

                      <button type="button" id="btn-apply-filter" className="btn btn-primary" onClick={searchdata}>
                        Terapkan Filter
                      </button>
                      &nbsp;&nbsp;
                      <button type="reset" id="btn-reset-filter" className="btn btn-warning mr-12">
                        Reset Filter
                      </button>
                    </div>


                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <br />
      <Card>
        <div style={{ 'display': 'inline' }}>
          <Headtitle title="Master parameterbiaya" />
          <CardHeader title={
            (<>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Icon fontSize='3.25rem' icon='tabler:list' />

                </Grid>
                <Grid item>
                  <Typography variant="h6">Master parameterbiaya</Typography>
                </Grid>
              </Grid>

            </>)
          }
            style={{ display: 'inline' }}
          />
        </div>



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
                flex: 0.2,
                field: 'id',
                headerName: 'ID',
                renderCell: ({ row }) => (
                  <Typography href={`/parameterbiaya/edit/${row.id}`}>{`#${row.id}`}</Typography>
                )
              },
              {
                flex: 0.25,
                field: 'nama_biaya',
                headerName: 'Nama Biaya'
              },
              {
                flex: 0.25,
                field: 'nominal',
                headerName: 'Nominal'
              },
              {
                flex: 0.25,
                field: 'tingkat',
                headerName: 'Tingkat',
                renderCell: ({ row }) => {
                  return getparamPend(row.tingkat)
                }
              },
              {
                flex: 0.1,
                sortable: false,
                // field: 'actions',
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
    </div>
  )
}

export default Category
