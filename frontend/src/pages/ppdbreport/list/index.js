// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CustomTextField from 'src/@core/components/mui/text-field'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Grid from '@mui/material/Grid'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { getparamPend } from 'src/@core/utils/encp'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, ButtonGroup } from '@mui/material'
import { FormLabel } from '@mui/material'

import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

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





const Kelas = () => {
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('title')
  const [dari, setDari] = useState('')
  const [sampai, setSampai] = useState('')
  const [submit, setSubmit] = useState(false)

  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }

  const onDeleteSuccess = () => {
    fetchTableData();
  }


  const schema = yup.object().shape({
    dari: yup.string().required(),
    sampai: yup.string().required(),
    // description: yup.string().required(),
    // tingkat: yup.string().required()
  })
  const defaultValues = {

  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {

    console.log(data.dari, 'status')
    const queryParams = {
      dari: data.dari,
      jenjang: data.jenjang,
      status: data.status,
      sampai: data.sampai,
    };
    setSubmit(false)

    await axios
      .get(`${process.env.APP_API}laporan/ppdb`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: queryParams, // Pass the queryParams here
      })
      .then((res) => {
        setSubmit(true)
        console.log(res.data)
        setTotal(res.data.length);
        const filteredData = res.data.filter((galery) =>
          galery.kelas?.toLowerCase().includes(searchValue) ||
          galery.tingkat?.toLowerCase().includes(searchValue)
        );
        setRows(loadServerRows(paginationModel.page, filteredData));
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .get(`${process.env.APP_API}laporan/ppdb`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }, {
          params: {
            dari,
            sampai,
            q,
            sort,
            column
          }
        })
        .then(res => {
          setTotal(res.data.length)
          const search = q.toLowerCase()
          const filteredData = res.data.filter(galery => (
            galery.kelas?.toLowerCase().includes(search) || galery.tingkat?.toLowerCase().includes(search)
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
      axios.delete(`${process.env.APP_API}ppdb/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }

      })
        .then(succes => {
          // onDeleteSuccess()
          // fetchTableData()
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



    const Search = () => {
      fetchTableData(sort, searchValue, sortColumn)

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
            href={`/ppdb/edit/${id}`}
            onClick={handleRowOptionsClose}
          >
            <Icon icon='tabler:eye' fontSize={20} />
            {`View`}
          </MenuItem>
          <MenuItem
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            href={`/ppdb/edit/${id}`}
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

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Peserta PPDB 2023');

    // Define the columns in the Excel file
    const columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tgl & Jam', key: 'date_inv', width: 15 },
      { header: 'Nama', key: 'nama', width: 20 },
      { header: 'Handphone', key: 'no_telp', width: 15 },
      { header: 'Nis', key: 'nis', width: 10 },
      { header: 'JK', key: 'jk', width: 10 },
      { header: 'Majors', key: 'id_majors', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'User ID', key: 'username', width: 15 },
    ];

    // Set the columns in the worksheet
    worksheet.columns = columns;

    // Populate the data from your DataGrid
    rows.forEach((row) => {
      worksheet.addRow({
        id: row.id,
        date_inv: row.date_inv,
        nama: row.nama,
        no_telp: row.no_telp,
        nis: row.nis,
        jk: row.jk,
        id_majors: getparamPend(row.id_majors), // You may need to modify this to get the actual data
        status: row.status,
        username: row.username,
      });
    });

    // Create a blob from the Excel file and save it
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'LaporanPesertaPPDB.xlsx');
    });
  };

  return (
    <div data-aos="slide-left">
    <Card>
      <div style={{ 'display': 'inline' }}>
        <Headtitle title="Master Keuangan" />
        <CardHeader title={
          (<>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Icon fontSize='3.25rem' icon='tabler:list' />

              </Grid>
              <Grid item>
                <Typography variant="h6">:::Report PPDB:::</Typography>
              </Grid>
            </Grid>

          </>)
        }
          style={{ display: 'inline' }}
        />
      </div>


      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container spacing={5} sx={{ justifyContent: 'center' }}>
          {/* Left Columns */}
          <Grid item xs={12} sm={5} sx={{ textAlign: 'left' }}>
            <Controller
              name='dari'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='date'
                  value={value}
                  label='Dari'
                  onChange={onChange}
                  error={Boolean(errors.dari)}
                  {...(errors.dari && { helperText: errors.dari.message })}
                />
              )}
            />
            <FormLabel>Status : </FormLabel>
            <Controller
              name='status'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (

                <CustomTextField
                  select
                  fullWidth
                  value={value}
                  onChange={onChange}

                >
                  <MenuItem key={0} value={''}>
                    --Status--
                  </MenuItem>
                  {[
                    {
                      'id': '1', 'status': 'Diterima',

                    },
                    {
                      'id': '2', 'status': 'Di tolak',
                    }
                  ].map((level) => (
                    <MenuItem key={level.id} value={level.id}>
                      {level.status.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={5} sx={{ textAlign: 'left' }}>
            <Controller
              name='sampai'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='date'
                  value={value}
                  label='Sampai'
                  onChange={onChange}
                  error={Boolean(errors.sampai)}
                  {...(errors.sampai && { helperText: errors.sampai.message })}
                />
              )}
            />
            <FormLabel>Jenjang : </FormLabel>
            <Controller
              name='jenjang'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  fullWidth
                  value={value}
                  onChange={onChange}
                >
                  <MenuItem key={0} value={''}>
                    --Semua data--
                  </MenuItem>
                  {[
                    {
                      'id': 1,
                      'value': 'TKA',

                    },
                    {
                      'id': 2,
                      'value': 'TKB',
                    },
                    {
                      'id': 3,
                      'value': 'SD',

                    }, {
                      'id': 4,
                      'value': 'MTSI',

                    },
                  ].map((level) => (
                    <MenuItem key={level.value} value={level.id}>
                      {level.value.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={5} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
            <Button type='submit' variant='contained' sx={{ width: '30%', background: 'red' }}>
              Search
            </Button>
            &nbsp;&nbsp;
            <Button type='reset' onClick={reset} variant='contained' sx={{ width: '30%' }}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>

      <br />


      {submit ?

        (<>
          <ButtonGroup variant="contained" color="primary">
            <Button onClick={exportToExcel}>Excel</Button>
            <Button>Word</Button>
            <Button>PDF</Button>
          </ButtonGroup></>)
        : ''}

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
                <Typography href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
              )
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'date_inv',
              headerName: 'Tgl & Jam'
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'nama',
              headerName: 'Nama'
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'no_telp',
              headerName: 'Handphone'
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'nis',
              headerName: 'Nis',
            },

            {
              flex: 0.25,
              minWidth: 290,
              field: 'jk',
              headerName: 'JK',
              renderCell: ({ row }) => {
                if (row.jk === 'P') {
                  return (<b>Perempuan</b>)
                } else {
                  return 'Laki - Laki'
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'id_majors',
              headerName: 'Majors',
              renderCell: ({ row }) => {
                return getparamPend(row.id_majors)
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'status',
              headerName: 'Status',
              renderCell: ({ row }) => {
                if (parseInt(row.status) === 1) {
                  return <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={'Approved'}
                    color={'success'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                } else if (parseInt(row.status) === 2) {
                  return <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={'Tolak'}
                    color={'error'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                } else {
                  return <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={'Baru'}
                    color={'error'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                }
              }
            },
            {
              flex: 0.25,
              minWidth: 290,
              field: 'username',
              headerName: 'User id'
            },
            {
              flex: 0.1,
              minWidth: 100,
              sortable: false,
              field: 'staff_konfirmasi',
              headerName: 'Actions',
              renderCell: ({ row }) => <RowOptions id={row.id} status={row.status} />
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
        // onPaginationModelChange={setPaginationModel}
        onPaginationModelChange={newModel => {
          setPaginationModel(newModel);
          fetchTableData(sort, searchValue, sortColumn, newModel.page);
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
      />
    </Card>
    </div>
  )
}

export default Kelas
