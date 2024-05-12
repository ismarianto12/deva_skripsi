import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import Swal from 'sweetalert2'

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async params => {
  try {
    const response = await axios.get(`${process.env.APP_API}master/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    const { q = '', role = null } = params ?? ''
    const queryLowered = q.toLowerCase()
    // const role
    console.log(role, 'roel thnunk')
    if (role !== null) {
      const filteredData = response.data.data.filter((user) => user.role.toLowerCase().includes(role))
      return filteredData
    } else {
      const filteredData = response.data.data.filter(
        user =>
        (user.username.toLowerCase().includes(queryLowered) ||
          user.nama_lengkap.toLowerCase().includes(queryLowered) ||
          user.level.toLowerCase().includes(queryLowered) ||
          (user.email.toLowerCase().includes(queryLowered)))
      )
      return filteredData
    }
  } catch (error) {
    console.log(error, 'error')
    Swal.fire('error', err.response.data.msg, 'error')
  }
},
)

// ** Add User
export const addUser = createAsyncThunk('appUsers/addUser', async (data, { getState, dispatch }) => {
  const response = await axios.post('/admin/api/users/create', {
    data
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

// ** Delete User
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/admin/api/users/delete', {
    data: id
  })
  dispatch(fetchData(getState().user.params))

  return response.data
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
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

export default appUsersSlice.reducer
