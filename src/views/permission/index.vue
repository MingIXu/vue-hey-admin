<template>
  <div class="app-container">
    <div class="el-container">
      <el-aside width="281px" style="padding-top: 20px">
        <el-button v-waves class="el-button--small" type="primary" @click="create">新增子节点</el-button>
        <el-button v-waves class="el-button--small" type="primary" @click="update">编辑</el-button>
        <el-button v-waves class="el-button--small" type="primary">删除</el-button>
        <el-input v-model="filterText" size="small" placeholder="输入关键字过滤" style="margin:10px 0;" />
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px; margin-top: 50px;">
          <el-form-item label="ID">
            <el-input v-model="temp.id" :disabled="true"/>
          </el-form-item>
          <el-form-item label="父ID" prop="pid">
            <el-input v-model="temp.pid" :disabled="true"/>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="temp.name"/>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="temp.type" class="filter-item" placeholder="Please select" @change="selectChange">
              <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isMenu" label="前端组件" prop="component">
            <el-input v-model="temp.component"/>
          </el-form-item>
          <el-form-item v-if="isMenu" label="前端路径" prop="path">
            <el-input v-model="temp.path"/>
          </el-form-item>
          <el-form-item v-if="isButton" label="权限标识" prop="permissionValue">
            <el-input v-model="temp.permissionValue"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCreateAndUpdate">{{ confirmValue }}</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { getTreeData, createOrUpdate } from '@/api/permission'

const typeOptions = [
  { key: 1, display_name: '目录' },
  { key: 2, display_name: '菜单' },
  { key: 3, display_name: '按钮' }
]

export default {
  directives: { waves },
  data() {
    return {
      typeOptions,
      isCatalog: false,
      isMenu: false,
      isButton: false,
      confirmValue: '保存',
      rules: {
        pid: [{ required: true, message: 'pid is required', trigger: 'change' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        path: [{ required: true, message: 'path is required', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        pid: undefined,
        name: undefined,
        type: undefined,
        component: undefined,
        path: undefined,
        permissionValue: undefined
      },
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val)
    }
  },
  mounted() {
    this.init()
    console.log('mounted')
  },
  methods: {
    init() {
      getTreeData().then(response => {
        this.treeData = response.treeData
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.reset()
      this.confirmValue = '更新'
      this.isShow(data.permission.type)
      this.temp.id = data.id
      this.temp.pid = data.parentId
      this.temp.type = data.permission.type
      this.temp.name = data.label
    },
    create() {
      console.log('add')
      const id = this.temp.id
      this.reset()
      this.temp.pid = id
      this.confirmValue = '保存'
    },
    update() {
      console.log('update')
      this.confirmValue = '更新'
    },
    handleCreateAndUpdate() {
      console.log('handleCreateAndUpdate')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          createOrUpdate(tempData).then(() => {
            this.init()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleCancel() {
      console.log('handleCancel')
    },
    selectChange(data) {
      this.isShow(data)
    },
    reset() {
      this.temp = {
        id: undefined,
        pid: undefined,
        name: undefined,
        type: undefined,
        component: undefined,
        path: undefined,
        permissionValue: undefined
      }
    },
    isShow(type) {
      this.isCatalog = type === 1
      this.isMenu = type === 2
      this.isButton = type === 3
    }
  }
}
</script>
