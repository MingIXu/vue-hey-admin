<template lang="pug">
  .lg-container
    .lg-container-white
      .filter-container
        el-input.filter-item.w200(v-model="filters.keyWord" placeholder="输入关键字过滤" @keyup.enter.native="handleFilter")
        el-button.filter-item(type="primary" icon="el-icon-search" @click="handleFilter") 搜索
        el-button.filter-item(type="primary" icon="el-icon-plus" @click="handleCreate") 新增
      lgTable(columns-type="index"
        columns-label="序号"
        :list="list"
        :total-list="total"
        :lg-thead="roleConst.tableAttr.thead"
        :lg-buttons="roleConst.tableAttr.buttons"
        @operationEvent0="operationEvent0"
        @operationEvent1="operationEvent1"
        @operationEvent2="operationEvent2"
        @operationEvent3="operationEvent3"
        @initListQuery="initListQuery"
        @getListByPagination="getListByPagination")
      lgDialog(:title="dialogTitle"
        :visible="dialogFormVisible"
        width="500px"
        :show-form="true"
        form-ref="dataForm"
        :form-rules="dataRules"
        label-width="70px"
        :value="dataForm"
        @on-submit="handleCreateOrUpdate"
        @on-close="onClose")
        template(slot="form")
          el-form-item(label="角色名" prop="name")
            el-input(v-model="dataForm.name")
          el-form-item(label="角色标识" prop="code")
            el-input(v-model="dataForm.code")
          el-form-item(label="角色权限" prop="description")
            el-input(v-model="dataForm.description")
          el-form-item(label="顺序" prop="orders")
            el-input(v-model="dataForm.orders")
          el-form-item(label="是否启用" prop="status")
            el-select(v-model="dataForm.status" placeholder="请选择")
              el-option(v-for="item in roleConst.statusOptions"
                :key="item.key"
                :label="item.valueCn"
                :value="item.key")
      lgDialog(title="权限设置"
        :visible="dialogFormVisibleTree"
        width="500px"
        :show-form="false"
        @on-submit="handleCreateOrUpdateTree"
        @on-close="onTreeClose")
        template
          el-tree(ref="tree"
            :props="props"
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current)
</template>

<script>
import { getPermissionsTree, updatePermission } from '@/api/system'
import { list, createOrUpdate } from '@/api/common'
import lgTable from '@/views/components/lgTable'
import lgDialog from '@/views/components/lgDialog'
import { roleConst } from '@/views/system/columnsConst'
const defaultForm = {
  id: null,
  name: '',
  code: '',
  description: '',
  orders: '',
  status: 1
}
export default {
  components: { lgTable, lgDialog },
  data() {
    return {
      roleConst,
      apiUri: 'role',
      list: [],
      total: 0,
      listQuery: {
        current: 1,
        pageSize: 10
      },
      filters: {
        keyWord: ''
      },
      dataForm: Object.assign({}, defaultForm),
      dialogFormVisible: false,
      dialogTitle: '',
      dialogPvVisible: false,
      dataRules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nick: [{ required: true, message: '请输入真实名字', trigger: 'blur' }]
      },
      // 权限相关
      dialogFormVisibleTree: false,
      treeData: [],
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 初始化页数与条数
    initListQuery(listQuery) {
      this.listQuery = listQuery
    },
    // 分页操作
    getListByPagination(listQuery) {
      this.listQuery = listQuery
      this.getList()
    },
    // 过滤列表
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 获取列表
    getList() {
      this.$store.dispatch('app/toggleLoading', true)
      const params = Object.assign({}, this.listQuery, this.filters)
      list(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },
    // 权限
    operationEvent1(row) {
      this.dialogFormVisibleTree = true
      this.dataForm.id = row.id
      this.$store.dispatch('app/toggleLoadingAll', true)
      getPermissionsTree(row.id).then(res => {
        if (res.code === 200) {
          this.treeData = res.data.treeData
          this.setCheckedKeys(res.data.keys)
        }
      })
    },
    setCheckedKeys(keys) {
      this.$refs.tree.setCheckedKeys(keys)
    },
    // 权限编辑
    handleCreateOrUpdateTree() {
      const tempData = this.$refs.tree.getCheckedKeys()
      updatePermission(tempData, this.dataForm.id).then(() => {
        this.dialogFormVisibleTree = false
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      })
    },
    // 权限设置关闭
    onTreeClose() {
      this.dialogFormVisibleTree = false
    },
    // 编辑
    operationEvent0(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogTitle = '更新'
      this.dialogFormVisible = true
    },
    // 启用
    operationEvent2(row) {
      const params = {
        id: row.id,
        status: 1
      }
      createOrUpdate(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        }
      })
    },
    // 禁用
    operationEvent3(row) {
      const params = {
        id: row.id,
        status: 0
      }
      createOrUpdate(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        }
      })
    },
    // 添加
    handleCreate() {
      this.resetForm()
      this.dialogTitle = '新增'
      this.dialogFormVisible = true
    },
    // 添加提交
    handleCreateOrUpdate() {
      const data = Object.assign({}, this.dataForm)
      createOrUpdate(this.apiUri, data).then(res => {
        if (res.code === 200) {
          this.getList()
          this.dialogFormVisible = false
          this.$message({
            message: this.dialogTitle + '成功',
            type: 'success'
          })
        }
      })
    },
    onClose() {
      this.dialogFormVisible = false
    },
    // 清空弹框表单
    resetForm() {
      this.dataForm = {
        id: null,
        name: '',
        code: '',
        description: '',
        orders: '',
        status: 1
      }
    }
  }
}
</script>

