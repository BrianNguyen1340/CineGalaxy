import { apiSlice } from '~/redux/apiSlice'

export const cinemaComplexAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCinemaComplex: builder.mutation({
      query: (data) => ({
        url: `/api/v1/cinema-complex/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getCinemaComplex: builder.query({
      query: (id) => ({
        url: `/api/v1/cinema-complex/get/${id}`,
      }),
    }),
    getCinemaComplexes: builder.query({
      query: () => ({
        url: `/api/v1/cinema-complex/get-all`,
      }),
    }),
    updateCinemaComplex: builder.mutation({
      query: (data) => ({
        url: `/api/v1/cinema-complex/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateCinemaComplexMutation,
  useGetCinemaComplexQuery,
  useGetCinemaComplexesQuery,
  useUpdateCinemaComplexMutation,
} = cinemaComplexAPISlice
