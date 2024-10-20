const getEnv = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] ?? defaultValue
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`)
  }
  return value
}

export const varEnv = {
  // firebase
  VITE_FIREBASE_API_KEY: getEnv('VITE_FIREBASE_API_KEY'),
  VITE_AUTH_DOMAIN: getEnv('VITE_AUTH_DOMAIN'),
  VITE_PROJECT_ID: getEnv('VITE_PROJECT_ID'),
  VITE_STORAGE_BUCKET: getEnv('VITE_STORAGE_BUCKET'),
  VITE_MESSAGING_SENDER_ID: getEnv('VITE_MESSAGING_SENDER_ID'),
  VITE_APP_ID: getEnv('VITE_APP_ID'),
}
