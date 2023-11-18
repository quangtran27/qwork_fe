import { LoginData } from '@/types/api.type'
import { UserRoles } from '@/types/users.type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type AuthState = LoginData

const initialState: AuthState = {
  id: '',
  role: UserRoles.guest,
  token: '',
  name: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<AuthState>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.role = action.payload.role
      state.token = action.payload.token
    },
    clearCredential: (state) => {
      state.id = initialState.id
      state.name = initialState.name
      state.role = initialState.role
      state.token = initialState.id
    },
  },
})

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectProfile = (state: RootState) => state.profile

export const { setCredential, clearCredential } = authSlice.actions
export default authSlice.reducer
