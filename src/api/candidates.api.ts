import { axiosPrivate } from '@/api/axios-instance'
import { ApiResponse } from '@/types/api.type'
import { CandidateProfile, Profile } from '@/types/profile.type'

const candidatesApi = {
  updateProfile: async (id: string, profile: CandidateProfile) =>
    (await axiosPrivate.put<ApiResponse<Profile>>(`candidates/${id}`, profile)).data,
  updateAvatar: async (id: string, avatar: File) => {
    const data = new FormData()
    data.append('avatar', avatar)

    return (
      await axiosPrivate.put<ApiResponse<string>>(`candidates/${id}/avatar`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data
  },
}

export default candidatesApi
