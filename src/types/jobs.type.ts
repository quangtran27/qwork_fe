import { ApplicationDetail } from './applications.type'

export type Job = {
  id: string
  name: string
  userId: string
  recruiterId: string
  recruiterName?: string
  recruiterAvatar?: string
  description: string
  cityName: string
  cityCode: number
  salaryFrom: number
  salaryTo: number
  updated: string
  expired: string
  status: boolean
  applications?: ApplicationDetail[]
}

export type UpdateJob = {
  id: string
  status: boolean
  name: string
  description: string
  cityCode: number
  cityName: string
  salaryFrom: number
  salaryTo: number
  expired: string
}
