import axios from 'axios'

export const barangfetch = async () => {
  try {
    const data = await axios
      .get(`${process.env.APP_API}master/barang/?page=0&q=&sort=asc&column=created_at`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        params: {
          page: 10,
          // column: '',
        }
      })
    return data
  } catch (error) {
    console.log(error, "runtime")
    return error
  }
}

export const distributorfetch = async () => {
  try {
    const data = await axios
      .get(`${process.env.APP_API}master/distributor?q=&sort=asc&column=nama_distributor`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        params: {

        }
      })
    return data
  } catch (error) {
    return error
  }
}



