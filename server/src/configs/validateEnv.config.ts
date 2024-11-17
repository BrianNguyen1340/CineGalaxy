import { cleanEnv, str, port, num } from 'envalid'

export const validateEnv = () => {
  cleanEnv(process.env, {
    SERVER_URI: str(),
    CLIENT_URI: str(),
    NODE_ENV: str(),
    HOST_NAME: str(),
    PORT: port({ default: 8888 }),
    MONGO_DB_LOCAL_URI: str(),

    JWT_ACCESS_TOKEN_KEY: str(),
    JWT_REFRESH_TOKEN_KEY: str(),
    SESSION_SECRET_KEY: str(),

    EMAIL_PASSWORD: str(),
    EMAIL_USERNAME: str(),

    CLOUDINARY_NAME: str(),
    CLOUDINARY_API_KEY: num(),
    CLOUDINARY_SECRET_KEY: str(),

    CLOUDINARY_URL: str(),

    PAYPAL_CLIENT_ID: str(),
    PAYPAL_SECRET_KEY: str(),

    REDIS_HOST: str(),
    REDIS_PORT: str(),

    UPSTASH_REDIS_URL: str(),

    STRIPE_SECRET_KEYS: str(),
  })
}
