export enum ApplicationStatusEnum {
  Sent = 1,
  Is_Considering = 2,
  Is_Approved = 3,
  Is_Rejected = 4,
}

export type Application = {
  jobId: string
  name: string
  email: string
  phone: string
  cv?: FileList
}

export type ApplicationDetail = {
  id: string
  jobId: string
  jobName: string
  jobSalaryFrom: number
  jobSalaryTo: number
  recruiterUserId: string
  recruiterAvatar: string
  recruiterName: string
  created: string
  updated: string
  name: string
  candidateAvatar: string
  candidateUserId: string
  candidateName: string
  candidatePosition: string
  email: string
  phone: string
  cv: string
  status: ApplicationStatusEnum
}
