import axios from 'axios'
const credetial = async props => {
  const { username, password, setStatus, setData } = props
  const config = {
    url: '/admin/api/login/auth',
    method: 'pos',
    data: {
      'username': username,
      'password': password
    },
    headers: {
      'type': 'aplication/json',
    }
  }
  await axios(config).then((data) => {
    props.setStatus(true)
    props.setData(data.data)
  },).catch((err) => {
    props.setStatus(false)
    props.setData([])

  },)
}


export default credetial
