import { ApiResponse } from '@/types/api.type'
import { Profile } from '@/types/profile.type'
import { User } from '@/types/users.type'
import axios, { axiosPrivate } from './axios-instance'
import { ApplicationDetail } from '@/types/applications.type'

const userApi = {
  createUser: async (user: User) => (await axios.post<ApiResponse<User>>('users/', user)).data,
  getProfile: async (userId: string) => (await axiosPrivate.get<ApiResponse<Profile>>(`users/${userId}/profile`)).data,
  getApplications: async (userId: string) =>
    (await axiosPrivate.get<ApiResponse<ApplicationDetail[]>>(`users/${userId}/applications`)).data,
}

export default userApi
