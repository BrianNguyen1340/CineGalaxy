import { apiSlice } from '~/redux/apiSlice'

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
    getUser: builder.query({
      query: (id) => ({
        url: `/api/v1/user/get-user-by-admin/${id}`,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `/api/v1/user/get-all-users-by-admin`,
      }),
    }),
    updateUser: builder.mutation({
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
    createUser: builder.mutation({
      query: (data) => ({
        url: `/api/v1/user/create-user`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useProfileQuery,
  useUpdateProfileMutation,
  useGetUserQuery,
  useBlockAccountMutation,
  useUnblockAccountMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} = userAPISlice
