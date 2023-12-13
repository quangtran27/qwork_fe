import { ApiResponse } from '@/types/api.type'
import { ApplicationDetail } from '@/types/applications.type'
import { Job } from '@/types/jobs.type'
import { Profile } from '@/types/profile.type'
import { User } from '@/types/users.type'
import { UpdateUserInfoSchema } from '@/utils/validators/user.validator'
import axios, { axiosPrivate } from './axios-instance'

const userApi = {
  createUser: async (user: User) => (await axios.post<ApiResponse<User>>('users/', user)).data,
  getProfile: async (userId: string) => (await axiosPrivate.get<ApiResponse<Profile>>(`users/${userId}/profile`)).data,
  getApplications: async (userId: string) =>
    (await axiosPrivate.get<ApiResponse<ApplicationDetail[]>>(`users/${userId}/applications`)).data,
  getSavedJobs: async (userId: string) =>
    (await axiosPrivate.get<ApiResponse<Job[]>>(`users/${userId}/saved-jobs`)).data,
  getCVs: async (userId: string) => (await axiosPrivate.get<ApiResponse<string[]>>(`users/${userId}/cvs`)).data,
  saveJob: async (userId: string, jobId: string, action: 'add' | 'remove') =>
    (await axiosPrivate.patch<ApiResponse<Job[]>>(`users/${userId}/saved-jobs`, { jobId: jobId, action: action })).data,
  updateInfo: async (id: string, data: UpdateUserInfoSchema) =>
    (await axiosPrivate.patch<ApiResponse<User>>(`users/${id}/info`, data)).data,
  activeUser: async (email: string, token: string) =>
    (await axios.patch<ApiResponse<null>>(`users/active/${email}/${token}`)).data,
  sendActivateEmail: async (email: string) =>
    (await axiosPrivate.get<ApiResponse<null>>(`users/${email}/send-active-email`)).data,
}

export default userApi
