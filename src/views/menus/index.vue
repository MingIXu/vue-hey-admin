<template>
  <div class="app-container">
    <!--搜索模块-->
    <div class="filter-container">
      <el-input v-model="listQuery.keyWord" placeholder="名称" style="width: 200px;" class="filter-item el-input--small" />
      <el-button class="filter-item el-button--small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item el-button--small" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column v-for="(item,index) in columns" :key="index" :property="item.code" :label="item.label" :width="item.width" align="center">
        <template slot-scope="scope">
          <div v-if="item.code === 'roles'">
            {{ scope.row.roles | rolesFilter }}
          </div>
          <span v-else>
            {{ scope.row[item.code] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleAddMenu(scope.row)">加子级</el-button>
          <el-button
            v-if="scope.row.status!=1"
            size="mini"
            type="success"
            @click="handleModifyStatus(scope.row,1)"
          >启用
          </el-button>
          <el-button
            v-if="scope.row.status!=0"
            size="mini"
            type="danger"
            @click="handleModifyStatus(scope.row,0)"
          >禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑新增弹出框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 100%; padding: 0 30px;"
      >
        <el-form-item label="路由名称" prop="name">
          <el-input v-model="temp.name" placeholder="name" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="temp.path" placeholder="path" />
        </el-form-item>
        <el-form-item label="路由地址" prop="component">
          <el-input v-model="temp.component" placeholder="component" />
        </el-form-item>
        <el-form-item label="重定向地址" prop="redirect">
          <el-input v-model="temp.redirect" placeholder="redirect" />
        </el-form-item>
        <el-form-item label="展示名字" prop="title">
          <el-input v-model="temp.title" placeholder="title" />
        </el-form-item>
        <el-form-item label="路由图标">
          <el-input v-model="temp.icon" placeholder="icon" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select v-model="temp.status" class="filter-item" style="width: 100%;" placeholder="Please select">
            <el-option v-for="item in StatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-select
            v-model="temp.roles"
            multiple
            filterable
            allow-create
            default-first-option
            style="width: 100%;"
            placeholder="roles"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="temp.hidden">是否不出现在侧边栏</el-checkbox>
          <el-checkbox v-model="temp.alwaysShow">是否只显示根路由</el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="temp.noCache">是否不被缓存</el-checkbox>
          <el-checkbox v-model="temp.breadcrumb">是否在面包屑显示</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogTitle === 'create' ? createData() : updateData()">提交
        </el-button>
      </div>
    </el-dialog>
    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="init" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    rolesFilter(val) {
      if (val) {
        return val.join(',')
      }
    }
  },
  data() {
    return {
      columns: [
        { code: 'id', label: 'ID', width: '80' },
        { code: 'name', label: '路由名称', width: '100' },
        { code: 'path', label: '路由路径', width: '' },
        { code: 'component', label: '路由地址', width: '' },
        { code: 'redirect', label: '重定向地址', width: '' },
        { code: 'title', label: '展示名字', width: '100' },
        { code: 'icon', label: '路由图标', width: '100' },
        { code: 'roles', label: '路由权限', width: '' }
      ],
      list: [{
        id: 1,
        name: 'SystemManage',
        path: '/systemManage',
        redirect: '/systemManage/role',
        component: 'Layout',
        title: 'SystemManage',
        icon: 'component',
        alwaysShow: true,
        noCache: false,
        breadcrumb: true,
        hidden: false,
        status: 0,
        roles: ['admin', 'edtiod'],
        children: [{
          id: 2,
          path: 'role',
          name: 'Role',
          redirect: 'noRedirect',
          component: 'views/role/index',
          title: 'Role',
          icon: 'password',
          roles: ['admin'],
          alwaysShow: false,
          noCache: false,
          breadcrumb: true,
          hidden: false,
          status: 0
        }]
      }],
      total: 0,
      listLoading: true,
      dialogTitle: 'edit',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        keyWord: undefined,
        type: undefined
      },
      temp: {
        id: undefined,
        name: undefined,
        path: undefined,
        component: undefined,
        redirect: undefined,
        hidden: false,
        alwaysShow: false,
        title: undefined,
        icon: undefined,
        noCache: false,
        breadcrumb: true,
        roles: undefined,
        status: 1
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        path: [{ required: true, message: 'path is required', trigger: 'blur' }],
        component: [{ required: true, message: 'component is required', trigger: 'blur' }],
        redirect: [{ required: true, message: 'redirect is required', trigger: 'blur' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      StatusOptions: [
        { key: 0, display_name: '禁用' },
        { key: 1, display_name: '启用' }
      ],
      rolesList: [{
        value: 'admin',
        label: 'admin'
      }]
    }
  },
  mounted() {
    this.listLoading = false
    // this.init()
  },
  methods: {
    init() {
      this.listLoading = true
      // getList(this.listQuery).then(response => {
      //   this.list = response.list
      //   this.total = response.total
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 0.5 * 1000)
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.init()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogTitle = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log(this.temp)
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.setStatusShow()
      //     const tempData = Object.assign({}, this.temp)
      //     create(tempData).then(() => {
      //       this.dialogFormVisible = false
      //       this.init()
      //       this.$message({
      //         message: '操作成功',
      //         type: 'success'
      //       })
      //     })
      //   }
      // })
    },
    handleUpdate(row) {
      this.resetTemp()
      this.dialogTitle = 'update'
      for (const key in this.temp) {
        if (this.temp.hasOwnProperty(key)) {
          this.temp[key] = row[key]
        }
      }
      console.log(this.temp)
      this.dialogFormVisible = true
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.setStatusShow()
      //     const tempData = Object.assign({}, this.temp)
      //     update(tempData).then(() => {
      //       this.dialogFormVisible = false
      //       this.init()
      //       this.$message({
      //         message: '操作成功',
      //         type: 'success'
      //       })
      //     })
      //   }
      // })
    },
    handleModifyStatus(row, status) {
      // this.resetTemp()
      // this.temp.id = row.id
      // this.temp.status = status
      // this.setStatusShow()
      // const tempData = Object.assign({}, this.temp)
      // update(tempData).then(() => {
      //   this.init()
      //   this.$message({
      //     message: '操作成功',
      //     type: 'success'
      //   })
      // })
    },
    setStatusShow() {
      if (this.temp.status === 1) {
        this.temp.statusShow = '启用'
      } else {
        this.temp.statusShow = '禁用'
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        path: undefined,
        component: undefined,
        redirect: undefined,
        hidden: false,
        alwaysShow: false,
        title: undefined,
        icon: undefined,
        noCache: false,
        breadcrumb: true,
        roles: undefined,
        status: 1
      }
    },
    // 添加子菜单
    handleAddMenu(row) {
      this.resetTemp()
      this.dialogTitle = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
