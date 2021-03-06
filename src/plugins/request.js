import axios from 'axios'
import qs from 'qs'
import settings from '../settings'
// nprogress展示进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// axios实例
const service = axios.create({
  baseURL: settings.baseUrl,
  timeout: 5000, // request timeout
  paramsSerializer: function (params) {
    return qs.stringify(params, {
      arrayFormat: 'brackets'
    })
  }
})

// 请求的拦截器
service.interceptors.request.use(
  config => {
    NProgress.start()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    NProgress.done()
    // 直接将响应内容返回
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

// 返回axios实例
export default service
