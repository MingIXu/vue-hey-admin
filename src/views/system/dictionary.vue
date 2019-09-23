<template>
  <div class="lg-container">
    <div class="lg-container-white">
      <el-container>
        <el-aside width="200px" style="padding-top: 20px">
          <el-input
            v-model="filterText"
            size="small"
            placeholder="输入关键字过滤"
            style="margin-bottom:30px;"
          />
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-aside>
        <el-main>
          <!--搜索模块-->
          <div class="filter-container">
            <el-input
              v-model="filters.keyWord"
              placeholder="输入关键字过滤"
              style="width: 200px;"
              class="filter-item el-input--small"
              @keyup.enter.native="handleFilter"
            />
            <el-button
              v-waves
              class="filter-item el-button--small"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >搜索</el-button>
            <el-button
              v-waves
              class="filter-item el-button--small"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="handleCreate"
            >新增</el-button>
          </div>
          <!--主列表模块-->
          <lgTable
            columns-type="index"
            columns-label="序号"
            :list="list"
            :total-list="total"
            :lg-thead="dictionaryConst.tableAttr.thead"
            :lg-buttons="dictionaryConst.tableAttr.buttons"
            @operationEvent0="operationEvent0"
            @operationEvent1="operationEvent1"
            @initListQuery="initListQuery"
            @getListByPagination="getListByPagination"
          />
          <!--编辑新增弹出框-->
          <lgDialog
            :title="textMap[dialogTitle]"
            :visible="dialogFormVisible"
            width="500px"
            :show-form="true"
            form-ref="dataForm"
            :form-rules="dataRules"
            label-width="120px"
            :value="dataForm"
            @on-submit="handleCreateOrUpdate"
            @on-close="onClose"
          >
            <template slot="form">
              <el-form-item label="字典名称" prop="valueCn">
                <el-input v-model="dataForm.valueCn" />
              </el-form-item>
              <el-form-item label="字典值" prop="key">
                <el-input v-model="dataForm.key" />
              </el-form-item>
              <el-form-item label="字典排序">
                <el-input v-model="dataForm.orders" />
              </el-form-item>
            </template>
          </lgDialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import { list, createOrUpdate, remove } from '@/api/common'
import { getDicTypeTree } from '@/api/system'
import waves from '@/directive/waves'
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
  directives: { waves },
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
      textMap: {
        update: '编辑',
        create: '新增'
      },
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
    this.getTreeData()
  },
  methods: {
    // 获取树
    getTreeData() {
      getDicTypeTree().then(response => {
        this.treeData = response.data.treeData
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
      this.dialogTitle = 'create'
      this.dialogFormVisible = true
    },
    // 编辑
    operationEvent0(row) {
      this.reset()
      this.dataForm = Object.assign({}, row)
      this.dialogTitle = 'update'
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
            message: this.textMap[this.dialogTitle] + '成功',
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
