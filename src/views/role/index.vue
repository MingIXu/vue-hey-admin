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
    >
      <el-table-column v-for="(item,index) in columns" :key="index" :property="item.code" :label="item.label" :width="item.width" align="center" />

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlePermission(scope.row)">权限</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="角色权限">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="顺序">
          <el-input v-model="temp.orders" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in StatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogTitle==='create'?createData():updateData()">提交
        </el-button>
      </div>
    </el-dialog>
    <!--tree组件-->
    <el-dialog :title="dialogTree" :visible.sync="dialogTreeVisible">
      <el-tree
        ref="tree"
        :props="props"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePermission()">更新
        </el-button>
      </div>
    </el-dialog>
    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="init" />
  </div>
</template>
<script>
import { getList, getTreeData, create, update, updatePermission } from '@/api/role'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      columns: [
        { code: 'id', label: '编号', width: '60' },
        { code: 'name', label: '角色名称', width: '80' },
        { code: 'code', label: '角色标识', width: '100' },
        { code: 'description', label: '角色权限', width: '' },
        { code: 'orders', label: '排序', width: '100' },
        { code: 'statusShow', label: '状态', width: '60' },
        { code: 'updateName', label: '编辑人', width: '' },
        { code: 'updateTime', label: '更新日期', width: '200' }
      ],
      list: null,
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
        code: undefined,
        description: undefined,
        orders: undefined,
        status: undefined,
        statusShow: undefined
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        code: [{ required: true, message: 'code is required', trigger: 'change' }]
      },
      StatusOptions: [
        { key: 0, display_name: '禁用' },
        { key: 1, display_name: '启用' }
      ],
      dialogTree: '权限',
      dialogTreeVisible: false,
      treeData: [],
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.setStatusShow()
          const tempData = Object.assign({}, this.temp)
          create(tempData).then(() => {
            this.dialogFormVisible = false
            this.init()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp()
      this.dialogTitle = 'update'
      this.dialogFormVisible = true
      for (const key in this.temp) {
        if (this.temp.hasOwnProperty(key)) {
          this.temp[key] = row[key]
        }
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.setStatusShow()
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            this.dialogFormVisible = false
            this.init()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleModifyStatus(row, status) {
      this.resetTemp()
      this.temp.id = row.id
      this.temp.status = status
      this.setStatusShow()
      const tempData = Object.assign({}, this.temp)
      update(tempData).then(() => {
        this.init()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
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
        code: undefined,
        description: undefined,
        orders: undefined,
        status: undefined,
        statusShow: undefined
      }
    },
    // tree 相关方法
    handlePermission(row) {
      this.temp.id = row.id
      this.dialogTreeVisible = true
      getTreeData(row.id).then(response => {
        this.treeData = response.treeData
        this.setCheckedKeys(response.keys)
      })
    },
    updatePermission() {
      const tempData = this.$refs.tree.getCheckedKeys()
      updatePermission(tempData, this.temp.id).then(() => {
        this.dialogTreeVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }])
    },
    setCheckedKeys(keys) {
      console.log(keys)
      this.$refs.tree.setCheckedKeys(keys)
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
