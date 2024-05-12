// ismarianto
import axios from 'axios'

const CallEditPpdb = props => {
  axios.post(`${process.env.APP_API}/api/v1/detilppdb/${props.id}}`).then((data) => {
    props.setData(data.data)
  }).then((err) => {
    Swal.fire('error', `Gagal Mengabil data ${err}`, 'error')``
    props.setData([])
  })
}

export {
  CallEditPpdb
}
