import { boolean, number, object, string } from 'yup'

export const updateJobSchema = object({
  id: string().required(),
  status: boolean().required(),
  name: string().required('Vui lòng nhập tên công việc'),
  description: string().required('Vui lòng nhập mô tả công việc'),
  cityCode: number().required(),
  cityName: string().required(),
  salaryFrom: number().required(),
  salaryTo: number().required(),
  expired: string().required(),
})
