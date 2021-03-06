<template lang="pug">
  .lg-container
    .lg-container-white
      el-container
        el-aside(width="200px" style="padding-top: 20px")
          el-input(v-model="filterText"
            size="small"
            placeholder="输入关键字过滤"
            style="margin-bottom:30px;")
          el-tree.filter-tree(ref="tree"
            :data="treeData"
            v-loading="treeLoading"
            element-loading-text="加载中..."
            :props="defaultProps"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick")
        el-main
          .filter-container
            el-input.filter-item.w200(v-model="filters.keyWord" placeholder="输入关键字过滤" @keyup.enter.native="handleFilter")
            el-button.filter-item(type="primary" icon="el-icon-search" @click="handleFilter") 搜索
            el-button.filter-item(type="primary" icon="el-icon-plus" @click="handleCreate") 新增
          lgTable(columns-type="index"
            columns-label="序号"
            :list="list"
            :total-list="total"
            :lg-thead="dictionaryConst.tableAttr.thead"
            :lg-buttons="dictionaryConst.tableAttr.buttons"
            @operationEvent0="operationEvent0"
            @operationEvent1="operationEvent1"
            @initListQuery="initListQuery"
            @getListByPagination="getListByPagination")
          lgDialog(:title="dialogTitle"
            :visible="dialogFormVisible"
            width="500px"
            :show-form="true"
            form-ref="dataForm"
            :form-rules="dataRules"
            label-width="120px"
            :value="dataForm"
            @on-submit="handleCreateOrUpdate"
            @on-close="onClose")
            template(slot="form")
              el-form-item(label="字典名称" prop="valueCn")
                el-input(v-model="dataForm.valueCn")
              el-form-item(label="字典值" prop="key")
                el-input(v-model="dataForm.key")
              el-form-item(label="字典排序" prop="orders")
                el-input(v-model="dataForm.orders")
</template>
<script>
import { list, createOrUpdate, remove } from '@/api/common'
import { getDicTypeTree } from '@/api/system'
import lgTable from '@/views/components/lgTable'
import lgDialog from '@/views/components/lgDialog'
import { dictionaryConst } from '@/views/system/columnsConst'
const defaultForm = {
  id: null,
  valueCn: '',
  key: '',
  type: '',
  typeKey: '',
  orders: ''
}
export default {
  components: { lgTable, lgDialog },
  data() {
    return {
      dictionaryConst,
      // 公共接口地址
      apiUri: 'dictionary',
      // 表格列表
      list: [],
      // 表格总条数
      total: 0,
      // 页数、条数
      listQuery: {
        current: 1,
        pageSize: 10
      },
      // 过滤条件
      filters: {
        keyWord: '',
        type: null
      },
      // 弹窗显示隐藏
      dialogFormVisible: false,
      // 弹窗提示语
      dialogTitle: '',
      // 表单
      dataForm: Object.assign({}, defaultForm),
      // 表单校验
      dataRules: {
        valueCn: [{ required: true, message: 'valueCn is required', trigger: 'blur' }],
        key: [{ required: true, message: 'key is required', trigger: 'blur' }]
      },
      filterText: '',
      treeData: [],
      defaultProps: {
        label: 'label'
      },
      treeLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.getList()
    this.getTreeData()
  },
  methods: {
    // 获取树
    getTreeData() {
      this.treeLoading = true
      getDicTypeTree().then(res => {
        this.treeData = res.data.treeData
        this.treeLoading = false
      })
    },
    // 过滤树
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 选中树某个数据
    handleNodeClick(data) {
      this.filters.type = data.key
      this.dataForm.typeKey = data.key
      this.getList()
    },
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
    // 添加
    handleCreate() {
      if (!this.dataForm.typeKey) {
        this.$message({
          message: '请先选择左侧字典分类',
          type: 'warning'
        })
        return false
      }
      const typeKey = this.dataForm.typeKey
      this.reset()
      this.dataForm.typeKey = typeKey
      this.dialogTitle = '新增'
      this.dialogFormVisible = true
    },
    // 编辑
    operationEvent0(row) {
      this.reset()
      this.dataForm = Object.assign({}, row)
      this.dialogTitle = '更新'
      this.dialogFormVisible = true
    },
    // 删除
    operationEvent1(row) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(this.apiUri, row.id).then(res => {
          if (res.code === 200) {
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCreateOrUpdate() {
      const data = Object.assign({}, this.dataForm)
      createOrUpdate(this.apiUri, data).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$message({
            message: this.dialogTitle + '成功',
            type: 'success'
          })
          this.dialogFormVisible = false
        }
      })
    },
    // 重置表单
    reset() {
      this.dataForm = Object.assign({}, defaultForm)
    },
    // 关闭弹窗
    onClose() {
      this.dialogFormVisible = false
    }
  }
}
</script>
