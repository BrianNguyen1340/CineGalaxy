import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// *****************************************************************************

export type UserState = {
  user: {
    id: string
    email: string
    phone: string
    name: string
    dateOfBirth: {
      day: number
      month: number
      year: number
    }
    gender: string
    address: string
    photoURL: string
    role: number
  } | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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
      }>,
    ) => {
      state.isAuthenticated = true
      state.user = action.payload.user
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

export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions

export default userSlice.reducer
