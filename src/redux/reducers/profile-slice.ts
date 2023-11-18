import { Profile, ProfileType } from '@/types/profile.type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: Profile = {
  type: ProfileType.guest,
  id: '',
  userId: '',
  name: '',
  phone: '',
  avatar: '',
  background: '',
  description: '',
  address: '',
  position: '',
  gender: '',
  birthDay: '',
  email: '',
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.type = action.payload.type
      state.id = action.payload.id
      state.userId = action.payload.userId
      state.name = action.payload.name
      state.phone = action.payload.phone
      state.avatar = action.payload.avatar
      state.background = action.payload.background
      state.description = action.payload.description
      state.address = action.payload.address
      state.position = action.payload.position
      state.gender = action.payload.gender
      state.birthDay = action.payload.birthDay
      state.email = action.payload.email
    },
    clearProfile: (state) => {
      state.type = initialState.type
      state.id = initialState.id
      state.userId = initialState.userId
      state.name = initialState.name
      state.phone = initialState.phone
      state.avatar = initialState.avatar
      state.background = initialState.background
      state.description = initialState.description
      state.address = initialState.address
      state.position = initialState.position
      state.gender = initialState.gender
      state.birthDay = initialState.birthDay
      state.email = initialState.email
    },
  },
})

export const { setProfile, clearProfile } = profileSlice.actions
export default profileSlice.reducer
