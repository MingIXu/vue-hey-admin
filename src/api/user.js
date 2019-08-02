import request from '@/utils/request'

export function fetchList(query) {
  const params = Object.assign({}, query)
  delete params.current
  delete params.pageSize
  return request({
    url: '/user/page/' + query.current + '/' + query.pageSize,
    method: 'get',
    params: params
  })
}

export function fetchUser(id) {
  return request({
    url: '/user/read',
    method: 'get',
    params: { id }
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function getOrgTree() {
  return request({
    url: '/user/getOrgTree',
    method: 'get'
  })
}

export function getUserRole(id) {
  return request({
    url: `user/roles/${id}`,
    method: 'get'
  })
}
