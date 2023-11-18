import axios, { axiosPrivate } from '@/api/axios-instance'
import { ApiResponse } from '@/types/api.type'
import { ApplicationDetail } from '@/types/applications.type'
import { Job, UpdateJob } from '@/types/jobs.type'

const jobsApi = {
  get: async (id: string) => (await axios.get<ApiResponse<Job>>(`/jobs/${id}`)).data,
  getAll: async (option?: object) => (await axios.get<ApiResponse<Job[]>>('/jobs', { params: { ...option } })).data,
  getOutstandingJobs: async () => (await axios.get<ApiResponse<Job[]>>('/jobs/outstanding')).data,
  getJobApplications: async (id: string) =>
    (await axiosPrivate.get<ApiResponse<ApplicationDetail[]>>(`/jobs/${id}/applications`)).data,
  createJob: async (job: UpdateJob) => (await axiosPrivate.post<ApiResponse<Job>>('/jobs/', job)).data,
  updateJob: async (job: UpdateJob) => (await axiosPrivate.put<ApiResponse<Job>>(`/jobs/${job.id}`, job)).data,
  delete: async (id: string) => (await axiosPrivate.delete<ApiResponse<string>>(`/jobs/${id}`)).data,
}

export default jobsApi
