import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/dictionary/page/' + query.page + '/' + query.limit,
    method: 'get',
    params: query
  })
}

export function getOne(id) {
  return request({
    url: '/dictionary/read',
    method: 'get',
    params: { id }
  })
}

export function deleteByIds(ids) {
  return request({
    url: '/dictionary/delete/' + ids,
    method: 'delete'
  })
}

export function createOrUpdate(data) {
  return request({
    url: '/dictionary/createOrUpdate',
    method: 'post',
    data
  })
}

export function getDicTypeTree() {
  return request({
    url: '/dictionaryType/getDicTypeTree',
    method: 'get'
  })
}
