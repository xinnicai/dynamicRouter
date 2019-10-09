import request from '@/utils/request'
import axios from 'axios'
import Cookies from 'js-cookie'

export function login(username, password) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      account: username,
      password: password,
      rememberMe: false
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    headers: {"token": Cookies.get('token')},
    params: { token }
  })
}

export function getRouter(roule) {
  console.log(roule)
  if (roule === 'admin') {
    return axios.get(
      // ' https://www.easy-mock.com/mock/5ca8799b4f62671c250622a9/vlogin/user/getRouterAdmin'
      // 'http://localhost:8888/getRouterAdmin'
      'http://10.8.0.165:8081/bimp/resource/menu'
    )
  } else {
    return axios.get(
      ' https://www.easy-mock.com/mock/5ca8799b4f62671c250622a9/vlogin/user/getRouteReditor'
    )
  }
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
