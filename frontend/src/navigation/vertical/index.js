const navigation = () => {
  const userDataJSON = localStorage.getItem("userData");
  const userData = JSON.parse(userDataJSON);
  const role = userData[0]?.role;

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
          title: 'Proses Kluster',
          path: '/clustering',
          auth: false,
        },
        {
          title: 'Clustering Data',
          path: '/cluster/list',
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
