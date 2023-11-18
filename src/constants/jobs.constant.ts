import { Job, UpdateJob } from '@/types/jobs.type'
import { nationwide } from './location.constant'

const emptyJobDescription =
  '{"blocks":[{"key":"b1n3k","text":"Nhập mô tả cho công việc của bạn tại đây!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'

export const emptyJob: Job = {
  id: '',
  name: '',
  userId: '',
  recruiterId: '',
  recruiterName: '',
  recruiterAvatar: '',
  description: emptyJobDescription,
  cityName: '',
  cityCode: 0,
  salaryFrom: 0,
  salaryTo: 0,
  updated: '',
  expired: '',
  status: false,
}

export const emptyUpdateJob: UpdateJob = {
  id: '-1',
  status: true,
  name: '',
  description: emptyJobDescription,
  cityCode: nationwide.code,
  cityName: nationwide.name,
  salaryFrom: 1,
  salaryTo: 10,
  expired: new Date().toISOString().split('T')[0],
}
