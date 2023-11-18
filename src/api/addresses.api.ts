import axios from '@/api/axios-instance'
import { City } from '@/types/addresses.type'
import { ApiResponse } from '@/types/api.type'

const addressesApi = {
  getAllCities: async () => (await axios.get<ApiResponse<City[]>>('/addresses/cities')).data,
}

export default addressesApi
