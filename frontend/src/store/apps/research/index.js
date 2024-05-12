import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Research
export const fetchData = createAsyncThunk('appResearch/fetchData', async params => {
  try {
    const response = await axios.get('/admin/api/research/all', {
      params
    })
    // console.log(response, 'response')
    return response.data ?? []

  } catch (error) {
    console.log(error, 'error')
  }
},
)

// ** Add User
export const addUser = createAsyncThunk('appResearch/addUser', async (data, { getState, dispatch }) => {
  const response = await axios.post('/admin/api/research/create', {
    data
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

// ** Delete User
export const deleteUser = createAsyncThunk('appResearch/deleteUser', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/admin/api/Research/delete', {
    data: id
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

export const appResearchSlice = createSlice({
  name: 'appResearch',
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
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appResearchSlice.reducer
