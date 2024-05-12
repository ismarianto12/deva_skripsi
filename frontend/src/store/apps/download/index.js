import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const fetchData = createAsyncThunk('appDownload/fetchData', async params => {
  try {
    const response = await axios.get(`${process.env.APP_API}download/list`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })


    const { q = '', role = null } = params ?? ""
    const search = q.toLowerCase()

    const filteredData = response.data.filter(download => (
      download.judul.toLowerCase().includes(search) || download.isi.toLowerCase().includes(search)
    ))

    return filteredData ?? []

  } catch (error) {
    console.log(error, 'error')
  }
},
)

export const addUser = createAsyncThunk('appDownload/addUser', async (data, { getState, dispatch }) => {
  const response = await axios.post('/admin/api/download/create', {
    data
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

// ** Delete User
export const deleteUser = createAsyncThunk('appDownload/deleteUser', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/admin/api/donwload/delete', {
    data: id
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

export const appDownloadSlice = createSlice({
  name: 'appDownload',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload.allData
    })
  }
})

export default appDownloadSlice.reducer
