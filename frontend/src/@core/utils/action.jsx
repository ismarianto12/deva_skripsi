import axios from "axios"
import Swal from "sweetalert2"
const Action = () => {
  const activenewsNews = (parameter, artikel_id) => {
    axios.post(`${process.env.APP_API}artikel/active`, {
      active: parameter,
      artikel_id: artikel_id,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).then((stat) => {
      Swal.fire('Succes', "Status artikel berhasil di update", 'success')

    }).catch((err) => {
      Swal.fire('Error', err.message, 'error')
    })
  }
  const DetailNews = () => {

  }


  // get slider data
  const fetchSlider = () => {
    axios.post(`${process.env.APP_API}/slider/list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
      }
    }).then((data) => {
      console.log(data.data, 'slider data')
      props.setData(data.data)
    }).catch((err) => {
      Swal.fire('erro', err.message, 'error')
    })
  }
  // action to call slider editing data :
  const CallEditSlider = props => {
    return axios.post(`${process.env.APP_API}slider/edit/${props.editid}`, {
      data: {
        id: props.editid
      }
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).then((res) => {
      props.setEditData(res.data[0])
      props.reset(res.data[0])
    }).catch((err) => {
      Swal.fire('error', err, 'error')
    })
  }
  // fucntion return and render master data
  const FUnit = async props => {
    axios.get(`${process.env.APP_API}/unit/list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }, {

    }).then((res) => {
      props.setUnitdata(res.data.data)
    }).catch(err => {
      Swal.fire('error', err, 'error')
    })
  }
  const FKelas = async (props) => {
    try {
      const response = await axios.get(`${process.env.APP_API}/kelas/masterchain`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          id: props.id,
        },
      });

      props.setKelasData(response.data.data);
    } catch (err) {
      Swal.fire('error', err.response.data.messages, 'error');
    }
  }
  const FtahunAkademik = async (props) => {
    try {
      const response = await axios.get(`${process.env.APP_API}/tahun/list`);
      props.setTahunData(response.data.data);
    } catch (err) {
      Swal.fire('error', err.response.data.messages, 'error');
    }
  };


  return {
    FUnit,
    FKelas,
    FtahunAkademik,
    activenewsNews,
    DetailNews,
    fetchSlider,
    CallEditSlider
  }

}

export default Action
