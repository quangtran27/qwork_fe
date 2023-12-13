import { store } from '@/redux/store'
import { ApplicationStatusEnum } from '@/types/applications.type'
import { ProfileType } from '@/types/profile.type'

export const applicationStatusToString = (status: ApplicationStatusEnum) => {
  const isRecruiter = store.getState().profile.type === ProfileType.recruiter
  switch (status) {
    case ApplicationStatusEnum.Sent:
      return [isRecruiter ? 'Chưa xem' : 'Đã gửi', 'badge badge-info']
    case ApplicationStatusEnum.Is_Considering:
      return [isRecruiter ? 'Đã xem' : 'NTD đã xem', 'badge badge-warning']
    case ApplicationStatusEnum.Is_Approved:
      return ['Hồ sơ phù hợp', 'badge badge-success']
    case ApplicationStatusEnum.Is_Rejected:
      return ['Hồ sơ chưa phù hợp', 'badge badge-error']
  }
}
