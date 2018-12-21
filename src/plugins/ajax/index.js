import axios from 'axios'
import qs from 'qs'
export default {
  install (Vue) {
    Vue.prototype.$http = axios
    Vue.http = axios
  },
  $http: axios
}
// 修改默认的请求模式和格式化数据
axios.interceptors.request.use(function (config) {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  if (config.method === 'post') {
    config.data = qs.stringify({
      ...config.data
    })
  }
  return config
}, function (error) {
  // loadinginstace.close()
  return Promise.reject(error)
})
export const $http = axios
