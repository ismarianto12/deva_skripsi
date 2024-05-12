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
const getCategory = async props => {
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

export { getAlbum, getCategory }
