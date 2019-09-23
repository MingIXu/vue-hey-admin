import request from '@/utils/request'

// 获取用户管理左侧树
export function getOrgTree() {
  return request({
    url: '/user/getOrgTree',
    method: 'get'
  })
}
// 通过用户获取所属角色
export function getUserRole(id) {
  return request({
    url: `user/roles/${id}`,
    method: 'get'
  })
}
// 获取权限管理左侧树
export function getTreeData() {
  return request({
    url: '/permission/getPermissionTree',
    method: 'get'
  })
}
// 获取字典管理左侧树
export function getDicTypeTree() {
  return request({
    url: '/dictionaryType/getDicTypeTree',
    method: 'get'
  })
}
// 获取角色管理左侧树
export function getPermissionsTree(id) {
  return request({
    url: '/getRolePermissionTree',
    method: 'get',
    params: { roleId: id }
  })
}
// 修改权限
export function updatePermission(data, id) {
  return request({
    url: '/updateRolePermission',
    method: 'post',
    params: { roleId: id },
    data
  })
}
