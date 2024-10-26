import { apiSlice } from '~/redux/apiSlice'

// *****************************************************************************

export const genreAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGenre: builder.mutation({
      query: (data) => ({
        url: `/api/v1/genre/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getGenre: builder.query({
      query: (id) => ({
        url: `/api/v1/genre/get/${id}`,
      }),
    }),
    getAllGenres: builder.query({
      query: () => ({
        url: `/api/v1/genre/get-all`,
      }),
    }),
    updateGenre: builder.mutation({
      query: (data) => ({
        url: `/api/v1/genre/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateGenreMutation,
  useGetAllGenresQuery,
  useGetGenreQuery,
  useUpdateGenreMutation,
} = genreAPISlice
