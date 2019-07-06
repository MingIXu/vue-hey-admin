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

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}