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
            :expand-on-click-node="false"
            class="filter-tree"
            highlight-current
            default-expand-all
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
            :lg-thead="userConst.tableAttr.thead"
            :lg-buttons="userConst.tableAttr.buttons"
            @operationEvent0="operationEvent0"
            @operationEvent1="operationEvent1"
            @operationEvent2="operationEvent2"
            @operationEvent3="operationEvent3"
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
            label-width="70px"
            :value="dataForm"
            @on-submit="handleCreateOrUpdate"
            @on-close="onClose"
          >
            <template slot="form">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="dataForm.name" />
              </el-form-item>
              <el-form-item label="真实名字" prop="nice">
                <el-input v-model="dataForm.nick" />
              </el-form-item>
              <el-form-item label="性别">
                <el-select v-model="dataForm.sex" class="filter-item" placeholder="Please select">
                  <el-option
                    v-for="item in userConst.sexOptions"
                    :key="item.key"
                    :label="item.valueCn"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="dataForm.status" class="filter-item" placeholder="Please select">
                  <el-option
                    v-for="item in userConst.statusOptions"
                    :key="item.key"
                    :label="item.valueCn"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="角色">
                <el-select
                  v-model="dataForm.roles"
                  multiple
                  class="filter-item"
                  placeholder="Please select"
                >
                  <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </template>
          </lgDialog>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getOrgTree, getUserRole } from '@/api/system'
import { list, createOrUpdate, remove } from '@/api/common'
import waves from '@/directive/waves' // Waves directive
import lgTable from '@/views/components/lgTable'
import lgDialog from '@/views/components/lgDialog'
import { userConst } from '@/views/system/columnsConst'
const defaultForm = {
  id: null,
  name: '',
  nick: '',
  sex: null,
  status: null,
  roles: []
}
export default {
  components: { lgTable, lgDialog },
  directives: { waves },
  data() {
    return {
      userConst,
      apiUri: 'user',
      list: [],
      total: 0,
      listQuery: {
        current: 1,
        pageSize: 10
      },
      filters: {
        keyWord: '',
        departmentId: null
      },
      dataForm: Object.assign({}, defaultForm),
      dialogFormVisible: false,
      dialogTitle: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      dataRules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nick: [{ required: true, message: '请输入真实名字', trigger: 'blur' }]
      },
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rolesList: []
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
    this.getRolesList()
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
      const params = Object.assign({}, this.listQuery, this.filters)
      list(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },
    // 编辑
    operationEvent0(row) {
      this.dataForm = Object.assign({}, row) // copy obj
      getUserRole(this.dataForm.id).then(res => {
        if (res.code === 200) {
          this.dataForm.roles = res.data.roles
        }
      })
      this.dialogTitle = 'update'
      this.dialogFormVisible = true
    },
    // 启用
    operationEvent1(row) {
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
    operationEvent2(row) {
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
    // 删除
    operationEvent3(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
    // 添加
    handleCreate() {
      this.resetForm()
      this.dialogTitle = 'create'
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
            message: this.textMap[this.dialogTitle] + '成功',
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
        nick: '',
        sex: null,
        status: null,
        roles: []
      }
    },
    // 获取角色列表
    getRolesList() {
      const data = {
        current: 1,
        pageSize: 9999
      }
      list('role', data).then(res => {
        if (res.code === 200) {
          this.rolesList = res.data.list
        }
      })
    },
    // 树数据过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树选中事件
    handleNodeClick(data) {
      this.filters.departmentId = data.id
      this.getList()
    },
    // 获取树数据列表
    getTreeData() {
      getOrgTree().then(res => {
        if (res.code === 200) {
          this.treeData = res.data.treeData
        }
      })
    }
  }
}
</script>
