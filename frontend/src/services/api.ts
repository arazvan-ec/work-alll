import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const apiError = error.response.data
      return Promise.reject(apiError)
    }
    return Promise.reject({ error: 'Network error. Please check your connection.' })
  }
)

export default api
