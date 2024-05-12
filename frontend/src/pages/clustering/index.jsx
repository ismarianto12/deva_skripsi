
// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
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
const Index = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [action, setAction] = useState('tambah')
  const [sort, setSort] = useState('asc')
  const [rows, setRows] = useState([])
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [takademik, setTakademik] = useState('')
  const [status, setStatus] = useState('')

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
  const [tahunakademik, setTahunakademik] = useState([])

  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('full_name')
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 7 })
  function loadServerRows(currentPage, data) {
    return data.slice(currentPage * paginationModel.pageSize, (currentPage + 1) * paginationModel.pageSize)
  }
  const Process = () => {

  }

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


  // const clusteringdata = () => {
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

  //   kmeansEngine.clusterize(fdata, { k: 3, maxIterations: 10, initialCentroids: manualCentroid, debug: true }, (err, res) => {
  //     console.log('----- Results -----');
  //     console.log('Initial Centroids: ', res.centroids);
  //     console.log(`Iterations: ${res.iterations}`);
  //     console.log('Clusters: ');
  //     console.log(res.clusters);
  //     // Mengelompokkan data berdasarkan ketentuan cluster
  //     const clusterData = {
  //       cluster1: [],
  //       cluster2: [],
  //       cluster3: []
  //     };

  //     for (let idx = 0; idx < res.clusters.length; idx++) {
  //       const cluster = res?.clusters[idx];
  //       // if (cluster) {
  //       cluster?.forEach((item) => {
  //         const { stok_awal, stok_akhir, stok_keluar } = fdata[item];
  //         if (idx === 0) {
  //           clusterData.cluster1.push({ 'stok_awal': stok_awal });
  //         } else if (idx === 1) {
  //           clusterData.cluster2.push({ 'stok_keluar': stok_keluar });
  //         } else if (idx === 2) {
  //           clusterData.cluster3.push({ 'stok_akhir': stok_akhir });
  //         }
  //       });
  //       // } else {
  //       //   console.log('Cluster terhenti')
  //       // }
  //     }


  //     console.log('Cluster 1 - Stok Awal:');
  //     console.log(clusterData.cluster1);
  //     console.log('Cluster 2 - Stok Keluar:');
  //     console.log(clusterData.cluster2);
  //     console.log('Cluster 3 - Stok Akhir:');
  //     console.log(clusterData.cluster3);

  //     const newCluster = res.clusters;
  //     const iteration = res.iterations;

  //     // this.setOutput(newCluster, iteration)
  //     // Jika Anda ingin mengatur state, Anda harus melakukannya di sini
  //     // setClustering({
  //     //   newCluster: newCluster,
  //     //   iteration: iteration,
  //     // })
  //   });
  // };


  // const clusteringdata = () => {
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

  //   kmeansEngine.clusterize(fdata, { k: 3, maxIterations: 10, initialCentroids: manualCentroid, debug: true }, (err, res) => {
  //     console.log('----- Results -----');
  //     console.log('Initial Centroids: ', res.centroids);
  //     console.log(`Iterations: ${res.iterations}`);

  //     for (let i = 0; i < res.iterations; i++) {
  //       console.log(`----- Iteration ${i + 1} -----`);
  //       console.log('Clusters: ');
  //       console.log(res.clusters[i]);

  //       const closestCentroids = res.closest[i];
  //       console.log('Closest Centroids: ', closestCentroids);

  //       // Mengelompokkan data berdasarkan ketentuan cluster
  //       const clusterData = {
  //         cluster1: [],
  //         cluster2: [],
  //         cluster3: []
  //       };

  //       res.clusters[i].forEach((cluster, idx) => {
  //         cluster.forEach((item) => {
  //           const { stok_awal, stok_akhir, stok_keluar } = fdata[item];
  //           if (idx === 0) {
  //             clusterData.cluster1.push({ 'stok_awal': stok_awal });
  //           } else if (idx === 1) {
  //             clusterData.cluster2.push({ 'stok_keluar': stok_keluar });
  //           } else if (idx === 2) {
  //             clusterData.cluster3.push({ 'stok_akhir': stok_akhir });
  //           }
  //         });
  //       });

  //       console.log('Cluster 1 - Stok Awal:');
  //       console.log(clusterData.cluster1);
  //       console.log('Cluster 2 - Stok Keluar:');
  //     }
  //   })
  // }

  // const clusteringdata = () => {
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
  //   kmeansEngine.clusterize(fdata, { k: 3, maxIterations: 25, initialCentroids: manualCentroid, debug: true }, (err, res) => {
  //     console.log('----- Results -----');
  //     console.log('Initial Centroids: ', manualCentroid)
  //     console.log(`Iterations: ${res.iterations}`);
  //     console.log('Clusters: ');
  //     console.log(res.clusters);

  //     const newCluster = res.clusters
  //     const iteration = res.iterations
  //     // setClustering(res)

  //     setClustering({
  //       newCluster: newCluster,
  //       iteration: iteration,
  //     })
  //     setLoading(false);
  //   });
  // }
  const awaitDelay = async (milliseconds) => {
    // setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, milliseconds));
    // setIsLoading(false);
  };

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


  const clusteringdata = async () => {
    setLoading(true);
    const manualCentroid = [
      { SA: 1000, SAK: 500, SKEL: 500 },
      { SA: 415, SAK: 15, SKEL: 400 },
      { SA: 212, SAK: 12, SKEL: 200 }
    ];

    const fdata = rows.map(item => ({
      stok_awal: parseInt(item.stok_awal),
      stok_akhir: parseInt(item.stok_akhir),
      stok_keluar: parseInt(item.stok_keluar)
    }));

    console.log(fdata, "fdata")

    // await awaitDelay(600);

    kmeansEngine.clusterize(
      fdata,
      { k: 3, maxIterations: 10, initialCentroids: manualCentroid, debug: true },
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
        // console.log(formattedClusters)
        setIterations(res.iterations);
        setClusters(res);
        setClosestCentroids(res.closest);
      }
    );
  };


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
    const calltahun = async () => {
      await axios.get(`${process.env.APP_API}tahunakademik/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      }).then((res) => {
        setTahunakademik(res.data)
      }).catch((err) => {
        console.log('gagal mengabil data tahun akademik', err)
      })
    }
    calltahun()
  }, [
    status,
    jenjang
  ])

  useEffect(() => {
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
      name: 'PALING BANYAK TERJUAL',

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

  const pantek = JSON.parse(JSON.stringify(iterations));

  return (
    <div data-aos="slide-left">

      <Head>
        <title>Master - Barang</title>
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={6} sm={3} lg={3}>
          <CardStatsVertical
            stats={79}
            chipText='-12.2%'
            chipColor='default'
            avatarColor='info'
            title='PALING BANYAK TERJUAL'
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
      </Grid>
      <br /><br />
      <Card>

        <Divider sx={{ m: '0 !important' }} />
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
          <Typography variant='h5' sx={{ mb: 0.5 }}>
            <Icon icon='tabler:files' fontSize='1.125rem'
            />
            K Means Clustering
          </Typography>

          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Grid item xs={12} sm={6}>
              <Box sx={{ rowGap: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'right' }}>
                <Button
                  variant='contained'
                  sx={{ '& svg': { mr: 1 } }}
                  onClick={() => clusteringdata()}
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Proses Iterasi
                </Button>
                &nbsp;
                <CustomTextField
                  value={value}
                  sx={{ mr: 8 }}
                  placeholder='Search Data'
                  onChange={(e) => handleFilter(e.target.value)}
                />

              </Box>


            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'right' }}> */}
              <CustomTextField
                value={value}
                sx={{ mr: 8 }}
                placeholder='Iterasi Data'
                onChange={(e) => handleFilter(e.target.value)}
              />

              <Select
                size='small'
              // value={selectedSubdistrict}
              // onChange={(e) => setSelectedSubdistrict(e.target.value)}
              >
                <MenuItem value="">Pilih Kategori</MenuItem>
                {kodebarang.map((kodebarangs) => (
                  <MenuItem key={kodebarangs.id} value={kodebarangs.name}>
                    {kodebarangs.name}
                  </MenuItem>
                ))}
              </Select>
              &nbsp;&nbsp;
              <Button
                variant='contained'
                color='success'
                sx={{ '& svg': { mr: 2 } }}
                onClick={() => route.push(url)}
              >
                <Icon fontSize='1.125rem' icon='tabler:search' />
                Cari
              </Button>
            </Grid>
          </Box>

        </CardContent>



        {/* {clustering.newCluster

        } */}
        <div>
          {/* {JSON.stringify(clusters)} */}
          <Grid container spacing={2} sx={{ 'padding': '0px 30px 30px 30px' }}>
            {
              loading ?

                <></>
                :
                Array.from({ length: iterations }, (_, index) => {
                  const clusterdata = [JSON.stringify(iterations[index])]
                  return (
                    <>
                      <Alert severity="success" sx={{ 'width': '100%' }}><b>Iterasi Ke - {index + 1}</b></Alert>
                      <Grid item xs={12} sm={12} sx={{
                        'overflow': 'auto',
                        'height': '400px'
                      }}>
                        <div key={index}>
                          {/* <h3 className='heading'>Iterasi Ke - {index + 1}</h3> */}
                          <table className='trx'>
                            <thead>
                              <tr>
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
                                    <td>{rowsdata.kd_barang}</td>
                                    <td>{rowsdata.stok_awal}</td>
                                    <td>{rowsdata.stok_akhir}</td>
                                    <td>{rowsdata.stok_keluar}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>)

                                })
                              }

                            </tbody>
                          </table>
                        </div>
                        {JSON.stringify(clusters)}
                      </Grid>

                      <Grid item xs={12} lg={12}>
                        <table className='childcls'>
                          <tr style={{ 'background': '#ddd' }}>
                            <th>Centroid</th>
                            <th>SA</th>
                            <th>SAK</th>
                            <th>SEKL</th>
                          </tr>
                          <tbody>
                            <tr>
                              <td>Centroid</td>
                              <td>SA</td>
                              <td>SAK</td>
                              <td>SEKL</td>
                            </tr>
                          </tbody>
                        </table>

                      </Grid>

                    </>
                  )

                }
                )

            }
          </Grid>
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
      </Card>
      <Preloading show={loading} info={`Sedang Melakukan Perhitungan`} />
    </div>
  )
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
