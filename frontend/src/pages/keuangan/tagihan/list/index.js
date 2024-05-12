// ** React Imports
import { useEffect, useState, useCallback } from 'react'

import { Card, Button } from '@mui/material'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'


import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Comheader from './Comheader'
import Headtitle from 'src/@core/components/Headtitle'
import toast from 'react-hot-toast'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { useForm, Controller } from 'react-hook-form'


import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Filterdata from 'src/@core/components/Filterdata'

const fetchDivisi = (setDivisi) => {
  axios.get(`${process.env.APP_API}divisi/list`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).then((data) => {
    setDivisi(data.data)
  }).catch((err) => {
    console.log(err, 'console log error')
    toast.error('data divisi tidak bisa di tampilkan')
  })
}

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
    axios.delete(`${process.env.APP_API}promo/${id}`, {
      headers: {
        Authorization: `Bearer :${localStorage.getItem('accessToken')}`
      }
    })
      .then(e => {
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
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/keuangan/tagihan/edit/${id}`}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          {`View`}
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleRowOptionsClose}
          href={`/keuangan/tagihan/bayar/${id}`}
          sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:list' fontSize={20} />
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
  const [sortColumn, setSortColumn] = useState('unit_id')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [divis, setDivisi] = useState([])
  const [datadivisi, setDatadivisi] = useState([])
  const [show, setShow] = useState(false)
  const [kata, setKata] = useState('')
  const [unitdata, setUnitdata] = useState([])
  const [kelas, setKelas] = useState([])
  const [tahunajaaran, setTahunajaran] = useState([])
  const [payload, setPayload] = useState({
    unit: '',
    class_name: '',
    class_year: '',
    status: ''
  })
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }
  const onDeleteSuccess = () => {
    fetchTableData();
  }

  const schema = yup.object().shape({
    title: yup.string().required(),
    seotitle: yup.string().required(),
    active: yup.string().required(),

  })

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      id_category: "",
      title: "",
      judul: "",
      content: "",
      isi: "",
      tags: "",
      protect: "",
      picture: ""
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleFilter = () => {
    fetchTableData()
  }
  const onSubmit = async (data) => {
    const queryParams = {
      divisi: data.divisi
    }
    setSubmit(false)
    await axios
      .get(`${process.env.APP_API}karyawan/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: queryParams, // Pass the queryParams here
      })
      .then((res) => {
        setSubmit(true)
        console.log(res.data)
        setTotal(res.data.length);
        const filteredData = res.data.filter((datares) =>
          datares.nama?.toLowerCase().includes(searchValue) ||
          datares.email?.toLowerCase().includes(searchValue)
        )
        setRows(loadServerRows(paginationModel.page, filteredData))
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchTableData = useCallback(
    async (sort, q, column) => {
      await axios
        .post(`${process.env.APP_API}pembayaran/list`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        .then(res => {

          setTotal(res.data.length)
          const search = q?.toLowerCase()
          const resdata = res.data[0]

          const filteredData = res.data.filter(galery => (
            galery.nama?.toLowerCase().includes(search) || galery.deskripsiId?.toLowerCase().includes(search) || galery.deskripsiEn?.toLowerCase().includes(search)
          ))

          setRows(loadServerRows(paginationModel.page, filteredData))
        }).finally(() => {
          setLoading(false)
        })
    },
    [
      paginationModel,
      tahunajaaran,
      datadivisi,
      unitdata,
      kelas
    ]
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

      <Headtitle title="Tagihan Siswa" />
      <Card>
        <Filterdata
          divis={divis}
          datadivisi={datadivisi}
          show={show}
          unitdata={unitdata}
          kelas={kelas}
          tahunajaaran={tahunajaaran}
          handleFilter={handleFilter}
          setShow={setShow}
          setUnitdata={setUnitdata}
          setTahunajaran={setTahunajaran}
          setKelas={setKelas}
          setDivisi={setDivisi}
          setKata={setKata}
          payload={payload}
          setPayload={setPayload}
          urlparameter={'/keuangan/tagihan/list'}
          fetchTableData={fetchTableData}
        />

      </Card>
      <br />
      <Card>
        <CardHeader title={
          (<>
            <Icon fontSize='1.25rem' icon='tabler:list' />
            {`Tagihan Siswa`}
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
          columns={[
            {
              field: 'tingkat',
              minWidth: 200,
              headerName: 'Nama Unit',
              renderCell: ({ row }) => {
                if (row.tingkat) {
                  return (<b>{row.tingkat}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              field: 'nis',
              minWidth: 200,
              headerName: 'Nomor Induk'
            },
            {
              field: 'nama',
              minWidth: 200,
              headerName: 'Nama Lengkap'
            },
            {
              field: 'kelas',
              minWidth: 200,
              headerName: 'Kelas Sekarang',
              renderCell: ({ row }) => {
                if (row.kelas) {
                  return (<b>{row.kelas}</b>)
                } else {
                  return 'Kosong'
                }
              }

            },
            {
              field: 'tahun_ajaran',
              minWidth: 200,
              headerName: 'Tahun Ajaran',
              renderCell: ({ row }) => {
                if (row.tahun_ajaran) {
                  return (<b>{row.tahun_ajaran}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              field: 'status',
              minWidth: 100,
              headerName: 'Status',
              renderCell: ({ row }) => {
                if (row === 1) {
                  return 'LUNAS'
                } else if (row === 2) {
                  return 'Belum Lunas'
                } else {
                  return 'Silahkan Bayar'

                }
              }
            },
            {
              field: 'total_tagihan', headerName: 'Total Tagihan', renderCell: ({ row }) => {
                if (row.total_tagihan) {
                  return (<b>{row.total_tagihan}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              field: 'total_dibayar', headerName: 'Total Dibayar',
              renderCell: ({ row }) => {
                if (row.total_dibayar) {
                  return (<b>{row.total_dibayar}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              field: 'total_tunggakan', headerName: 'Total Tunggakan',
              renderCell: ({ row }) => {
                if (row.total_tunggakan) {
                  return (<b>{row.total_tunggakan}</b>)
                } else {
                  return 'Kosong'
                }
              }
            },
            {
              flex: 0.1,
              minWidth: 100,
              sortable: false,
              // field: 'actions',
              headerName: 'Actions',
              renderCell: ({ row }) => <RowOptions id={row.id} setLoading={setLoading} />
            }
          ]}
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
