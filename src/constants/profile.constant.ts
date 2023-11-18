import { Profile, ProfileType } from '@/types/profile.type'

export const emptyProfile: Profile = {
  type: ProfileType.guest,
  id: '',
  userId: '',
  name: '',
  phone: '',
  avatar: '',
  background: '',
  description: '',
  address: '',
  position: '',
  gender: '',
  birthDay: '',
  email: '',
}

export const candidateProfileTabs = [
  {
    label: 'Thông tin cá nhân',
    value: 'personal',
  },
  {
    label: 'Đơn ứng tuyển',
    value: 'applications',
  },
]
export const recruiterProfileTabs = ['Tin tuyển dụng']
