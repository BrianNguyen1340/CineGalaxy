import { apiSlice } from '~/redux/apiSlice'

export const showtimeAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createShowtime: builder.mutation({
      query: (data) => ({
        url: `/api/v1/showtime/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getShowtime: builder.query({
      query: (id) => ({
        url: `/api/v1/showtime/get/${id}`,
      }),
    }),
    getShowtimes: builder.query({
      query: () => ({
        url: `/api/v1/showtime/get-all`,
      }),
    }),
    updateShowtime: builder.mutation({
      query: (data) => ({
        url: `/api/v1/showtime/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    hideShowtime: builder.mutation({
      query: (id) => ({
        url: `/api/v1/showtime/hide/${id}`,
        method: 'PUT',
      }),
    }),
    showShowtime: builder.mutation({
      query: (id) => ({
        url: `/api/v1/showtime/show/${id}`,
        method: 'PUT',
      }),
    }),
  }),
})

export const {
  useCreateShowtimeMutation,
  useGetShowtimeQuery,
  useGetShowtimesQuery,
  useUpdateShowtimeMutation,
  useHideShowtimeMutation,
  useShowShowtimeMutation,
} = showtimeAPISlice
