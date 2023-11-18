export enum UserRoles {
  admin = 'admin',
  staff = 'staff',
  recruiter = 'recruiter',
  candidate = 'candidate',
  guest = 'guest',
}

export type User = {
  id: string
  name: string
  phone: string
  email: string
  password: string
  role: UserRoles
}

export type LoginUser = {
  email: string
  password: string
  role: UserRoles
}
