import Mock from 'mockjs'
import { param2Obj } from '../src/utils'
const List = []
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@cname',
    'sex|1': ['0', '1'],
    'isDeleted|1': ['normal', 'deleted'],
    createName: '@cname',
    createTime: '@datetime'
  }))
}

export default {
  getList: config => {
    const { type, name, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (type && item.sex !== type) return false
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getOne: (config) => {
    const { id } = param2Obj(config.url)
    for (const user of List) {
      if (user.id === +id) {
        return user
      }
    }
  },
  create: () => ({
    data: 'success'
  }),
  update: () => ({
    data: 'success'
  }),
  getOrgTree: () => ({
    treeData: [{
      id: 1,
      label: '依米集团',
      children: [{
        id: 4,
        label: '杭州分公司',
        children: [{
          id: 9,
          label: '产品部'
        }, {
          id: 10,
          label: '开发部'
        }]
      }]
    }, {
      id: 2,
      label: '湖南集团',
      children: [{
        id: 5,
        label: '湖南分公司'
      }, {
        id: 6,
        label: '株洲分公司'
      }]
    }, {
      id: 3,
      label: '湖北公司',
      children: [{
        id: 7,
        label: '武汉分公司'
      }, {
        id: 8,
        label: '孝感分公司'
      }]
    }]
  })
}
