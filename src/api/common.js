import request from '@/utils/request'

/**
 * @param { String } port 接口名称
 * @param { Object } params 接口参数(get请求)
 * @param { Object } data 接口参数(post请求)
 * @param { Number } id 某条数据ID
 * import { list, create, remove, update, read } from '@/api/common' 快捷引入方法
 */

// 查询数据
export function list(port, params) {
  const param = Object.assign({}, params)
  delete param.current
  delete param.pageSize
  return request({
    url: `/${port}/page/${params.current}/${params.pageSize}`,
    method: 'get',
    params: param
  })
}

// 新增数据
export function create(port, data) {
  return request({
    url: `/${port}/create`,
    method: 'post',
    data
  })
}

// 删除数据
export function remove(port, id) {
  return request({
    url: `/${port}/delete/${id}`,
    method: 'post'
  })
}

// 更新数据
export function update(port, data) {
  return request({
    url: `/${port}/update`,
    method: 'post',
    data
  })
}

// 查询某一条
export function read(port, id) {
  return request({
    url: `/${port}/read/${id}`,
    method: 'get',
    params: {}
  })
}
