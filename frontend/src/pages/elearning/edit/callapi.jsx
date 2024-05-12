import axios from 'axios'

const callapi = async props => {
  const { id, setCabangdata } = props
  const config = {
    url: '/admin/api/cabang/' + props.id,
    method: 'get',
    headers: {
      'type': 'aplication/json',
    }
  }
  await axios(config).then((data) => {
    props.setCabangdata(data.data)
    props.reset(data.data)

  },).catch((err) => {
    props.setCabangdata([])
  },)
}


export default callapi
