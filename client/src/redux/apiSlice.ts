import {
  createApi,
  fetchBaseQuery,
  // BaseQueryApi,
  // FetchArgs,
} from '@reduxjs/toolkit/query/react'

// import { RootState } from './store'
// import { loginSuccess } from './reducers/user.reducer'

// const baseQuery = fetchBaseQuery({
//   baseUrl: 'http://localhost:7777',
//   credentials: 'include',
//   prepareHeaders: (headers, { getState }) => {
//     const state = getState() as RootState
//     const token = state.user.token

//     if (token) {
//       headers.set('authorization', `Bearer ${token}`)
//     }
//     return headers
//   },
// })

// interface RefreshData {
//   user: {
//     id: string
//     email: string
//     name: string
//     phone: string
//     gender: string
//     address: string
//     photoURL: string
//     role: number
//   }
//   token: string
// }

// const baseQueryWithAuth = async (
//   args: string | FetchArgs,
//   api: BaseQueryApi,
//   extraOptions: object,
// ) => {
//   let result = await baseQuery(args, api, extraOptions)

//   if (result?.error?.status === 403) {
//     const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

//     if (refreshResult?.data) {
//       const refreshData = refreshResult.data as RefreshData

//       api.dispatch(
//         loginSuccess({ user: refreshData.user, token: refreshData.token }),
//       )

//       result = await baseQuery(args, api, extraOptions)
//     } else {
//       if (refreshResult?.error?.status === 403 && refreshResult.error.data) {
//         ;(refreshResult.error.data as { message?: string }).message =
//           'Your login has expired.'
//       }
//       return refreshResult
//     }
//   }

//   return result
// }

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithAuth,
//   tagTypes: [
//     'User',
//     'Post',
//     'Movie',
//     'Room',
//     'Showtime',
//     'Seat',
//     'Cineam',
//     'CinemaComplex',
//     'Invoice',
//   ],
//   endpoints: () => ({}),
// })

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  tagTypes: [
    'User',
    'Post',
    'Movie',
    'Room',
    'Showtime',
    'Seat',
    'Cineam',
    'CinemaComplex',
    'Invoice',
  ],
  endpoints: () => ({}),
})
