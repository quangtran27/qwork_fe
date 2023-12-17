import routes from '@/configs/route.config'
import { MenuItem } from '@/types/header.type'

export const menuItems: MenuItem[] = [
  {
    label: 'Việc làm',
    to: routes.jobs,
  },
  {
    label: 'Nhà tuyển dụng',
    to: routes.recruiters,
  },
]

export const recruiterMenuItems: MenuItem[] = [
  {
    label: 'Ứng cử viên',
    to: routes.candidate,
  },
]
