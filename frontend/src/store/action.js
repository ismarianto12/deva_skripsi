import axios from 'axios'
const Action = () => {

  const callUnit = async () => {
    const response = await axios.get(`${process.env.APP_API}tingkat/list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return response.data
  }
  const callKelas = async (id) => {
    const response = await axios.get(`${process.env.APP_API}kelas/getbyUnit/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return response.data
  }

  const callTahunakademik = async () => {
    const response = await axios.get(`${process.env.APP_API}tahunakademik/list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return response.data
  }
  return {
    callUnit,
    callKelas,
    callTahunakademik
  }
}
export default Action
