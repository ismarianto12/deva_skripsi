
// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import dynamic from 'next/dynamic'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import axios from 'axios'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Icon from 'src/@core/components/icon'
import { Alert, Button, Divider, FormLabel } from '@mui/material'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardContent from '@mui/material/CardContent';
// import { CustomTextField, MenuItem } from 'src/@core/components/mui';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

// import   from 'src/@core/components/mui/text-field'
import Comheader from 'src/@core/components/Comheader';
import { getparamPend } from 'src/@core/utils/encp';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import CustomTextField from 'src/@core/components/mui/text-field'
import kmeansEngine from 'kmeans-engine';
import Preloading from 'src/@core/components/Preloading';
import db from 'src/configs/database';
import { QueryTypes } from 'sequelize';

const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

const Jenjang = [
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
]
const RowOptions = ({ id, status }) => {
  // ** Hooks
  // const dispatch = useDispatch()
  // ** State
  // console.log(status, 'status ppdb')
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const router = useRouter()

  const handleRowOptionsClose = (id, params) => {
    if (params === 'edit') {
      router.push(`/ppdb/edit/${id}`)
    } else if (params === 'view') {
      router.push(`/ppdb/edit/${id}`)
    } else if (params === 'confirm') {
      router.push(`/ppdb/confirm/${id}`)
    } else if (params === 'delete') {
      router.push(`/ppdb/edit/${id}`)

    }
    setAnchorEl(null)
  }

  const handleDelete = () => {
    // dispatch(deleteUser(id))
    handleRowOptionsClose(id, 'delete')
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
          sx={{ '& svg': { mr: 2 } }}
          onClick={() => handleRowOptionsClose(id, 'view')}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={() => handleRowOptionsClose(id, 'confirm')} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:check' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem href={`/ppdb/edit/${id}`} onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}
const datastatus = [
  {
    'id': '1', 'status': 'Diterima',

  },
  {
    'id': '2', 'status': 'Di tolak',
  }
]
const Index = (props) => {


  // ** States
  const [total, setTotal] = useState(0)
  const [action, setAction] = useState('tambah')
  const [iterasi, setIterasi] = useState('');
  const [periodeCluster, setPeriodeCluster] = useState(1); // Nilai default untuk Select
  const [error, setError] = useState(false); // State untuk menampilkan pesan kesalahan

  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [takademik, setTakademik] = useState('')
  const [status, setStatus] = useState('')
  const [manualCentroid, setManualCentroid] = useState(
    [
      { "C1": 580, "C2": 415, "C3": 212 },
      { "C1": 500, "C2": 400, "C3": 200 },
      { "C1": 80, "C2": 15, "C3": 12 }
    ]
  )

  const [plotdata, setPlotdata] = useState([{
    options: {},
    series: [17, 55, 77],
    labels: ['PALING BANYAK TERJUAL', 'SEDIKIT TERJUAL', 'TIDAK LARIS TERJUAL'],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.options.labels[opts.seriesIndex] + ': ' + val;
      },
    },
  }
  ])
  //
  const [iterations, setIterations] = useState(0);
  const [clusters, setClusters] = useState([]);
  const [closestCentroids, setClosestCentroids] = useState([]);
  const [rtable, setRtable] = useState([])
  const [jenjang, setJenjang] = useState('')
  const [iterationData, setIterationData] = useState([]);
  const [clustering, setClustering] = useState(
    {
      newCluster: [],
      iteration: []
    }
  )
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('full_name')
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }
  const Process = () => {

  }

  const handleIterasiChange = (e) => {
    setIterasi(e.target.value);
    setError(false);
  };

  const handlePeriodeClusterChange = (e) => {
    setPeriodeCluster(e.target.value);
  };

  const fetchTableData = useCallback(
    async (sort, q, column, page) => {
      await axios
        .get(`${process.env.APP_API}logic/clustering/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
          params: {
            page: paginationModel.page,
            q: q,
            sort: sort,
            column: column,
          }
        })
        .then(res => {
          console.log(res.data.data, 'response server');
          setTotal(res.data.total)
          setRows(res.data.data)
        }).finally(() => {
          setLoading(false)
        }).catch((err) => {
          // console.log(err.response.data.msg, 'get data')
          toast.success(`Token Unactive ${err.response?.data} Silahkan login`);
          Swal.fire('error', `${err?.response?.data?.msg} : Sesi login berakhir Silahkan login kembali`, 'error')
        })
    },
    [paginationModel]
  )


  const clusteringdata = async () => {
    if (!iterasi || !periodeCluster) {
      setError(true); // Menampilkan pesan kesalahan jika input kosong
      return;
    }
    setLoading(true);
    // const manualCentroid = [
    //   { C1: 580, C1: 500, C1: 80 },
    //   { C2: 415, C2: 400, C2: 15 },
    //   { C1: 212, C2: 200, C3: 12 }
    // ];
    const fdata = rows.map(item => ({
      stok_awal: parseInt(item.stok_awal),
      stok_akhir: parseInt(item.stok_akhir),
      stok_keluar: parseInt(item.stok_keluar)
    }));
    console.log(fdata, "fdata")
    // await awaitDelay(600);
    await kmeansEngine.clusterize(
      fdata,
      { k: 3, maxIterations: parseInt(iterasi), initialCentroids: manualCentroid, debug: true },
      (err, res) => {
        setLoading(false);
        // const formattedClusters = res.clusters.map(cluster => ({
        //   C1: cluster.centroid.stok_awal.toFixed(7),
        //   C2: cluster.centroid.stok_akhir.toFixed(7),
        //   C3: cluster.centroid.stok_keluar.toFixed(7),
        //   "JARAK TERDEKAT": Math.min(
        //     cluster?.closest?.map(c => Math.min(c.distance.C1, c.distance.C2, c.distance.C3))
        //   )
        // }));
        // console.log(res, 'hasil cluster terakhir data')
        setIterations(res.iterations);
        setClusters(res);
        setClosestCentroids(res.closest);
        Swal.fire('success', "Success Clustering data", 'success')
      }
    );
  };

  const cancel = () => {
    Swal.fire({
      title: 'Anda yakin?',
      text: "Memabatalakn proses clustering",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Iya'
    }).then((result) => {
      if (result.isConfirmed) {
        setIterasi('')
        setIterations('')
      }
    })
  }

  const awaitDelay = async (milliseconds) => {
    // setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, milliseconds));
    // setIsLoading(false);
  };

  const months = [
    { id: 1, name: 'Januari' },
    { id: 2, name: 'Februari' },
    { id: 3, name: 'Maret' },
    { id: 4, name: 'April' },
    { id: 5, name: 'Mei' },
    { id: 6, name: 'Juni' },
    { id: 7, name: 'Juli' },
    { id: 8, name: 'Agustus' },
    { id: 9, name: 'September' },
    { id: 10, name: 'Oktober' },
    { id: 11, name: 'November' },
    { id: 12, name: 'Desember' }
  ];

  // const clusteringdata = async () => {
  //   setLoading(true)
  //   const manualCentroid = [
  //     { stok_awal: 1000, stok_akhir: 500, stok_keluar: 500 },
  //     { stok_awal: 415, stok_akhir: 15, stok_keluar: 400 },
  //     { stok_awal: 212, stok_akhir: 12, stok_keluar: 200 }
  //   ];

  //   const fdata = rows.map(item => ({
  //     stok_awal: parseInt(item.stok_awal),
  //     stok_akhir: parseInt(item.stok_akhir),
  //     stok_keluar: parseInt(item.stok_keluar)
  //   }));
  //   await awaitDelay(600);
  //   await kmeansEngine.clusterize(fdata, { k: 3, maxIterations: 10, initialCentroids: manualCentroid, debug: true }, (err, res) => {
  //     setLoading(false)
  //     setIterations(res.iterations);
  //     setClusters(res.clusters);
  //     setClosestCentroids(res.closest);
  //   });
  //   Swal.fire('Success', 'Berhasil', 'success')
  // };


  // const clusteringdata = async () => {
  //   setLoading(true);
  //   const manualCentroid = [
  //     { SA: 1000, SAK: 500, SKEL: 500 },
  //     { SA: 415, SAK: 15, SKEL: 400 },
  //     { SA: 212, SAK: 12, SKEL: 200 }
  //   ];

  //   const fdata = rows.map(item => ({
  //     stok_awal: parseInt(item.stok_awal),
  //     stok_akhir: parseInt(item.stok_akhir),
  //     stok_keluar: parseInt(item.stok_keluar)
  //   }));

  //   // await awaitDelay(600);

  //   kmeansEngine.clusterize(
  //     fdata,
  //     { k: 3, maxIterations: 10, initialCentroids: manualCentroid, debug: true },
  //     (err, res) => {
  //       setLoading(false);
  //       // const formattedClusters = res.clusters.map(cluster => ({
  //       //   C1: cluster.centroid.stok_awal.toFixed(7),
  //       //   C2: cluster.centroid.stok_akhir.toFixed(7),
  //       //   C3: cluster.centroid.stok_keluar.toFixed(7),
  //       //   "JARAK TERDEKAT": Math.min(
  //       //     cluster?.closest?.map(c => Math.min(c.distance.C1, c.distance.C2, c.distance.C3))
  //       //   )
  //       // }));
  //       // console.log(formattedClusters)
  //       setIterations(res.iterations);
  //       setClusters(res);
  //       setClosestCentroids(res.closest);
  //     }
  //   );
  // };


  // const clusteringdata = async () => {
  //   setLoading(true);
  //   const manualCentroid = [
  //     { SA: 1000, SAK: 500, SKEL: 500 },
  //     { SA: 415, SAK: 15, SKEL: 400 },
  //     { SA: 212, SAK: 12, SKEL: 200 }
  //   ];
  //   //     { stok_awal: 1000, stok_akhir: 500, stok_keluar: 500 },
  //   //     { stok_awal: 415, stok_akhir: 15, stok_keluar: 400 },
  //   //     { stok_awal: 212, stok_akhir: 12, stok_keluar: 200 }
  //   //   ];


  //   const fdata = rows.map(item => ({
  //     stok_awal: parseInt(item.stok_awal),
  //     stok_akhir: parseInt(item.stok_akhir),
  //     stok_keluar: parseInt(item.stok_keluar)
  //   }));

  //   console.log(fdata, "fdata");

  //   kmeansEngine.clusterize(
  //     fdata,
  //     { k: 3, maxIterations: 10, initialCentroids: manualCentroid, debug: true },
  //     (err, res) => {

  //       setLoading(false);
  //       // const formattedClusters = res.clusters.map(cluster => ({
  //       //   C1: cluster.centroid.stok_awal.toFixed(7),
  //       //   C2: cluster.centroid.stok_akhir.toFixed(7),
  //       //   C3: cluster.centroid.stok_keluar.toFixed(7),
  //       //   "JARAK TERDEKAT": ''
  //       // }));

  //       // console.log(formattedClusters);
  //       // setIterations(res.iterations);
  //       setClusters(res);
  //       // setClosestCentroids(res.closest);

  //       // Logging iterasi
  //       // res.iterations.forEach((iteration, index) => {
  //       //   console.log(`Iterasi ke-${index + 1}:`, iteration);
  //       // });
  //     }
  //   );
  // };
  // const manualCentroid = [
  //   { stok_awal: 1000, stok_akhir: 500, stok_keluar: 500 },
  //   { stok_awal: 415, stok_akhir: 15, stok_keluar: 400 },
  //   { stok_awal: 212, stok_akhir: 12, stok_keluar: 200 }
  // ];

  // const fdata = rows.map(item => ({
  //   stok_awal: parseInt(item.stok_awal),
  //   stok_akhir: parseInt(item.stok_akhir),
  //   stok_keluar: parseInt(item.stok_keluar)
  // }));

  // kmeansEngine.clusterize(fdata, { k: 3, maxIterations: 10, initialCentroids: manualCentroid, debug: true }, (err, res) => {
  //   console.log('----- Results -----');
  //   console.log('Initial Centroids: ', res.centroids);
  //   console.log(`Iterations: ${res.iterations}`);

  //   const iterationDetails = [];
  //   for (let i = 0; i < res.iterations; i++) {
  //     const iterationData = {
  //       clusters: [],
  //       closestCentroids: res.closest[i]
  //     };

  //     res.clusters[i].forEach((cluster, idx) => {
  //       const clusterData = fdata[cluster];
  //       iterationData.clusters.push({
  //         stok_awal: clusterData.stok_awal,
  //         stok_akhir: clusterData.stok_akhir,
  //         stok_keluar: clusterData.stok_keluar
  //       });
  //     });

  //     iterationDetails.push(iterationData);
  //   }

  //   setIterationData(iterationDetails);
  // });
  useEffect(() => {
    console.log(props.paramdata, 'paramdataF')

    fetchTableData(sort, searchValue, sortColumn)
  }, [fetchTableData, searchValue, sort, sortColumn])
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])
  const filterByjenjang = (e) => {
    console.log('filter bya je' + e.target.value)
    setJenjang(e.target.value)
    fetchTableData(sort, searchValue, sortColumn)
  }

  const filterByStatus = (e) => {
    // console.log(e.target.value, 'status')
    setStatus(e.target.value)
    fetchTableData(sort, searchValue, sortColumn, e.target.value, jenjang)
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
  const fhandleRoleChange = (e) => {
    const level = e.target.value

  }
  const caridata = () => {
    // setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }



  const kodebarang = [
    {
      id: "C1",
      name: 'BANYAK TERJUAL',

    },
    {
      id: "C2",
      name: 'SEDIKIT TERJUAL',

    },
    {
      id: "C3",
      name: 'TIDAK LARIS TERJUAL',
    }
  ]

  const jsonData = clusters.clusters
  const pantek = JSON.parse(JSON.stringify(iterations));

  console.log(manualCentroid[0].C1, 'manualCentroid')
  return (
    <div data-aos="slide-left">

      <Head>
        <title>Clustering Barang</title>
      </Head>
      {/* <Grid container spacing={6}>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats={79}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='info'
            title='BANYAK TERJUAL
'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats={39}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='SEDIKIT TERJUAL'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats={30}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='error'
            title='TIDAK LARIS TERJUAL'
            subtitle='Last week'
            avatarIcon='tabler:currency-dollar'
          />
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats='3'
            chipText='+25.2%'
            avatarColor='info'
            chipColor='default'
            title='Total Cluster'
            subtitle='Last week'
            avatarIcon='tabler:chart-bar'
          />
        </Grid>
      </Grid> */}

      <Card sx={{ 'padding': '30px' }}>


        {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
        <CardContent>
          {/* <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={4} paddingBottom={10} sx={{
              display: 'flex'
            }}>
              <Grid item xs={12} sm={3}>
                <FormLabel>Jenjang : </FormLabel>
                <CustomTextField
                  select
                  fullWidth
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterByjenjang(e)
                  }}
                >
                  <MenuItem key={0} value={''}>
                    --Semua data--
                  </MenuItem>
                  {Jenjang.map((level) => (
                    <MenuItem key={level.value} value={level.id}>
                      {level.value.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormLabel>Tahun Akademik : </FormLabel>

                <CustomTextField
                  select
                  fullWidth
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => setTakademik(e.target.value)
                  }}
                >
                  <MenuItem key={0} value={null}>
                    --Semua data--
                  </MenuItem>
                  {tahunakademik.map((takademik) => (
                    <MenuItem key={takademik.id} value={takademik.id}>
                      {takademik.tahun} - {takademik.Semester}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={3}>

                <FormLabel>Status : </FormLabel>

                <CustomTextField
                  select
                  fullWidth
                  // value={role} // Ganti defaultValue dengan value
                  SelectProps={{
                    displayEmpty: true,
                    onChange: e => filterByStatus(e)
                  }}
                >
                  <MenuItem key={0} value={''}>
                    --Status--
                  </MenuItem>
                  {datastatus.map((lll) => (
                    <MenuItem key={lll.id} value={lll.id}>
                      {lll.status.toUpperCase()}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <br />
                <Button type='submit' variant='contained' sx={{
                  mr: 3,
                  width: '50%'
                }}
                  onClick={() => caridata()}
                >
                  Cari
                </Button>
              </Grid>
            </Grid>
          </Box> */}
          <Typography variant='h5' sx={{ mb: 10 }}>
            <Icon icon='tabler:files' fontSize='1.125rem'
            />
            K Means Clustering
          </Typography>
          <br />
          <Grid container spacing={10} xs={12}>
            <Grid item xs={12} sm={6}>

              <CustomTextField
                fullWidth
                value={iterasi}
                onChange={handleIterasiChange}
                sx={{ mb: 4 }}
                label='Iterasi'
                placeholder='Iterasi'
              />
              {error && (
                <Typography variant='body2' color='error'>
                  Tidak boleh kosong.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <Box sx={{ rowGap: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}

              {/* <Select
                value={periodeCluster}
                onChange={handlePeriodeClusterChange}
                size='small'
                label='Iterasi'
                sx={{
                  minWidth: '100%',
                }}
              > */}
              <CustomTextField
                fullWidth
                select
                value={periodeCluster}
                onChange={handlePeriodeClusterChange}
                sx={{ mb: 4 }}
                label='Iterasi'
                placeholder='Iterasi'
              >

                {months.map((monthsdata, i) => (
                  <MenuItem key={`Y-${i}`} value={i + 1}>
                    {monthsdata.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid container spacing={20} justifyContent="flex-start">
              <Grid item xs={12} sm={3}>
                <Button type='submit' variant='contained' onClick={clusteringdata} sx={{ width: '100%', marginRight: '8px' }}>
                  Cluster
                </Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button variant='tonal' color='info' onClick={cancel} sx={{ width: '100%' }}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>

      </Card>

      {/* {clustering.newCluster

        } */}


      <div>
        {/* {JSON.stringify(clusters)} */}
        {
          iterations > 0 ?
            <Card sx={{ marginTop: '40px', 'padding': '30px' }}>

              <CardContent>
                <div style={{ 'overflow': 'auto', 'marginBottom': '30px' }}>
                  <BarangTable data={jsonData} iterations={iterations} plotdata={plotdata} />
                </div>
                {
                  Array.from({ length: iterations }, (_, index) => {
                    let updateclustering = '';
                    const clusterdata = [JSON.stringify(iterations[index])]
                    return (
                      <>
                        <Alert severity="success" sx={{ 'width': '100%', 'marginBottom': '15px' }} ><b>Iterasi Ke - {index + 1}</b></Alert>

                        <Grid item xs={12} sm={12} sx={{
                          'overflow': 'auto',
                          'height': '400px'
                        }}>
                          <div key={index}>
                            {/* <h3 className='heading'>Iterasi Ke - {index + 1}</h3> */}
                            <table className='trx'>
                              <thead>
                                <tr>
                                  <th>No.</th>
                                  <th>Kode Barang</th>
                                  <th>SA</th>
                                  <th>SAK</th>
                                  <th>SKEL</th>
                                  <th>C1</th>
                                  <th>C2</th>
                                  <th>C3</th>
                                  <th>Jarak Terdekat</th>
                                  <th>Cluster</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  rows.map((rowsdata, j) => {
                                    return (<tr>
                                      <td style={{ 'width': '4%' }}>{j + 1}</td>
                                      <td style={{ 'width': '10%' }}>{rowsdata.kd_barang}</td>
                                      <td>{rowsdata.stok_awal}</td>
                                      <td>{rowsdata.stok_akhir}</td>
                                      <td>{rowsdata.stok_keluar}</td>
                                      <td>{_hitungCluster(parseInt(rowsdata.stok_awal), 580, parseInt(rowsdata.stok_akhir), 500, parseInt(rowsdata.stok_keluar), 80)}</td>
                                      <td>{_hitungCluster(parseInt(rowsdata.stok_awal), 415, parseInt(rowsdata.stok_akhir), 400, parseInt(rowsdata.stok_keluar), 15)}</td>
                                      <td>{_hitungCluster(parseInt(rowsdata.stok_awal), 212, parseInt(rowsdata.stok_akhir), 200, parseInt(rowsdata.stok_keluar), 12)}</td>
                                      <td>{_hitungjarakTerdekat(
                                        _hitungCluster(parseInt(rowsdata.stok_awal), 580, parseInt(rowsdata.stok_akhir), 500, parseInt(rowsdata.stok_keluar), 80),
                                        _hitungCluster(parseInt(rowsdata.stok_awal), 415, parseInt(rowsdata.stok_akhir), 400, parseInt(rowsdata.stok_keluar), 15),
                                        _hitungCluster(parseInt(rowsdata.stok_awal), 212, parseInt(rowsdata.stok_akhir), 200, parseInt(rowsdata.stok_keluar), 12),
                                      )}</td>
                                      <td>
                                        {_cariCluster(
                                          _hitungCluster(parseInt(rowsdata.stok_awal), 580, parseInt(rowsdata.stok_akhir), 500, parseInt(rowsdata.stok_keluar), 80),
                                          _hitungCluster(parseInt(rowsdata.stok_awal), 415, parseInt(rowsdata.stok_akhir), 400, parseInt(rowsdata.stok_keluar), 15),
                                          _hitungCluster(parseInt(rowsdata.stok_awal), 212, parseInt(rowsdata.stok_akhir), 200, parseInt(rowsdata.stok_keluar), 12),

                                        )}
                                      </td>
                                    </tr>)
                                  })
                                }
                              </tbody>
                            </table>

                          </div>
                        </Grid>
                        {
                          console.log(index, 'iterations')
                        }
                        {
                          console.log(manualCentroid)
                        }
                        <Grid item xs={12} lg={12} sx={{ 'marginBottom': '30px' }}>
                          {
                            index === 0 ?
                              <table className='childcls'>
                                <tr style={{ 'background': '#ddd' }}>
                                  <th>Centroid</th>
                                  <th>SA</th>
                                  <th>SAK</th>
                                  <th>SEKL</th>
                                </tr>
                                <tbody>
                                  <tr>
                                    <td>
                                      C1
                                    </td>
                                    <td>
                                      580
                                    </td>
                                    <td>
                                      500
                                    </td>
                                    <td>
                                      80
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      C2
                                    </td>
                                    <td>
                                      415
                                    </td>
                                    <td>
                                      400
                                    </td>
                                    <td>
                                      15
                                    </td>

                                  </tr>
                                  <tr>
                                    <td>
                                      C3
                                    </td>
                                    <td>
                                      212
                                    </td>
                                    <td>
                                      200
                                    </td>
                                    <td>
                                      12
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              :
                              <table className='childcls'>
                                <tr style={{ 'background': '#ddd' }}>
                                  <th>Centroid</th>
                                  <th>SA</th>
                                  <th>SAK</th>
                                  <th>SEKL</th>
                                </tr>
                                <tbody>
                                  {
                                    manualCentroid?.map((manualCentroids, j) =>
                                    (<tr>
                                      <td>{'C' + j}</td>
                                      <td>{manualCentroids.C1 ?? 0}</td>
                                      <td>{manualCentroids.C2 ?? 0}</td>
                                      <td>{manualCentroids.C3 ?? 0}</td>
                                    </tr>),
                                    )
                                  }
                                </tbody>
                              </table>

                          }
                        </Grid>

                      </>
                    )

                  }
                  )
                }
              </CardContent>
            </Card>
            : ''
        }

      </div>
      {/* <DataGrid
          isDense={true}
          stickyHeader
          autoHeight
          pagination
          // rows={rows}
          rows={rows.map((item, index) => ({ id: index + 1, ...item }))}
          rowCount={total}
          columns={
            [
              {
                flex: 1,
                minWidth: 5,
                maxWidth: 80,
                field: "id",
                headerName: 'No.',
                renderCell: ({ row }) => (
                  <Typography href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
                )
              },
              {
                flex: 1,
                minWidth: 180,
                field: 'kd_barang',
                headerName: 'Kode Barang'
              },
              {
                flex: 1,
                minWidth: 220,
                field: 'nama_barang',
                headerName: 'Nama Barang'
              },
              {
                flex: 1,
                minWidth: 80,
                headerName: 'KDB',
                field: 'KDB',
              },
              {
                flex: 1,
                minWidth: 80,
                headerName: 'SA',
                field: 'SA',
                hide: true,
              },
              {
                flex: 1,
                headerClassName: 'redBackground',
                cellClassName: 'redBackground',
                minWidth: 80,
                headerName: 'SAK',
                field: 'SAK',
              },
              {
                flex: 1,
                minWidth: 80,
                headerName: 'SKEL',
                field: 'SKEL',
                hide: true, renderCell: ({ row }) => {
                  if (row.SKEL) {
                    return row.SKEL
                  } else {
                    return (<b>0</b>)
                  }
                }
              },
              {
                flex: 1,
                minWidth: 80,
                headerName: 'C1',
                // field: null,
                field: 'C1',
                hide: true, renderCell: ({ row }) => {
                  if (row.C1) {
                    return row.C1
                  } else {
                    return (<b>0</b>)
                  }
                }
              },
              {
                flex: 1,
                minWidth: 80,
                headerName: 'C2	',
                // field: null,
                field: 'C2',
                hide: true, renderCell: ({ row }) => {
                  if (row.C2) {
                    return row.C2
                  } else {
                    return (<b>0</b>)
                  }
                }
              },
              {
                flex: 1,
                minWidth: 80,
                headerName: 'C3',
                // field: null,
                field: 'C3',
                hide: true,
                renderCell: ({ row }) => {
                  if (row.C3) {
                    return row.C3
                  } else {
                    return (<b>0</b>)
                  }
                }
              },
              {
                flex: 1,
                minWidth: 80,
                field: 'JARAK_TERDEKAT',
                hide: true,
                headerName: 'JARAK TERDEKAT	',
                renderCell: ({ row }) => {
                  if (row.CLUSTER) {
                    return row.JARAK_TERDEKAT
                  } else {
                    return (<b>0</b>)
                  }
                }
              },
              {
                flex: 1,
                minWidth: 80,
                field: 'CLUSTER',
                hide: true,
                headerName: 'CLUSTER',
                renderCell: ({ row }) => {
                  if (row.CLUSTER) {
                    return row.CLUSTER
                  } else {
                    return (<b>0</b>)
                  }
                }
              },
              {
                flex: 0.1,
                minWidth: 100,
                sortable: false,
                field: 'actions',
                headerName: 'Actions',
                renderCell: ({ row }) => <RowOptions id={row.id} setAction={setAction} />
              }
            ]
          }
          checkboxSelection
          sortingMode='server'
          paginationMode='server'
          pageSizeOptions={[80]}
          paginationModel={paginationModel}
          onSortModelChange={handleSortModel}
          getRowId={(row) => row.id}
          onPaginationModelChange={newModel => {
            console.log(newModel, 'pagenya')
            setPaginationModel(newModel);
            // fetchTableData(sort, searchValue, sortColumn, newModel.page);
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
        /> */}

      <Preloading show={loading} info={`Sedang Melakukan Perhitungan`} />
    </div >
  )
}
function __storeCenteroid(data) {
  try {
    const res = axios.post(`${process.env.APP_API}/createcenteroid`, {
      data
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accesssToken')}`
      }
    })
    return res
  } catch (error) {
    return error
  }
}

