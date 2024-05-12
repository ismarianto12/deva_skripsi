import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Pages
export const fetchData = createAsyncThunk('appPages/fetchData', async params => {
  try {
    const response = await axios.get('/admin/api/artikel/all', {
      params
    })
    return response.data ?? []
  } catch (error) {
    console.log(error, 'error')
  }
},
)

// ** Add Page
export const addPage = createAsyncThunk('appPages/addPage', async (data, { getState, dispatch }) => {
  const response = await axios.Page('/admin/api/Pages/create', {
    data
  })
  dispatch(fetchData(getState().Page.params))

  return response.data
})

// ** Delete Page
export const deletePage = createAsyncThunk('appPages/deletePage', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/admin/api/Pages/delete', {
    data: id
  })
  dispatch(fetchData(getState().Page.params))

  return response.data
})

export const appPagesSlice = createSlice({
  name: 'appPages',
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

export default appPagesSlice.reducer
