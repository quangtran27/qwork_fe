import { emptyPagination } from '@/constants/commons.constant'
import { ApiResponse } from '@/types/api.type'

export function emptyResponse<Data>(data: Data): ApiResponse<Data> {
  return {
    success: false,
    message: '',
    data: data,
    pagination: emptyPagination,
  }
}
