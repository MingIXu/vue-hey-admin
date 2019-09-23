export {
  tableAttr
}

const tableAttr = {
  // 表头
  thead: [{
    label: 'valueCn',
    text: '字典名称'
  },
  {
    label: 'key',
    text: '字典值'
  },
  {
    label: 'orders',
    text: '排序'
  },
  {
    label: 'updateName',
    text: '编辑人名称',
    width: 200
  },
  {
    label: 'updateTime',
    text: '编辑日期',
    width: 200
  }],
  // 操作按钮
  buttons: {
    status: false, // 是否区分操作状态 true：根据当前列的数据状态值使用operation[状态值]; false：使用operation[0]
    width: 200, // 表格操作列的宽度
    operation: { // 操作按钮配置
      0: [
        {
          name: 'editor',
          text: '编辑',
          id: 0,
          type: 'primary'
        },
        {
          name: 'delete',
          text: '删除',
          id: 1,
          type: 'danger'
        }
      ],
      1: [
        {
          name: 'editor',
          text: '编辑',
          id: 0,
          type: 'primary'
        },
        {
          name: 'delete',
          text: '删除',
          id: 1,
          type: 'danger'
        }
      ]
    }
  }
}
