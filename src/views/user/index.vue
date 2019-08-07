<template>
  <div class="app-container">
    <div class="el-container">
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
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <!--搜索模块-->
        <div class="filter-container">
          <el-input
            v-model="listQuery.keyWord"
            placeholder="用户名"
            style="width: 200px;"
            class="filter-item el-input--small"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="listQuery.type"
            placeholder="性别"
            clearable
            class="filter-item"
            size="small"
            style="width: 130px"
          >
            <el-option
              v-for="item in sexOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
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
            icon="el-icon-edit"
            @click="handleCreate"
          >添加</el-button>
          <el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item el-button--small"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload"
          >导出</el-button>
          <lgButton
            name="新增"
            class="filter-item el-button--small"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            permission-value="addRole1"
          />
        </div>

        <!--主列表模块-->
        <lgTable
          columns-type="index"
          columns-label="序号"
          :list="list"
          :total-list="total"
          :lg-thead="userAttr.thead"
          :lg-buttons="userAttr.buttons"
          @operationEvent0="operationEvent0"
          @operationEvent1="operationEvent1"
          @operationEvent2="operationEvent2"
          @operationEvent3="operationEvent3"
          @initListQuery="initListQuery"
          @getListByPagination="getListByPagination"
        />
        <!--编辑新增弹出框-->
        <lgDialog
          :title="textMap[dialogStatus]"
          :visible="dialogFormVisible"
          width="500px"
          :show-form="true"
          form-ref="dataForm"
          :form-rules="rules"
          label-width="70px"
          :value="temp"
          @on-sumbit="dialogStatus === 'create' ? createData() : updateData()"
          @on-close="onClose"
        >
          <template slot="form">
            <el-form-item :label="table.name" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item :label="table.nick">
              <el-input v-model="temp.nick" />
            </el-form-item>
            <el-form-item :label="table.sex">
              <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="table.status">
              <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="角色">
              <el-select
                v-model="temp.roles"
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
        <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="right"
            label-width="70px"
            style="width: 400px; margin-left:50px;"
          >
            <el-form-item :label="table.name" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item :label="table.nick">
              <el-input v-model="temp.nick" />
            </el-form-item>
            <el-form-item :label="table.sex">
              <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="table.status">
              <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="角色">
              <el-select
                v-model="temp.roles"
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
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{ table.cancel }}</el-button>
            <el-button
              type="primary"
              @click="dialogStatus==='create'?createData():updateData()"
            >{{ table.confirm }}</el-button>
          </div>
        </el-dialog>-->
      </el-main>
    </div>
  </div>
</template>

<script>
import { getOrgTree, getUserRole } from '@/api/user'
import { list, create, update, remove } from '@/api/common'
import { getList as getRolesList } from '@/api/role'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import lgButton from '@/views/components/lgButton'
import lgTable from '@/views/components/lgTable'
import lgDialog from '@/views/components/lgDialog'

export default {
  components: { lgButton, lgTable, lgDialog },
  directives: { waves },
  data() {
    return {
      apiUri: 'user',
      list: [],
      total: 0,
      listQuery: {
        current: 1,
        pageSize: 10
      },
      filters: {
        keyWord: '',
        type: null,
        departmentId: null
      },
      temp: {
        id: null,
        name: '',
        nick: '',
        sex: null,
        status: null,
        roles: []
      },
      statusOptions: [{
        key: 0,
        display_name: '禁用'
      },
      {
        key: 1,
        display_name: '启用'
      }],
      sexOptions: [{
        key: 0,
        display_name: '男'
      },
      {
        key: 1,
        display_name: '女'
      }],
      userAttr: {
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
            text: '性别'
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
            text: '状态'
          }
        ],
        buttons: {
          status: true, // 是否区分操作状态 true：根据当前列的数据状态值使用operation[状态值]; false：使用operation[0]
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
              type: ''
            },
            {
              name: 'delete',
              text: '删除',
              id: 3,
              type: 'danger'
            }]
          }
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      table: {
        name: '用户名',
        nick: '名字',
        sex: '性别',
        search: '搜索',
        add: '添加',
        export: '导出',
        id: '序号',
        createName: '创建人',
        createTime: '创建时间',
        status: '状态',
        actions: '操作',
        edit: '编辑',
        normal: '启用',
        disable: '禁用',
        cancel: '取 消',
        confirm: '确 定'
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
          this.list = res.list
          this.total = res.total
        }
      })
    },
    // 编辑
    operationEvent0(row) {
      this.temp = Object.assign({}, row) // copy obj
      getUserRole(this.temp.id).then(res => {
        if (res.code === 200) {
          this.temp.roles = res.roles
        }
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 启用
    operationEvent1(row) {
      const params = {
        id: row.id,
        status: 1
      }
      update(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '启用成功',
            type: 'success',
            duration: 2000
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
      update(this.apiUri, params).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '禁用成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 删除
    operationEvent3(row) {
      remove(row.id).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 添加
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 添加提交
    createData() {
      const data = Object.assign({}, this.temp)
      create(this.apiUri, data).then(res => {
        if (res.code === 200) {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 编辑提交
    updateData() {
      const data = Object.assign({}, this.temp)
      update(this.apiUri, data).then(res => {
        if (res.code === 200) {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    onClose() {
      this.dialogFormVisible = false
    },
    // 清空弹框表单
    resetForm() {
      this.temp = {
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
        page: 1,
        limit: 9999
      }
      getRolesList(data).then(res => {
        if (res.code === 200) {
          this.rolesList = res.list
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
          this.treeData = res.treeData
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '用户名', '姓名', '性别', '创建人', '创建时间', '状态']
        const filterVal = ['id', 'name', 'nick', 'sex', 'createName', 'createTime', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else if (j === 'sex') {
          const sexKeyValue = this.sexOptions.reduce((acc, cur) => {
            acc[cur.key] = cur.display_name
            return acc
          }, {})
          return sexKeyValue[v[j]]
        } else if (j === 'status') {
          const sexKeyValue = this.statusOptions.reduce((acc, cur) => {
            acc[cur.key] = cur.display_name
            return acc
          }, {})
          return sexKeyValue[v[j]]
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

