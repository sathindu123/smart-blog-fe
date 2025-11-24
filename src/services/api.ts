// axiosConfig.ts
// apiService.ts
// api.ts
import axios, { AxiosError } from "axios"

import { refreshTokens } from "./auth"

const api = axios.create({
  baseURL: "https://smart-blog-be-xi.vercel.app/api/v1"
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (err: AxiosError) => {
    const originalRequst: any = err.config

    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
     originalRequst.url?.includes(url)
    )


    if(err.response?.status === 401 && !isPublic && !originalRequst._retry){
      originalRequst._retry = true
      try{
        const refreshToken = localStorage.getItem("refreshToken")
        if(!refreshToken){
          throw new Error("no refresh token vailable")
        }
        const res = await refreshTokens(refreshToken)
        localStorage.set("accessToken", res.accessToken)

        originalRequst.headers.Authorization = `Bearer ${res.accessToken}`

        axios(originalRequst) 
      }
      catch(err){

      }
    }
    return Promise.reject(err)
  }
)

// api.interceptors.response.use()

export default api
