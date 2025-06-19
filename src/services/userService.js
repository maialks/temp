import axios from 'axios'
const baseUrl = '/api/users'

export const register = async (userData) => {
  const res = await axios.post(baseUrl, userData)
  return res.data
}
