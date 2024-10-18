const getEnv = (key: string, defaultValue?: string): string => {
    const value = import.meta.env[key] ?? defaultValue
    if (value === undefined) {
        throw new Error(`Missing environment variable ${key}`)
    }
    return value
}

export const varEnv = {
    // apis
    VITE_ROOT_API: getEnv('VITE_ROOT_API'),
    VITE_AUTH_API: getEnv('VITE_AUTH_API'),
    VITE_REGISTER_API: getEnv('VITE_REGISTER_API'),
    VITE_VERIFY_OTP_REGISTER: getEnv('VITE_VERIFY_OTP_REGISTER'),
    VITE_RESEND_OTP_REGISTER: getEnv('VITE_RESEND_OTP_REGISTER'),
    VITE_LOGIN_API: getEnv('VITE_LOGIN_API'),
    VITE_FORGOT_PASSWORD_API: getEnv('VITE_FORGOT_PASSWORD_API'),
    VITE_RESET_PASSWORD_API: getEnv('VITE_RESET_PASSWORD_API'),
    VITE_LOGOUT_API: getEnv('VITE_LOGOUT_API'),

    // firebase
    VITE_FIREBASE_API_KEY: getEnv('VITE_FIREBASE_API_KEY'),
    VITE_AUTH_DOMAIN: getEnv('VITE_AUTH_DOMAIN'),
    VITE_PROJECT_ID: getEnv('VITE_PROJECT_ID'),
    VITE_STORAGE_BUCKET: getEnv('VITE_STORAGE_BUCKET'),
    VITE_MESSAGING_SENDER_ID: getEnv('VITE_MESSAGING_SENDER_ID'),
    VITE_APP_ID: getEnv('VITE_APP_ID'),
}