function _hitungCluster(W3, R3, X3, S3, Y3, T3) {
  return Math.sqrt(Math.pow((W3 - R3), 2) + Math.pow((X3 - S3), 2) + Math.pow((Y3 - T3), 2));
}

function _hitungjarakTerdekat(...nilai) {
  if (nilai.length === 0) {
    return undefined; // Mengembalikan undefined jika tidak ada nilai yang diberikan
  }

  let nilaiTerkecil = nilai[0]; // Anggap nilai pertama sebagai nilai terkecil awal

  for (let i = 1; i < nilai.length; i++) {
    if (nilai[i] < nilaiTerkecil) {
      nilaiTerkecil = nilai[i]; // Perbarui nilai terkecil jika ditemukan nilai yang lebih kecil
    }
  }

  return nilaiTerkecil;
}

function _cariCluster(Z3, AA3, AB3) {
  if (Z3 < AA3 && Z3 < AB3) {
    return 1;
  } else if (AA3 < Z3 && AA3 < AB3) {
    return 2;
  } else if (AB3 < Z3 && AB3 < AA3) {
    return 3;
  } else {
    return "Tidak ada cluster yang sesuai.";
  }
}

function _hitungCentroid(inputString) {
  let count = 0;
  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i].toLowerCase() === 'i') {
      count++;
    }
  }
  return count;
}
export default Index


