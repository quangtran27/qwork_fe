import Applications from '@/pages/profile.tsx/candidate-profile/tabs/applications'
import Introduce from '@/pages/profile.tsx/candidate-profile/tabs/introduce'
import SavedJobs from '@/pages/profile.tsx/candidate-profile/tabs/saved-jobs'
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
    tab: Introduce,
  },
  {
    label: 'Việc làm đã ứng tuyển',
    value: 'applications',
    tab: Applications,
  },
  {
    label: 'Việc làm đã lưu',
    value: 'saved jobs',
    tab: SavedJobs,
  },
]
export const recruiterProfileTabs = ['Tin tuyển dụng']
