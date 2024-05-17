import axios from 'axios'

export const deleteJenis = async (id) => {
  try {
    const res = await axios.post(`${process.env.APP_API}master/jenis/delete/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    return res
  } catch (error) {
    return error
  }
}
