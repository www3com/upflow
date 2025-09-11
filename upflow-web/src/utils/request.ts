import { getToken } from '@/utils/session'
import { message } from 'antd/lib'
import axios, { AxiosRequestConfig, RawAxiosRequestHeaders, ResponseType } from 'axios'
import {isBlob} from "@/utils/is";

export const OK = 200
export const ERROR = 500
export const MISSING_PARAMETER = 400
export const UNAUTHORIZED = 401
export const FORBIDDEN = 403
export const NOT_FOUND = 404
export const ILLEGAL_PARAMETER = 901
export const formType = 'form'
export const jsonType = 'json'

interface Options {
  reqType?: 'json' | 'form'
  timeout?: number
  responseType?: ResponseType
}

const parseOptions = (options?: Options): AxiosRequestConfig => {
  let headers: RawAxiosRequestHeaders = {}
  if (options?.reqType !== jsonType) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return { headers, ...options }
}

const redirectUrl = () => {
  const locationRef = self !== top ? parent.location : location
  locationRef.href = '/uc/home'
}

axios.interceptors.request.use(
  function (config) {
    config.headers['NS-TOKEN'] = getToken()
    config.baseURL = '/api'
    config.timeout = config.timeout || 60000
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    if (isBlob(response.data)) {
      return response
    }
    if (response.data?.code !== OK) {
      message.warning(response.data.message)
      return Promise.reject(response.data)
    }
    return response
  },
  function (err) {
    switch (err.response?.status) {
      case UNAUTHORIZED:
        message.error(err.response.data.message)
        redirectUrl()
        break
      case FORBIDDEN:
      case NOT_FOUND:
      case ERROR:
      case MISSING_PARAMETER:
      case ILLEGAL_PARAMETER:
        message.error(err.response.data.message)
        break
      default:
        message.info('请求数据发生错误！')
    }
    return Promise.reject(err)
  }
)

const get = async (url: string, params?: any, options?: Options) => {
  let res = await axios({ method: 'get', url, params, ...options })
  return res.data
}

const post = async (url: string, data?: any, options?: Options) => {
  let res = await axios({ method: 'post', url, data, ...parseOptions(options) })
  return res.data
}

const put = async (url: string, data?: any, options?: Options) => {
  let res = await axios({ method: 'put', url, data, ...parseOptions(options) })
  return res.data
}

const del = async (url: string, data?: any, options?: Options) => {
  let reqConfig: AxiosRequestConfig = { method: 'delete', url, ...parseOptions(options) }
  let params = options?.reqType === formType ? { params: data } : { data }
  let res = await axios({ ...reqConfig, ...params })
  return res.data
}

export default {
  get: get,
  post: post,
  put: put,
  delete: del
}
