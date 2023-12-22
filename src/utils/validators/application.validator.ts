import { ApplicationStatusEnum } from '@/types/applications.type'
import { InferType, mixed, number, object, string } from 'yup'

export const applicationSchema = object().shape({
  jobId: string().required('Job ID is required'),
  name: string().required('Vui lòng nhập tên ứng cử viên'),
  email: string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phone: string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^(?:\+84|0[3-9])\d{8,9}$/, 'Số điện thoại không đúng định dạng'),
  cv: mixed().test('fileSize', 'File is too large', (value) => {
    if (value instanceof File) {
      return value.size <= 5 * 1024 * 1024 // 5MB
    }
    return true
  }),
})

export const reviewApplicationSchema = object({
  note: string().required('Vui lòng nhập đánh giá để gửi cho ứng cử viên'),
  status: number()
    .required('Vui lòng đánh giá đơn ứng tuyển')
    .oneOf([ApplicationStatusEnum.Is_Approved, ApplicationStatusEnum.Is_Rejected]),
})
export type ReviewApplicationSchema = InferType<typeof reviewApplicationSchema>
