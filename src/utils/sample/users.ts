import { User, UserRoles } from '@/types/users.type'

export const emptyUser = {
  id: '0',
  name: '',
  phone: '',
  email: '',
  password: '',
  role: UserRoles.candidate,
}

export const recruiter: User = {
  id: '1',
  name: 'Trần Văn Quảng',
  phone: '0336699075',
  email: 'quang@gmail.com',
  password: '',
  role: UserRoles.recruiter,
}

export const candidate: User = {
  id: '2',
  name: 'Candidate Name',
  phone: '987-654-3210',
  email: 'candidate@example.com',
  password: 'candidatepassword',
  role: UserRoles.candidate,
}
