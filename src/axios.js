/* eslint-disable no-undef */
import axios from "axios"
import { message } from "antd"

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`
})

const getToken = () => {
  return localStorage.getItem("token")
}

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
    //return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        message.error(error.response.data.error)
      }
      if (error.response.status === 403) {
        message.error(error.response.data.error)
        localStorage.removeItem("token")
      }
      return Promise.reject(error)
      //return error
    }
    //return error
    return Promise.reject(error)
  }
)

export default instance
