import 'dotenv/config'

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`)
  }
  return value
}

export const varEnv = {
  SERVER_URI: getEnv('SERVER_URI'),
  CLIENT_URI: getEnv('CLIENT_URI'),
  NODE_ENV: getEnv('NODE_ENV'),
  HOST_NAME: getEnv('HOST_NAME'),
  PORT: getEnv('PORT'),
  MONGO_DB_LOCAL_URI: getEnv('MONGO_DB_LOCAL_URI'),

  JWT_ACCESS_TOKEN_KEY: getEnv('JWT_ACCESS_TOKEN_KEY'),
  JWT_REFRESH_TOKEN_KEY: getEnv('JWT_REFRESH_TOKEN_KEY'),
  SESSION_SECRET_KEY: getEnv('SESSION_SECRET_KEY'),

  EMAIL_PASSWORD: getEnv('EMAIL_PASSWORD'),
  EMAIL_USERNAME: getEnv('EMAIL_USERNAME'),

  CLOUDINARY_NAME: getEnv('CLOUDINARY_NAME'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_SECRET_KEY: getEnv('CLOUDINARY_SECRET_KEY'),
  CLOUDINARY_URL: getEnv('CLOUDINARY_URL'),

  PAYPAL_CLIENT_ID: getEnv('PAYPAL_CLIENT_ID'),
  PAYPAL_SECRET_KEY: getEnv('PAYPAL_SECRET_KEY'),

  REDIS_HOST: getEnv('REDIS_HOST'),
  REDIS_PORT: getEnv('REDIS_PORT'),

  UPSTASH_REDIS_URL: getEnv('UPSTASH_REDIS_URL'),

  STRIPE_SECRET_KEYS: getEnv('STRIPE_SECRET_KEYS'),
}
