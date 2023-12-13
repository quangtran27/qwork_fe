import axios, { axiosAuth, axiosPrivate } from '@/api/axios-instance'
import { EmailSchema, LoginUserSchema, ResetPasswordSchema } from '@/utils/validators/user.validator'
import { ApiResponse, LoginData } from '../types/api.type'

const authApi = {
  login: async (loginUser: LoginUserSchema) =>
    (await axios.post<ApiResponse<LoginData>>('auth/login', loginUser, { withCredentials: true })).data,
  logout: async () => (await axiosAuth.post<ApiResponse<undefined>>('auth/logout', { withCredentials: true })).data,
  refreshToken: async () =>
    (
      await axiosAuth.post<ApiResponse<LoginData>>('auth/refresh-token', {
        withCredentials: true,
      })
    ).data,
  changePassword: async ({ ...data }: { oldPassword: string; newPassword: string }) =>
    (
      await axiosPrivate.put<ApiResponse<undefined>>('auth/change-password', {
        ...data,
      })
    ).data,
  requestResetPasswordToken: async (data: EmailSchema) =>
    (await axios.post<ApiResponse<string>>('auth/reset-password', data)).data,
  resetPassword: async (data: ResetPasswordSchema) =>
    (await axios.patch<ApiResponse<null>>('auth/reset-password', data)).data,
}

export default authApi
