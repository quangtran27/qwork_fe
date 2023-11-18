export enum ProfileType {
  candidate = 'candidate',
  recruiter = 'recruiter',
  guest = 'guest',
}

export enum Gender {
  male = 'male',
  female = 'female',
}

export const genderOptions = [
  { label: 'Nam', value: Gender.male },
  { label: 'Nữ', value: Gender.female },
]

export const roleOptions = [
  { label: 'Ứng cử viên', value: ProfileType.candidate },
  { label: 'Nhà tuyển dụng', value: ProfileType.recruiter },
]

export enum UpdateProfileAction {
  updateProfile = 'udpate-profile',
  updateAvatar = 'update-avatar',
  updateBackground = 'update-background',
  updatePassword = 'update-password',
}

export type Profile = {
  type: ProfileType
  id: string
  userId: string
  name: string
  phone: string
  avatar: string
  background: string
  description: string
  address: string
  position?: string
  gender?: string
  birthDay?: string
  email: string
}

export type CandidateProfile = {
  name: string
  phone: string
  description: string
  address: string
  position: string
  gender: string
  birthDay: string
  email: string
}

export type RecruiterProfile = {
  name: string
  description: string
  phone: string
  email: string
  address: string
}
