import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/login',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function getPermissionByUserId() {
  return request({
    url: '/getPermissionByUserId',
    method: 'get',
    params: {}
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function refreshToken() {
  return request({
    url: '/refreshToken',
    method: 'get'
  })
}
