import { apiSlice } from '~/redux/apiSlice'

export const comboAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCombo: builder.mutation({
      query: (data) => ({
        url: `/api/v1/combo/create`,
        method: 'POST',
        body: data,
      }),
    }),
    getCombo: builder.query({
      query: (id) => ({
        url: `/api/v1/combo/get/${id}`,
      }),
    }),
    getCombos: builder.query({
      query: () => ({
        url: `/api/v1/combo/get-all`,
      }),
    }),
    updateCombo: builder.mutation({
      query: (data) => ({
        url: `/api/v1/combo/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    uploadCombo: builder.mutation({
      query: (data) => ({
        url: `/api/v1/upload/combo`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useCreateComboMutation,
  useGetComboQuery,
  useGetCombosQuery,
  useUpdateComboMutation,
  useUploadComboMutation,
} = comboAPISlice
