import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/permission/page/' + query.page + '/' + query.limit,
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: '/permission/read',
    method: 'get',
    params: { id }
  })
}

export function createOrUpdate(data) {
  return request({
    url: '/permission/createOrUpdate',
    method: 'post',
    data
  })
}

export function getTreeData() {
  return request({
    url: '/permission/getPermissionTree',
    method: 'get'
  })
}
