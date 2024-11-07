import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type UserState = {
  user: {
    id: string
    email: string
    name: string
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
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: UserState['user']
        // accessToken: string
      }>,
    ) => {
      const {
        user,
        // accessToken
      } = action.payload
      // state.token = accessToken
      state.isAuthenticated = true
      state.user = user
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.error = null
    },
  },
})

export const selectCurrentToken = (state: RootState) => state.user.token

export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions

export default userSlice.reducer
