import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
axios.defaults.withCredentials=true
// axios.defaults.retry=4;
// axios.defaults.retryDelay=1000;
// axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//   var config = err.config;
//   // 如果config不存在或未设置重试选项，请拒绝
//   if(!config || !config.retry) return Promise.reject(err);
//   // 设置变量跟踪重试次数
//   config.__retryCount = config.__retryCount || 0;
//   // 检查是否已经达到最大重试总次数
//   if(config.__retryCount >= config.retry) {
//    // 抛出错误信息
//    return Promise.reject(err);
//   }
//   // 增加请求重试次数
//   config.__retryCount += 1;
//   // 创建新的异步请求
//   var backoff = new Promise(function(resolve) {
//    setTimeout(function() {
//     resolve();
//    }, config.retryDelay || 1);
//   });
//   // 返回axios信息，重新请求
//   return backoff.then(function() {
//    return axios(config);
//   });
//  });
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // config.headers['Cookie']='JSESSIONID=64BD5A3E1063AD1A8A709A61CEA1D411; portal=09F631A2B7A6F4A9360A9167241C3980'
    if (store.getters.token) {
      // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.success !== true) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
