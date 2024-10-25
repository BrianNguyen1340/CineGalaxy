import { apiSlice } from '~/redux/apiSlice'

// *****************************************************************************

export const userAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query({
      query: (data) => ({
        url: `/api/v1/user/profile`,
        method: 'GET',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/update-profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUserByAdmin: builder.query({
      query: (id) => ({
        url: `/api/v1/user/get-user-by-admin/${id}`,
      }),
    }),
    getAllUsersByAdmin: builder.query({
      query: () => ({
        url: `/api/v1/user/get-all-users-by-admin`,
      }),
    }),
    updateUserByAdmin: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/update-user-by-admin/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    blockAccount: builder.mutation({
      query: (id) => ({
        url: `/api/v1/user/block-account/${id}`,
        method: 'PUT',
      }),
    }),
    unblockAccount: builder.mutation({
      query: (id) => ({
        url: `/api/v1/user/unblock-account/${id}`,
        method: 'PUT',
      }),
    }),
  }),
})

export const {
  useProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersByAdminQuery,
  useGetUserByAdminQuery,
  useUpdateUserByAdminMutation,
  useBlockAccountMutation,
  useUnblockAccountMutation,
} = userAPISlice
