// 封装 axios 请求模块
import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net' // 基础路径
})
// 配置请求拦截器
request.interceptors.request.use(function (config) {
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 配置响应拦截器

// 暴露出去
export default request
