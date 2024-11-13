import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/redux/store'

export type UserState = {
  user: {
    _id: string
    name: string
    email: string
    phone: string
    gender: string
    address: string
    photoURL: string
    role: number
  } | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  token: string | null
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.error = null
    },
  },
})

export const selectCurrentToken = (state: RootState) => state.user.token

export const { setCredentials, logout } = userSlice.actions

export default userSlice.reducer
