import { apiSlice } from '~/redux/apiSlice'

export const movieAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMovie: builder.mutation({
      query: (data) => ({
        url: `/api/v1/movie/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getMovie: builder.query({
      query: (id) => ({
        url: `/api/v1/movie/get/${id}`,
      }),
    }),
    getMovies: builder.query({
      query: () => ({
        url: `/api/v1/movie/get-all`,
      }),
    }),
    updateMovie: builder.mutation({
      query: (data) => ({
        url: `/api/v1/movie/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    hideMovie: builder.mutation({
      query: (id) => ({
        url: `/api/v1/movie/hide/${id}`,
        method: 'PUT',
      }),
    }),
    showMovie: builder.mutation({
      query: (id) => ({
        url: `/api/v1/movie/show/${id}`,
        method: 'PUT',
      }),
    }),
  }),
})

export const {
  useCreateMovieMutation,
  useGetMoviesQuery,
  useGetMovieQuery,
  useUpdateMovieMutation,
  useHideMovieMutation,
  useShowMovieMutation,
} = movieAPISlice
