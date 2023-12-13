import { LoginData } from '@/types/api.type'
import { emptyUser } from '@/utils/sample/users'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type AuthState = LoginData

const initialState: AuthState = {
  token: '',
  user: emptyUser,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<AuthState>) => {
      const { token, user } = { ...action.payload }
      state.token = token
      state.user.id = user.id
      state.user.name = user.name
      state.user.phone = user.phone
      state.user.email = user.email
      state.user.password = user.password
      state.user.role = user.role
      state.user.isActive = user.isActive
    },
    clearCredential: (state) => {
      const { user, token } = { ...initialState }
      state.token = token
      state.user.id = user.id
      state.user.name = user.name
      state.user.phone = user.phone
      state.user.email = user.email
      state.user.password = user.password
      state.user.role = user.role
      state.user.isActive = user.isActive
    },
  },
})

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectProfile = (state: RootState) => state.profile

export const { setCredential, clearCredential } = authSlice.actions
export default authSlice.reducer