// kmeans.clusterize(data, { k: 4, maxIterations: 25, initialCentroids: this.state.manualCentroid ? centroids : undefined, debug: true }, (err, res) => {
//   console.log('----- Results -----');
//   console.log('Initial Centroids: ', centroids)
//   console.log(`Iterations: ${res.iterations}`);
//   console.log('Clusters: ');
//   console.log(res.clusters);
//   const newCluster = res.clusters
//   const iteration = res.iterations

//   this.setOutput(newCluster, iteration)
// });
export async function getServerSideProps(context) {
  try {
    const paramdata = await db.query(`SELECT * FROM centeroid where ITERASI = ?`, {
      replacements: [
        context.params.id
      ],
      type: QueryTypes.SELECT
    });

    return {
      props: {
        paramdata: JSON.parse(JSON.stringify(paramdata)) // Convert paramdata to JSON format
      }
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        paramdata: [] // Return an empty array for paramdata if there's an error
      }
    };
  }
}

const BarangTable = ({ data, iterations, plotdata }) => {
  const param = {

    series: [{
      name: "Desktops",
      data: [10, 41, 35]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: `Result Clustering Ke ${iterations}`,
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['PALING BANYAK TERJUAL', 'SEDIKIT TERJUAL', 'TIDAK LARIS TERJUAL'],
      }
    },
  }

  const clusterchart = {
    series: [{
      data: [44, 55, 41, 64, 22, 43, 21]
    }, {
      data: [53, 32, 33, 52, 13, 44, 32]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 430
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
      },
    },
  }


  return (
    <div>
      {iterations > 0 ?
        <>
          <Typography variant='h4' sx={{ mb: 10 }}>
            <Icon icon='tabler:files' fontSize='1.125rem'
            />
            Total Clustering Ke - {iterations}
          </Typography>

          <Grid container xs={12}>
            <Grid item xs={12} sm={6}>

              <ReactApexcharts options={clusterchart.options} series={clusterchart.series} type="bar" width="100%" />
              <table style={{ 'width': '100%' }}>
                <thead>
                  <tr>
                    <th>Stok Awal</th>
                    <th>Stok Akhir</th>
                    <th>Stok Keluar</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.centroid?.stok_awal?.toFixed(2) ?? 0}</td>
                      <td>{item.centroid?.stok_akhir?.toFixed(2) ?? 0}</td>
                      <td>{item.centroid?.stok_keluar?.toFixed(2) ?? 0}</td>
                      {/* <td>{item.vectorIds.join(', ')}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              <br /><br /><br /><br />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ReactApexcharts options={param.options} series={param.series} type="line" width="100%" style={{ 'marginLeft': '10px' }} />
              <ReactApexcharts options={plotdata[0].options} series={plotdata[0].series} type="donut" width="80%" style={{ 'marginLeft': '30px' }} />
            </Grid>
          </Grid>
        </>
        : <></>}

    </div>

  );
};










// https://stackoverflow.com/questions/44119692/how-to-go-through-a-queue-with-a-loop-which-includes-a-delay-javascript
