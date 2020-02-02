export {
  tableAttr,
  statusOptions,
  sexOptions
}
const tableAttr = {
  thead: [
    {
      label: 'name',
      text: '用户名',
      width: 100
    },
    {
      label: 'nick',
      text: '名字'
    },
    {
      label: 'sex',
      text: '性别',
      render: (h, row) => {
        const sexOptions = ['男', '女']
        return sexOptions[row.sex]
      }
    },
    {
      label: 'createName',
      text: '创建人'
    },
    {
      label: 'createTime',
      text: '创建时间',
      width: 200
    },
    {
      label: 'status',
      text: '状态',
      render: (h, row) => {
        const statusOptions = ['禁用', '启用']
        const tags = ['danger', 'success']
        console.log(tags[row.status])
        return h('el-tag', {
          attrs: {
            type: tags[row.status]
          }
        }, statusOptions[row.status])
      }
    }
  ],
  buttons: {
    statusName: 'status', // 是否区分操作状态 true：根据当前列的数据状态值使用operation[状态值]; false：使用operation[0]
    width: 300, // 表格操作列的宽度
    operation: { // 操作按钮配置
      0: [{
        name: 'editor',
        text: '编辑',
        id: 0,
        type: 'primary'
      },
      {
        name: 'enable',
        text: '启用',
        id: 1,
        type: 'success'
      },
      {
        name: 'delete',
        text: '删除',
        id: 3,
        type: 'danger'
      }],
      1: [{
        name: 'editor',
        text: '编辑',
        id: 0,
        type: 'primary'
      }, {
        name: 'disable',
        text: '禁用',
        id: 2,
        type: 'warning'
      },
      {
        name: 'delete',
        text: '删除',
        id: 3,
        type: 'danger'
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

const sexOptions = [{
  key: 0,
  valueCn: '男'
},
{
  key: 1,
  valueCn: '女'
}]
