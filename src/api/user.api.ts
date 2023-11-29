import { ApiResponse } from '@/types/api.type'
import { ApplicationDetail } from '@/types/applications.type'
import { Job } from '@/types/jobs.type'
import { Profile } from '@/types/profile.type'
import { User } from '@/types/users.type'
import axios, { axiosPrivate } from './axios-instance'

const userApi = {
  createUser: async (user: User) => (await axios.post<ApiResponse<User>>('users/', user)).data,
  getProfile: async (userId: string) => (await axiosPrivate.get<ApiResponse<Profile>>(`users/${userId}/profile`)).data,
  getApplications: async (userId: string) =>
    (await axiosPrivate.get<ApiResponse<ApplicationDetail[]>>(`users/${userId}/applications`)).data,
  getSavedJobs: async (userId: string) =>
    (await axiosPrivate.get<ApiResponse<Job[]>>(`users/${userId}/saved-jobs`)).data,
  saveJob: async (userId: string, jobId: string, action: 'add' | 'remove') =>
    (await axiosPrivate.patch<ApiResponse<Job[]>>(`users/${userId}/saved-jobs`, { jobId: jobId, action: action })).data,
}

export default userApi
