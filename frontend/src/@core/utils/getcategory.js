import axios from 'axios'

const getAlbum = async props => {
  const { album, setAlbum } = props
  const config = {
    url: '/admin/api/album/all',
    method: 'get',
    headers: {
      'type': 'aplication/json',
    }
  }
  await axios(config).then((data) => {
    props.setAlbum(data.data)
  },).catch((err) => {
    props.setAlbum([])
    console.log('error status')
  },)
}

const getcategory = async props => {
  const { data, setData } = props
  const config = {
    url: '/admin/api/category/all',
    method: 'get',
    headers: {
      'type': 'aplication/json',
    }
  }
  await axios(config).then((data) => {
    props.setData(data.data)
  },).catch((err) => {
    props.setData([])
    console.log('error status')
  },)
}

const getTag = async props => {
  const { tagdata, setTagdata } = props
  const config = {
    url: '/admin/api/tag/all',
    method: 'get',
    headers: {
      'type': 'aplication/json',
    }
  }
  await axios(config).then((data) => {
    props.setTagdata(data.data)
  },).catch((err) => {
    props.setTagdata([])
    console.log('error status')
  },)
}
export { getcategory, getTag, getAlbum }


