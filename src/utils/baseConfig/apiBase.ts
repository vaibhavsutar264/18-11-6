import axios from 'axios'

const API_URL = axios.create({
  baseURL: 'http://localhost:4000',
})

API_URL.interceptors.request.use(
  async (config: any) => {
    return config
  },
  (error: any) => {
    if (error.response.status === 401) {
      console.log('Unauthorized, logging out ...')
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

API_URL.interceptors.response.use(
  (res) => {
    if (res.status === 201) {
      console.log('Successful')
    }
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)

export const setHttpToken = (token: string | undefined) => {
  if (token) {
    API_URL.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    API_URL.defaults.headers.common['Authorization'] = ''
  }
}
export default API_URL
