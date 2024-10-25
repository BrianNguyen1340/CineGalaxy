import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { apiSlice } from '~/redux/apiSlice'
import userReducer from './user.reducer'

// *****************************************************************************

const userPersistConfig = {
  key: 'user',
  storage,
}

const persistedUserReducer = persistReducer(userPersistConfig, userReducer)

export const rootReducer = combineReducers({
  user: persistedUserReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})
