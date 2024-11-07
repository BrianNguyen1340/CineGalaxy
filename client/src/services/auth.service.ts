import { apiSlice } from '~/redux/apiSlice'
// import { logout } from '~/redux/reducers/user.reducer'

export const authAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/register`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/verify-otp-register`,
        method: 'POST',
        body: data,
      }),
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/resend-otp-register`,
        method: 'POST',
        body: data,
      }),
    }),
    googleLogin: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/google-login`,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/login`,
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/api/v1/auth/reset-password/${token}`,
        method: 'POST',
        body: password,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/api/v1/auth/logout`,
        method: 'POST',
      }),
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled
      //     dispatch(logout())
      //     setTimeout(() => {
      //       dispatch(apiSlice.util.resetApiState())
      //     }, 1000)
      //   } catch (error: any) {
      //     console.log(error)
      //   }
      // },
    }),
    checkEmailExist: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/check-email-exist',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useCheckEmailExistMutation,
  useGoogleLoginMutation,
} = authAPISlice
