import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/role/page/' + query.page + '/' + query.limit,
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: '/role/read',
    method: 'get',
    params: { id }
  })
}

export function create(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

export function getTreeData(id) {
  return request({
    url: '/getRolePermissionTree',
    method: 'get',
    params: { roleId: id }
  })
}

export function updatePermission(data, id) {
  return request({
    url: '/updateRolePermission',
    method: 'post',
    params: { roleId: id },
    data
  })
}
