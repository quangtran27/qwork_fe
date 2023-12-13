import { UserRoles } from '@/types/users.type'
import { InferType, object, ref, string } from 'yup'

export const userSchema = object({
  id: string().required(),
  name: string().required('Vui lòng điền họ tên'),
  phone: string()
    .required('Vui lòng điền số điện thoại')
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, 'Số điện thoại không đúng định dạng'),
  email: string().required('Vui lòng điền email').email('Email không đúng định dạng'),
  password: string().required('Vui lòng điền mật khẩu'),
  role: string()
    .required('Vui lòng chọn quyền người dùng')
    .oneOf(
      (Object.values(UserRoles) as string[]).filter((e) => e !== UserRoles.admin && e !== UserRoles.guest),
      'Vui lòng chọn quyền người dùng',
    ),
})

export const loginUserSchema = object({
  email: string().required('Vui lòng điền email').email('Email không đúng định dạng'),
  password: string().required('Vui lòng điền mật khẩu'),
  role: string()
    .required('Vui lòng chọn quyền người dùng')
    .oneOf(
      (Object.values(UserRoles) as string[]).filter((e) => e !== UserRoles.admin && e !== UserRoles.guest),
      'Vui lòng chọn quyền người dùng',
    ),
})
export type LoginUserSchema = InferType<typeof loginUserSchema>

export const updatePasswordSchema = object({
  oldPassword: string().required('Vui lòng điền mật khẩu cũ'),
  newPassword: string()
    .required('Vui lập điền mật khẩu mới')
    .notOneOf([ref('oldPassword')], 'Mật khẩu mới không được trùng với mật khẩu cũ'),
})
export type UpdatePasswordSchema = InferType<typeof updatePasswordSchema>

export const emailSchema = object({
  email: string().required('Vui lòng nhập email').email('Vui lòng nhập đúng định dạng email'),
})
export type EmailSchema = InferType<typeof emailSchema>

export const checkResetPasswordCodeSchema = object({
  email: string().required().email(),
  token: string().required('Vui lòng nhập mã xác nhận'),
})
export type CheckResetPasswordCodeSchema = InferType<typeof checkResetPasswordCodeSchema>

export const resetPasswordSchema = object({
  email: string().required().email(),
  token: string().required('Vui lòng nhập mã xác nhận'),
  password: string().required('Vui lòng điền mật khẩu').min(8, 'Mật khẩu dài tối thiểu 8 ký tự'),
})
export type ResetPasswordSchema = InferType<typeof resetPasswordSchema>

export const updateUserInfoSchema = object({
  name: string().required('Vui lòng điền họ tên'),
  phone: string()
    .required('Vui lòng điền số điện thoại')
    .matches(/^(?:\+84|0[3-9])\d{8,9}$/, 'Số điện thoại không đúng định dạng'),
})
export type UpdateUserInfoSchema = InferType<typeof updateUserInfoSchema>
