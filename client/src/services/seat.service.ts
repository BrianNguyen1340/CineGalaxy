import { apiSlice } from '~/redux/apiSlice'

export const seatAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSeat: builder.mutation({
      query: (data) => ({
        url: `/api/v1/seat/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getSeat: builder.query({
      query: (id) => ({
        url: `/api/v1/seat/get/${id}`,
      }),
    }),
    getSeats: builder.query({
      query: () => ({
        url: `/api/v1/seat/get-all`,
      }),
    }),
    updateSeat: builder.mutation({
      query: (data) => ({
        url: `/api/v1/seat/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateSeatMutation,
  useGetSeatQuery,
  useGetSeatsQuery,
  useUpdateSeatMutation,
} = seatAPISlice
