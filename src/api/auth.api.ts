import axios, { axiosAuth, axiosPrivate } from '@/api/axios-instance'
import { CheckResetPasswordCodeSchema, LoginUserSchema, SetNewPasswordSchema } from '@/utils/validators/user'
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
  requestResetPasswordToken: async ({ ...data }: { email: string }) =>
    (await axios.post<ApiResponse<string>>('auth/request-password-reset', { ...data })).data,
  checkRequessPasswordToken: async ({ ...data }: CheckResetPasswordCodeSchema) =>
    (await axios.get<ApiResponse<null>>(`auth/password-reset/${data.token}/${data.email}`)).data,
  doneResetPassword: async ({ ...data }: SetNewPasswordSchema) =>
    (await axios.patch<ApiResponse<null>>('auth/password-reset-done', { ...data })).data,
}

export default authApi
