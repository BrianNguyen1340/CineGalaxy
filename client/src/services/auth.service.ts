import { varEnv } from '~/configs/variableEnv'
import { apiSlice } from '~/redux/apiSlice'
import { UserType } from '~/types/user.type'

export const authAPISlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<
            {
                data: any
                message: string
                success: boolean
            },
            { email: string; password: string; name: string }
        >({
            query: (data) => ({
                url: `${varEnv.VITE_ROOT_API}/${varEnv.VITE_AUTH_API}/${varEnv.VITE_REGISTER_API}`,
                method: 'POST',
                body: data,
            }),
        }),
        verifyOTP: builder.mutation<
            { message: string; success: boolean; user: UserType },
            { code: string }
        >({
            query: (data) => ({
                url: `${varEnv.VITE_ROOT_API}/${varEnv.VITE_AUTH_API}/${varEnv.VITE_VERIFY_OTP_REGISTER}`,
                method: 'POST',
                body: data,
            }),
        }),
        resendOTP: builder.mutation({
            query: (data) => ({
                url: `${varEnv.VITE_ROOT_API}/${varEnv.VITE_AUTH_API}/${varEnv.VITE_RESEND_OTP_REGISTER}`,
                method: 'POST',
                body: data,
            }),
        }),
        googleLogin: builder.mutation<
            {
                accessToken: string
                refreshToken: string
                user: UserType
                message: string
                success: boolean
                data: any
            },
            {
                email: string
                name: string
                photoURL: string
            }
        >({
            query: (data) => ({
                url: `/api/v1/auth/google-login`,
                method: 'POST',
                body: data,
            }),
        }),
        login: builder.mutation<
            {
                accessToken: string
                refreshToken: string
                user: UserType
                message: string
                success: boolean
                data: any
            },
            { email: string; password: string }
        >({
            query: (data) => ({
                url: `${varEnv.VITE_ROOT_API}/${varEnv.VITE_AUTH_API}/${varEnv.VITE_LOGIN_API}`,
                method: 'POST',
                body: data,
            }),
        }),
        forgotPassword: builder.mutation<
            { message: string; success: boolean; token: string },
            { email: string }
        >({
            query: (data) => ({
                url: `${varEnv.VITE_ROOT_API}/${varEnv.VITE_AUTH_API}/${varEnv.VITE_FORGOT_PASSWORD_API}`,
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation<
            {
                message: string
                success: boolean
            },
            { token: string; password: string }
        >({
            query: ({ token, password }) => ({
                url: `/api/v1/auth/reset-password/${token}`,
                method: 'POST',
                body: password,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${varEnv.VITE_ROOT_API}/${varEnv.VITE_AUTH_API}/${varEnv.VITE_LOGOUT_API}`,
                method: 'POST',
            }),
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
