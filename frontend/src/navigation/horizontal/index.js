const navigation = () => {
  // switch (level) {
  //   case '1':
  //   case '2':
  //   case '3':
  //   case '4':
  //   case '5':
  //   case '6':
  //   default:
  //     break;
  // }
  return [
    {
      title: 'Dashboard',
      icon: 'tabler:smart-home',
      badgeColor: 'error',
      path: '/home'
    },
    {
      title: 'Hightligt',
      icon: 'tabler:list',
      children: [
        {
          title: 'Download Area',
          path: '/download/list'
        },
        {
          title: 'Video Edukasi',
          path: '/video/list'
        },
        {
          title: 'Jadwal Edukasi',
          path: '/album/list'
        }
      ]
    },
    {
      title: 'Update Company',
      icon: 'tabler:list',
      children: [
        {
          title: 'Cabang',
          path: '/cabang/list'
        },
        {
          title: 'Nasabah',
          path: '/nasabah/list'
        },
        {
          title: 'Penghargaan',
          path: '/award/list'
        },
        {
          title: 'Reksadana',
          path: '/reksadana/list'
        }
      ]
    },

    {
      title: 'Master Data',
      icon: 'tabler:list',
      children: [
        {
          title: 'Tingkat Sekolah',
          path: '/tingkat/list'
        },
        {
          title: 'Kelas',
          path: '/kelas/list'
        },
        {
          title: 'Category',
          path: '/category/list'
        },
        {
          title: 'Tag Berita',
          path: '/tag/list'
        },
      ]
    },
    {
      title: 'Artikel',
      icon: 'tabler:file-dollar',
      children: [
        {
          title: 'News',
          path: '/news'
        },
        {
          title: 'Halaman',
          path: '/halaman'
        },
      ]
    },
    {
      title: 'E-learning',
      icon: 'tabler:file',
      children: [
        {
          title: 'Data Absensi',
          path: '/absensi'
        },
        {
          title: 'Elearning',
          path: '/elearning'
        },
      ]
    },

    {
      title: 'User',
      icon: 'tabler:user',
      children: [
        {
          title: 'List',
          path: '/user/list'
        },
        {
          title: 'Level',
          path: '/level/list'
        }
      ]
    },
  ]
}

export default navigation
