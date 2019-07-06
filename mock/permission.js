import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'order|1-10': 1,
    date: '@date',
    name: '@cname()',
    hasChildren: '@boolean',
    'isDeleted|1': ['normal', 'deleted'],
    'status|1': ['success', 'pending']
  }))
}

export default {
  getTreeData: () => ({
    treeData: [{
      id: 1,
      pid: -1,
      type: 1,
      label: '依米集团',
      children: [{
        id: 4,
        pid: 1,
        label: '杭州分公司',
        children: [{
          id: 9,
          pid: 4,
          label: '产品部'
        }, {
          id: 10,
          pid: 4,
          label: '开发部'
        }]
      }]
    }, {
      id: 2,
      pid: -1,
      label: '湖南集团',
      children: [{
        id: 5,
        pid: 2,
        label: '湖南分公司'
      }, {
        id: 6,
        pid: 2,
        label: '株洲分公司'
      }]
    }, {
      id: 3,
      pid: -1,
      label: '湖北公司',
      children: [{
        id: 7,
        pid: 3,
        label: '武汉分公司'
      }, {
        id: 8,
        pid: 3,
        label: '孝感分公司'
      }]
    }]
  }),
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
  })
}
