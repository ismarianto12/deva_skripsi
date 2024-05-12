const navigation = () => {
  const userDataJSON = localStorage.getItem("userData");
  const userData = JSON.parse(userDataJSON);
  const role = userData[0]?.role;
  // admin super user
  // panitia pdb
  // bagian akademik
  // if (role === '1') {
  //   // return [
  //   //   {
  //   //     title: 'Dashboard',
  //   //     icon: 'tabler:smart-home',
  //   //     badgeColor: 'success',
  //   //     background: 'red',
  //   //     active: true,
  //   //     path: '/home',
  //   //     auth: false,
  //   //   },
  //   //   {
  //   //     title: 'PPDB',
  //   //     icon: 'tabler:files',
  //   //     auth: false,

  //   //     children: [
  //   //       {
  //   //         title: 'SET UP PPDB',
  //   //         path: '/takademik/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'DATA PPDB',
  //   //         path: '/ppdb/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Laporan PPDB',
  //   //         path: '/ppdbreport/list',
  //   //         auth: false,
  //   //       }
  //   //     ]
  //   //   },
  //   //   {
  //   //     title: 'Akademik',
  //   //     icon: 'tabler:users',
  //   //     auth: false,
  //   //     children: [
  //   //       {
  //   //         title: 'Data Mata Pelajaran',
  //   //         auth: false,
  //   //         path: '/mapel/list'
  //   //       },
  //   //       {
  //   //         title: 'MASTER SISWA',
  //   //         path: '/siswa/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'MASTER DIVISI',
  //   //         path: '/divisi/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'MASTER PEGAWAI',
  //   //         path: '/pegawai/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'MASTER GURU',
  //   //         path: '/guru/list',
  //   //         auth: false,
  //   //       }
  //   //     ]
  //   //   },
  //   //   {
  //   //     title: 'Keuangan',
  //   //     icon: 'tabler:list',
  //   //     auth: false,
  //   //     children: [
  //   //       {
  //   //         title: 'PARAMATER BIAYA',
  //   //         path: '/parameterbiaya/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Tagihan Siswa',
  //   //         path: '/keuangan/tagihan/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Laporan',
  //   //         path: '/keuangan/laporan/list',
  //   //         auth: false,
  //   //       }
  //   //     ]
  //   //   },
  //   //   {
  //   //     title: 'E-learning',
  //   //     auth: false,
  //   //     icon: 'tabler:news',
  //   //     children: [
  //   //       {
  //   //         title: 'Data Absensi',
  //   //         auth: false,
  //   //         path: '/absensi/list'
  //   //       },
  //   //       {
  //   //         title: 'Elearning',
  //   //         auth: false,
  //   //         path: '/elearning/list'
  //   //       },
  //   //     ]
  //   //   },
  //   //   {
  //   //     title: 'MASTER',
  //   //     icon: 'tabler:news',
  //   //     auth: false,
  //   //     children: [
  //   //       {
  //   //         title: 'Tingkat Sekolah',
  //   //         path: '/tingkat/list',
  //   //         auth: false,

  //   //       },
  //   //       {
  //   //         title: 'Kelas',
  //   //         path: '/kelas/list',
  //   //         auth: false,

  //   //       },
  //   //       {
  //   //         title: 'Berita & Acara',
  //   //         path: '/news',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'GALERY',
  //   //         path: '/galery/list',
  //   //         auth: false,
  //   //       }
  //   //     ]
  //   //   },

  //   //   {
  //   //     title: 'Master Data',
  //   //     icon: 'tabler:copy',
  //   //     auth: false,
  //   //     children: [
  //   //       {
  //   //         title: 'User',
  //   //         path: '/user/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Level Akses',
  //   //         path: '/level/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Identitas Aplikasi',
  //   //         path: '/identiti',
  //   //         auth: false,
  //   //       },

  //   //     ]
  //   //   },
  //   //   // {
  //   //   //   title: 'Artikel',
  //   //   //   icon: 'tabler:chart-bar',
  //   //   //   auth: false,
  //   //   //   children: [
  //   //   //     {
  //   //   //       title: 'News',
  //   //   //       auth: false,
  //   //   //       path: '/news'
  //   //   //     },
  //   //   //     {
  //   //   //       title: 'Halaman',
  //   //   //       auth: false,
  //   //   //       path: '/halaman'
  //   //   //     },
  //   //   //   ]
  //   //   // },
  //   //   // {
  //   //   //   title: 'Galery',
  //   //   //   icon: 'tabler:file',
  //   //   //   auth: false,
  //   //   //   children: [
  //   //   //     {
  //   //   //       title: 'Album',
  //   //   //       path: '/album/list',
  //   //   //       auth: false,
  //   //   //     },
  //   //   //     {
  //   //   //       title: 'Slider',
  //   //   //       path: '/slider/list',
  //   //   //       auth: false,
  //   //   //     },
  //   //   //     {
  //   //   //       title: 'Galery',
  //   //   //       auth: false,
  //   //   //       path: '/galery/list'
  //   //   //     }
  //   //   //     , {
  //   //   //       title: 'Promo',
  //   //   //       auth: false,
  //   //   //       path: '/promo/list'
  //   //   //     }

  //   //   //   ]
  //   //   // },
  //   //   // {
  //   //   //   title: 'User',
  //   //   //   auth: false,
  //   //   //   icon: 'tabler:user',
  //   //   //   children: [
  //   //   //     {
  //   //   //       title: 'List',
  //   //   //       auth: false,
  //   //   //       path: '/user/list'
  //   //   //     },
  //   //   //     {
  //   //   //       title: 'Level',
  //   //   //       auth: false,
  //   //   //       path: '/level/list'
  //   //   //     }
  //   //   //   ]
  //   //   // },
  //   // ]
  // } else {
  //   // return [
  //   //   {
  //   //     title: 'Dashboard',
  //   //     icon: 'tabler:smart-home',
  //   //     badgeColor: 'error',
  //   //     path: '/home',
  //   //     auth: false,
  //   //     active: true
  //   //   },
  //   //   {
  //   //     title: 'Hightligt',
  //   //     icon: 'tabler:files',
  //   //     auth: false,

  //   //     children: [
  //   //       {
  //   //         title: 'Download Area',
  //   //         path: '/download/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Video Edukasi',
  //   //         path: '/video/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Jadwal Edukasi',
  //   //         path: '/jadwal/list',
  //   //         auth: false,
  //   //       }

  //   //     ]
  //   //   },
  //   //   {
  //   //     title: 'Artikel',
  //   //     icon: 'tabler:chart-bar',
  //   //     auth: false,
  //   //     children: [
  //   //       {
  //   //         title: 'News',
  //   //         auth: false,
  //   //         path: '/news'
  //   //       },
  //   //       {
  //   //         title: 'Halaman',
  //   //         auth: false,
  //   //         path: '/halaman'
  //   //       },
  //   //     ]
  //   //   },
  //   //   {
  //   //     title: 'Galery',
  //   //     icon: 'tabler:file',
  //   //     auth: false,
  //   //     children: [
  //   //       {
  //   //         title: 'Album',
  //   //         path: '/album/list',
  //   //         auth: false,
  //   //       },
  //   //       {
  //   //         title: 'Galery',
  //   //         auth: false,
  //   //         path: '/galery/list'
  //   //       }
  //   //       , {
  //   //         title: 'Promo',
  //   //         auth: false,
  //   //         path: '/promo/list'
  //   //       }

  //   //     ]
  //   //   },
  //   // ]
  // }

  return [
    {
      title: 'Dashboard',
      icon: 'tabler:smart-home',
      badgeColor: 'success',
      background: 'red',
      active: true,
      path: '/home',
      auth: false,
    },
    {
      title: 'Master Data',
      icon: 'tabler:files',
      auth: false,

      children: [
        {
          title: 'Barang',
          path: '/barang/list',
          auth: false,
        },
        {
          title: 'Jenis Barang',
          path: '/jenisbarang/list',
          auth: false,
        },
        {
          title: 'Distributor',
          path: '/distributor/list',
          auth: false,
        }
      ]
    },

    {
      title: 'K-MEANS Process',
      icon: 'tabler:files',
      auth: false,

      children: [
        {
          title: 'Pusat Kluster',
          path: '/clustering',
          auth: false,
        },
        {
          title: 'Perhitungan',
          path: '/jenisbarang/list',
          auth: false,
        },
        {
          title: 'Hasil Iterasi',
          path: '/distributor/list',
          auth: false,
        },
        {
          title: 'Hasil Kluster',
          path: '/distributor/list',
          auth: false,
        }
      ]
    },
    {
      title: 'Transaksi',
      icon: 'tabler:settings',
      auth: false,
      children: [
        {
          title: 'Purcahsing',
          auth: false,
          path: '/purcashing/list'
        },
        {
          title: 'Barang Masuk',
          auth: false,
          path: '/barang_masuk/list'
        },
        {
          title: 'Barang Keluar',
          path: '/barang_keluar/list',
          auth: false,
        },

      ]
    },
    {
      title: 'Report',
      icon: 'tabler:files',
      auth: false,
      children: [
        {
          title: 'Transaksi',
          auth: false,
          path: '/reporttransaksi/list'
        },
        {
          title: 'Data Barang',
          path: '/reportbarang/list',
          auth: false,
        },

      ]
    },
    {
      title: 'Sistem',
      icon: 'tabler:users',
      auth: false,
      children: [
        {
          title: 'User',
          auth: false,
          path: '/user/list'
        },
        {
          title: 'Identitias Aplikasi',
          path: '/identiti',
          auth: false,
        },

      ]
    },
  ]
}

export default navigation
