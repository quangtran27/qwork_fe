import axios, { axiosPrivate } from '@/api/axios-instance'
import { ApiResponse } from '@/types/api.type'
import { Job } from '@/types/jobs.type'
import { Profile, RecruiterProfile } from '@/types/profile.type'

const recruitersApi = {
  get: async (id: string) => (await axios.get<ApiResponse<Profile>>(`/recruiters/${id}`)).data,
  getAll: async (options?: object) =>
    (await axios.get<ApiResponse<Profile[]>>('/recruiters', { params: options })).data,
  getOutstandingRecruiters: async () => (await axios.get<ApiResponse<Profile[]>>('/recruiters/outstanding')).data,
  getRecruiterJobs: async (id: string, option?: object) =>
    (await axios.get<ApiResponse<Job[]>>(`/recruiters/${id}/jobs`, { params: { ...option } })).data,
  updateProfile: async (id: string, profile: RecruiterProfile) =>
    (await axiosPrivate.put<ApiResponse<Profile>>(`recruiters/${id}`, profile)).data,
  updateAvatar: async (id: string, avatar: File) => {
    const data = new FormData()
    data.append('avatar', avatar)

    return (
      await axiosPrivate.put<ApiResponse<string>>(`recruiters/${id}/avatar`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data
  },
  updateBackground: async (id: string, background: File) => {
    const data = new FormData()
    data.append('background', background)

    return (
      await axiosPrivate.put<ApiResponse<string>>(`recruiters/${id}/background`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data
  },
}

export default recruitersApi
