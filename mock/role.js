import Mock from 'mockjs'
import { param2Obj } from '../src/utils'
const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'order|1-100': 1,
    date: '@date',
    name: '@cname()',
    price: '@float(1000, 15000, 0, 2)',
    'isDeleted|1': ['normal', 'deleted'],
    'status|1': ['success', 'pending']
  }))
}

export default {
  getList: config => {
    const { name, page = 1, limit = 20 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getOne: (config) => {
    const { id } = param2Obj(config.url)
    for (const obj of List) {
      if (obj.id === +id) {
        return obj
      }
    }
  },
  create: () => ({
    data: 'success'
  }),
  update: () => ({
    data: 'success'
  }),
  treeData: () => ({
    data: [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }],
    checkedKeys: [9, 6]
  }),
  updatePermission: () => ({
    data: 'success'
  })
}
