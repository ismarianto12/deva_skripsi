import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const fetchData = createAsyncThunk('appPost/fetchData', async params => {
  try {
    const response = await axios.get('/admin/api/artikel/all', {
      params
    })
    const { q = '', role = null } = params ?? ""
    const search = q.toLowerCase()

    const filteredData = response.data.filter(download => (
      download.judul.toLowerCase().includes(search) || download.isi.toLowerCase().includes(search)
    ))

    return filteredData

  } catch (error) {
    console.log(error, 'error')
  }
},
)

// ** Add Post
export const addPost = createAsyncThunk('appPost/addPost', async (data, { getState, dispatch }) => {
  const response = await axios.post('/admin/api/Post/create', {
    data
  })
  dispatch(fetchData(getState().Post.params))

  return response.data
})

// ** Delete Post
export const deletePost = createAsyncThunk('appPost/deletePost', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/admin/api/Post/delete', {
    data: id
  })
  dispatch(fetchData(getState().Post.params))

  return response.data
})

export const appPostSlice = createSlice({
  name: 'appPost',
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
      state.allData = action.payload?.allData
    })
  }
})

export default appPostSlice.reducer
