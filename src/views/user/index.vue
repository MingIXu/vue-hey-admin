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
            :placeholder="table.name"
            style="width: 200px;"
            class="filter-item el-input--small"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="listQuery.type"
            :placeholder="table.sex"
            clearable
            class="filter-item"
            size="small"
            style="width: 130px"
          >
            <el-option
              v-for="item in sexOptions"
              :key="item.key"
              :label="item.display_name+'('+item.key+')'"
              :value="item.key"
            />
          </el-select>
          <el-button
            v-waves
            class="filter-item el-button--small"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >{{ table.search }}</el-button>
          <el-button
            class="filter-item el-button--small"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
          >{{ table.add }}</el-button>
          <el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item el-button--small"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload"
          >{{ table.export }}</el-button>
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
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          stripe
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column :label="table.id" prop="id" sortable="custom" align="center" width="85">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="table.name" min-width="150px">
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="table.sex" min-width="50px">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.sex | sexFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="table.createName" width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="table.createTime" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="table.status" class-name="status-col" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status | statusColorFilter"
              >{{ scope.row.status | statusFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :label="table.actions"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdate(scope.row)"
              >{{ table.edit }}</el-button>
              <el-button
                v-if="scope.row.status!='1'"
                size="mini"
                type="success"
                @click="handleModifyStatus(scope.row,'1')"
              >{{ table.normal }}</el-button>
              <el-button
                v-if="scope.row.status!='0'"
                size="mini"
                type="danger"
                @click="handleModifyStatus(scope.row,'0')"
              >{{ table.disable }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页组件-->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />

        <!--编辑新增弹出框-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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
        </el-dialog>

        <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
          <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
            <el-table-column prop="key" label="Channel" />
            <el-table-column prop="pv" label="Pv" />
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogPvVisible = false">{{ table.confirm }}</el-button>
          </span>
        </el-dialog>
      </el-main>
    </div>
  </div>
</template>

<script>
import { fetchList, createUser, updateUser, getOrgTree, getUserRole } from '@/api/user'
import { getList as getRolesList } from '@/api/role'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import lgButton from '@/views/components/lgButton'
const sexOptions = [
  { key: 0, display_name: '男' },
  { key: 1, display_name: '女' }
]
const statusOptions = [
  { key: 0, display_name: '禁用' },
  { key: 1, display_name: '启用' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const sexKeyValue = sexOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  components: { Pagination, lgButton },
  directives: { waves },
  filters: {
    statusColorFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      return statusKeyValue[status]
    },
    sexFilter(type) {
      return sexKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyWord: undefined,
        type: undefined,
        departmentId: undefined,
        sort: '+id'
      },
      sexOptions,
      statusOptions,
      showReviewer: false,
      temp: {
        id: undefined,
        name: undefined,
        nick: undefined,
        sex: undefined,
        status: undefined,
        roles: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.listQuery.departmentId = data.id
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.list = res.list
          this.total = res.total
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
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
    getTreeData() {
      getOrgTree().then(res => {
        if (res.code === 200) {
          this.treeData = res.treeData
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.resetTemp()
      this.temp.id = row.id
      this.temp.status = status
      const tempData = Object.assign({}, this.temp)
      updateUser(tempData).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        nick: undefined,
        sex: undefined,
        status: undefined,
        roles: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      getUserRole(this.temp.id).then(res => {
        if (res.code === 200) {
          this.temp.roles = res.roles
        }
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
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
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

