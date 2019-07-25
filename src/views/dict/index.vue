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
            placeholder="名称"
            style="width: 200px;"
            class="filter-item el-input--small"
          />
          <el-button
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
            @click="create"
          >新增</el-button>
        </div>
        <lg-table
          :list="list"
          :total-list="total"
          columns-type="index"
          :lg-thead="dictObj.dictThead"
          :lg-buttons="dictObj.dictButtons"
        />
        <el-table
          v-loading="listLoading"
          :data="list"
          fit
          stripe
          highlight-current-row
          style="width: 100%"
          row-key="id"
          border
          lazy
        >
          <el-table-column type="index" :index="getIndex" align="center" width="50" />
          <el-table-column
            v-for="(item,index) in columns"
            :key="index"
            :property="item.code"
            :label="item.label"
            :width="item.width"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="update(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handleDeleted(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页组件-->
        <pagination
          v-show="total>listQuery.limit"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="init"
        />

        <!--编辑新增弹出框-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="right"
            label-width="80px"
            style="width: 400px; margin-left:50px;"
          >
            <el-form-item label="字典名称" prop="valueCn">
              <el-input v-model="temp.valueCn" />
            </el-form-item>
            <el-form-item label="字典值" prop="key">
              <el-input v-model="temp.key" />
            </el-form-item>
            <el-form-item label="字典排序">
              <el-input v-model="temp.orders" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="handleCreateOrUpdate">保存</el-button>
          </div>
        </el-dialog>
      </el-main>
    </div>
  </div>
</template>
<script>
import { getList, getDicTypeTree, createOrUpdate, deleteByIds } from '@/api/dict'
import Pagination from '@/components/Pagination'
import lgTable from '@/views/components/lgTable'
export default {
  components: { Pagination, lgTable },
  data() {
    return {
      columns: [
        { code: 'valueCn', label: '字典名称', width: '100' },
        { code: 'key', label: '字典值', width: '' },
        { code: 'orders', label: '排序', width: '60' },
        { code: 'updateName', label: '编辑人名称', width: '200' },
        { code: 'updateTime', label: '编辑日期', width: '200' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyWord: undefined,
        type: undefined
      },
      rules: {
        valueCn: [{ required: true, message: 'valueCn is required', trigger: 'blur' }],
        key: [{ required: true, message: 'key is required', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        valueCn: undefined,
        key: undefined,
        typeKey: undefined,
        orders: undefined
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
    this.init()
    this.getTreeData()
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
    getTreeData() {
      getDicTypeTree().then(response => {
        this.treeData = response.treeData
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      console.log('handleNodeClick')
      this.listQuery.type = data.key
      this.init()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.init()
    },
    create() {
      console.log('create')
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    update(data) {
      console.log('update')
      this.copyObjProperty(this.temp, data)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleCreateOrUpdate() {
      console.log('handleCreateOrUpdate')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          createOrUpdate(tempData).then(() => {
            this.init()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDeleted(row) {
      deleteByIds(row.id).then(() => {
        this.init()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        valueCn: undefined,
        key: undefined,
        typeKey: undefined,
        orders: undefined
      }
    },
    getIndex(index) {
      return index + (this.listQuery.page - 1) * this.listQuery.limit + 1
    }
  }
}
</script>
