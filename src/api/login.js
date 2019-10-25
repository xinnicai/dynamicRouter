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

export function getPermission(){
  return request({
    url: 'current/activeRolePermissions',
    method: 'get',
  })
}

export function getRouter(roule) {
  if (roule === 'admin') {
    return request({
      url: 'resource/menu',
      method: 'get',
    })
    // return axios.get(
    //   // ' https://www.easy-mock.com/mock/5ca8799b4f62671c250622a9/vlogin/user/getRouterAdmin'
    //   // 'http://localhost:8888/getRouterAdmin'
    //   'http://localhost:8081/bimp/resource/menu'
    // )
  } else {
    return request({
      url: 'resource/menu',
      method: 'get',
    })
  }
}


export function logout() {
  return request({
    url: 'http://10.8.0.143:7080/cas/logout',
    method: 'get'
  })
}
