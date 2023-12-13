import { User, UserRoles } from '@/types/users.type'

export const emptyUser: User = {
  id: '',
  name: '',
  phone: '',
  email: '',
  password: '',
  role: UserRoles.candidate,
  isActive: false,
}

export const recruiter = {
  id: '1',
  name: 'Trần Văn Quảng',
  phone: '0336699075',
  email: 'quang@gmail.com',
  password: '',
  role: UserRoles.recruiter,
}

export const candidate = {
  id: '2',
  name: 'Candidate Name',
  phone: '987-654-3210',
  email: 'candidate@example.com',
  password: 'candidatepassword',
  role: UserRoles.candidate,
}
