import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import { varEnv } from '~/configs/variableEnv'

const firebaseConfig = {
  apiKey: varEnv.VITE_FIREBASE_API_KEY,
  authDomain: varEnv.VITE_AUTH_DOMAIN,
  projectId: varEnv.VITE_PROJECT_ID,
  storageBucket: varEnv.VITE_STORAGE_BUCKET,
  messagingSenderId: varEnv.VITE_MESSAGING_SENDER_ID,
  appId: varEnv.VITE_APP_ID,
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
