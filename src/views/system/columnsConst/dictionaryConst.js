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
    width: 200,
    operation: {
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
