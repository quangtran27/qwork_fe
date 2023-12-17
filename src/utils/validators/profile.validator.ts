import { boolean, object, string } from 'yup'

export const candidateProfileSchema = object({
  name: string().required(),
  phone: string().required(),
  description: string().required(),
  address: string().required(),
  position: string().required(),
  gender: string().required(),
  birthDay: string().required(),
  email: string().required(),
  available: boolean().required(),
})

export const recruiterProfileSchema = object({
  name: string().required(),
  phone: string().required(),
  description: string().required(),
  address: string().required(),
  email: string().required(),
})
