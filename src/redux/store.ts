import authReducer from '@/redux/reducers/auth-slice'
import profileReducer from '@/redux/reducers/profile-slice'
import searchHistoryReducer from '@/redux/reducers/search-history'
import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    searchHistory: searchHistoryReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
