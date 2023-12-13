import { ApiResponse } from '@/types/api.type'
import { Application, ApplicationDetail, ApplicationStatusEnum } from '@/types/applications.type'
import { axiosPrivate } from './axios-instance'

const applicationsApi = {
  createApplication: async (application: Application, oldCv?: string) => {
    const formData = new FormData()
    formData.append('job_id', application.jobId)
    formData.append('name', application.name)
    formData.append('phone', application.phone)
    formData.append('email', application.email)
    if (oldCv) {
      formData.append('oldCv', oldCv)
    } else if (application.cv instanceof FileList && application.cv.length) {
      formData.append('cv', application.cv[0])
    }

    return (
      await axiosPrivate.post<ApiResponse<ApplicationDetail>>('/applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data
  },
  updateApplicationStatus: async (id: string, status: ApplicationStatusEnum) =>
    (
      await axiosPrivate.put<ApiResponse<ApplicationDetail>>(`/applications/${id}`, {
        status: status,
      })
    ).data,
}

export default applicationsApi
