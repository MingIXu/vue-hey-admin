export {
  tableAttr,
  statusOptions
}
const tableAttr = {
  thead: [
    {
      label: 'name',
      text: '角色名称',
      width: 100
    },
    {
      label: 'code',
      text: '角色标识'
    },
    {
      label: 'description',
      text: '角色权限'
    },
    {
      label: 'orders',
      text: '排序'
    },
    {
      label: 'status',
      text: '状态'
    },
    {
      label: 'updateName',
      text: '编辑人'
    },
    {
      label: 'updateTime',
      text: '更新日期',
      width: 200
    }
  ],
  buttons: {
    status: true, // 是否区分操作状态 true：根据当前列的数据状态值使用operation[状态值]; false：使用operation[0]
    width: 300, // 表格操作列的宽度
    operation: { // 操作按钮配置
      0: [{
        name: 'permissions',
        text: '权限',
        id: 0,
        type: 'primary'
      },
      {
        name: 'editor',
        text: '编辑',
        id: 1,
        type: 'primary'
      },
      {
        name: 'enable',
        text: '启用',
        id: 2,
        type: 'success'
      }],
      1: [{
        name: 'permissions',
        text: '权限',
        id: 0,
        type: 'primary'
      },
      {
        name: 'editor',
        text: '编辑',
        id: 1,
        type: 'primary'
      },
      {
        name: 'disable',
        text: '禁用',
        id: 3,
        type: ''
      }]
    }
  }
}

const statusOptions = [
  {
    key: 1,
    valueCn: '启用'
  },
  {
    key: 0,
    valueCn: '禁用'
  }
]
