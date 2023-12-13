import CandidateApplications from '@/components/CandidateApplications'
import CandidateIntroduce from '@/components/CandidateIntroduce'
import CandidateSavedJobs from '@/components/CandidateSavedJobs'
import RecruiterIntroduce from '@/components/RecruiterIntroduce'
import RecruiterJobs from '@/components/RecruiterJobs'
import { Profile, ProfileTab, ProfileType } from '@/types/profile.type'
import { faAddressCard, faBookmark, faBriefcase } from '@fortawesome/free-solid-svg-icons'

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

export const candidateProfileTabs: ProfileTab[] = [
  {
    label: 'Trang cá nhân',
    value: 'personal',
    icon: faAddressCard,
    tab: CandidateIntroduce,
    isPrivate: false,
  },
  {
    label: 'Đơn ứng tuyển',
    value: 'applications',
    icon: faBriefcase,
    tab: CandidateApplications,
    isPrivate: true,
  },
  {
    label: 'Việc làm đã lưu',
    value: 'saved-jobs',
    icon: faBookmark,
    tab: CandidateSavedJobs,
    isPrivate: true,
  },
]

export const recruiterProfileTabs: ProfileTab[] = [
  {
    label: 'Tin tuyển dụng',
    value: 'jobs',
    icon: faBriefcase,
    tab: RecruiterJobs,
    isPrivate: false,
  },
  {
    label: 'Trang cá nhân',
    value: 'personal',
    icon: faAddressCard,
    tab: RecruiterIntroduce,
    isPrivate: false,
  },
]
