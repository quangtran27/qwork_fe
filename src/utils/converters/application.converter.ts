import { ApplicationStatusEnum } from '@/types/applications.type'

export const applicationStatusToString = (status: ApplicationStatusEnum) => {
  switch (status) {
    case ApplicationStatusEnum.Sent:
      return ['Đã gửi', 'badge badge-info']
    case ApplicationStatusEnum.Is_Considering:
      return ['Đã xem', 'badge badge-warning']
    case ApplicationStatusEnum.Is_Approved:
      return ['Đã liên hệ', 'badge badge-success']
    case ApplicationStatusEnum.Is_Rejected:
      return ['Đã bị từ chối', 'badge badge-error']
  }
}
