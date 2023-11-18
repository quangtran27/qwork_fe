import { UserRoles } from './users.type'

export type ApiResponse<Data> = {
  success: boolean
  message: string
  data: Data
  pagination: PaginationParams
}

export type PaginationParams = {
  numPages: number
  page: number
  total: number
}

export type LoginData = {
  id: string
  name: string
  role: UserRoles
  token: string
}
