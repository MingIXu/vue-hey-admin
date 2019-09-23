<template>
  <div class="lg-container">
    <div class="lg-container-white">
      <el-container>
        <el-header style="height: 33px;">
          <el-button v-waves class="el-button--small" type="primary" icon="el-icon-plus" @click="create">新增新目录</el-button>
          <el-button v-waves class="el-button--small" type="primary" icon="el-icon-delete" @click="remove">删除</el-button>
          <el-dropdown style="margin-left: 10px;" @command="handleCommand">
            <el-button v-waves size="small" type="primary">
              更多菜单
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">取消选中</el-dropdown-item>
              <el-dropdown-item command="b">收合所有</el-dropdown-item>
              <el-dropdown-item command="c">仅展开一级</el-dropdown-item>
              <el-dropdown-item command="d">仅展开二级</el-dropdown-item>
              <el-dropdown-item command="e">展开所有</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-container>
          <el-aside width="281px">
            <el-input
              v-model="filterText"
              size="small"
              placeholder="输入关键字过滤"
              style="margin:10px 0;"
            />
            <el-tree
              id="permissionTree"
              ref="treeRef"
              empty-text="暂未数据"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              :filter-node-method="filterNode"
              class="filter-tree"
              :highlight-current="isHighlight"
              :expand-on-click-node="false"
              default-expand-all
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>
                  <svg-icon v-if="data.permission.type === 1" icon-class="lgCatalog" />
                  <svg-icon v-if="data.permission.type === 2" icon-class="lgMenu3" />
                  <svg-icon v-if="data.permission.type === 3" icon-class="lgBtn2" />
                  {{ node.label }}
                </span>
                <span />
              </span>
            </el-tree>
          </el-aside>
          <el-main>
            <el-form
              ref="dataForm"
              :rules="dataRules"
              :model="dataForm"
              label-position="right"
              label-width="100px"
              style="width: 500px; margin-left:50px;"
            >
              <el-form-item label="ID">
                <el-input v-model="dataForm.id" :disabled="true" />
              </el-form-item>
              <el-form-item label="父ID">
                <el-input v-model="dataForm.pid" :disabled="true" />
              </el-form-item>
              <el-form-item label="排序">
                <el-input v-model="dataForm.orders" />
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-input v-if="dataForm.type === 3" value="按钮" disabled="disabled" />
                <el-select
                  v-else
                  v-model="dataForm.type"
                  class="filter-item"
                  placeholder="Please select"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in permissionConst.typeOptions"
                    :key="item.key"
                    :label="item.valueCn"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <!-- 按钮 -->
              <template v-if="dataForm.type === 3">
                <el-form-item label="路由名称" prop="name">
                  <el-input v-model="dataForm.name" placeholder="name" />
                </el-form-item>
                <el-form-item label="权限标识" prop="permissionValue">
                  <el-input v-model="dataForm.permissionValue" />
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="路由名称" prop="name">
                  <el-input v-model="dataForm.name" placeholder="name" />
                </el-form-item>
                <el-form-item label="路由路径" prop="path">
                  <el-input v-model="dataForm.path" placeholder="path" />
                </el-form-item>
                <el-form-item label="文件路径" prop="component">
                  <el-input v-model="dataForm.component" placeholder="component" />
                </el-form-item>
                <el-form-item label="重定向地址">
                  <el-input v-model="dataForm.redirect" placeholder="redirect" />
                </el-form-item>
                <el-form-item label="展示名字" prop="title">
                  <el-input v-model="dataForm.title" placeholder="title" />
                </el-form-item>
                <el-form-item label="路由图标">
                  <el-input v-model="dataForm.icon" placeholder="icon" />
                </el-form-item>
                <el-form-item v-if="dataForm.type !== 1" label>
                  <el-checkbox v-model="dataForm.noCache">是否不被缓存</el-checkbox>
                  <el-checkbox v-model="dataForm.breadcrumb">是否在面包屑显示</el-checkbox>
                </el-form-item>
                <el-form-item label>
                  <el-checkbox v-model="dataForm.alwaysShow">是否只显示根路由</el-checkbox>
                </el-form-item>
              </template>

              <el-form-item>
                <el-button
                  v-if="dataForm.type === 1 && dataForm.id"
                  type="primary"
                  @click="createChildren"
                >新增子节点</el-button>
                <el-button
                  v-else-if="dataForm.type === 2 && dataForm.id"
                  type="primary"
                  @click="createButton"
                >新增按钮</el-button>
                <el-button type="primary" @click="handleCreateAndUpdate">{{ confirmValue }}</el-button>
                <el-button @click="handleCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
import { createOrUpdate, remove } from '@/api/common'
import { getTreeData } from '@/api/system'
import { permissionConst } from '@/views/system/columnsConst'
import waves from '@/directive/waves'
import { setTimeout } from 'timers'
const defaultForm = {
  id: null,
  pid: null,
  name: '',
  type: 1,
  path: '',
  component: '',
  redirect: null,
  alwaysShow: false,
  title: '',
  icon: '',
  noCache: false,
  breadcrumb: true,
  orders: '',
  permissionValue: ''
}
export default {
  directives: { waves },
  data() {
    return {
      permissionConst,
      confirmValue: '保存',
      // 公共接口地址
      apiUri: 'permission',
      // 表单
      dataForm: Object.assign({}, defaultForm),
      dataRules: {
        name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入文件路径', trigger: 'blur' }],
        title: [{ required: true, message: '请输入展示名字', trigger: 'blur' }],
        permissionValue: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
      },
      // 左侧树
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isHighlight: true,
      defaultAll: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val)
    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    // 获取树数据
    getTree() {
      getTreeData().then(res => {
        if (res.code === 200) {
          this.treeData = res.data.treeData
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.isHighlight = true
      this.confirmValue = '更新'
      this.$refs['dataForm'].clearValidate()
      for (const key in this.dataForm) {
        if (this.dataForm.hasOwnProperty(key)) {
          this.dataForm[key] = data.permission[key]
        }
      }
    },
    // 新增目录
    create() {
      this.isHighlight = false
      this.reset()
      this.dataForm.type = 1
      this.dataForm.component = 'Layout'
      this.confirmValue = '保存'
    },
    // 新增子节点
    createChildren() {
      if (this.dataForm.pid === null || this.dataForm.pid === '') {
        this.$message({
          message: '请先选择一个父节点',
          type: 'warning'
        })
        return false
      }
      const id = this.dataForm.id
      this.reset()
      this.dataForm.pid = id
      this.confirmValue = '保存'
    },
    createButton() {
      const id = this.dataForm.id
      this.reset()
      this.dataForm.pid = id
      this.dataForm.type = 3
      this.confirmValue = '保存'
    },
    handleCreateAndUpdate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.dataForm)
          createOrUpdate(this.apiUri, data).then(() => {
            this.getTree()
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
    reset() {
      this.dataForm = Object.assign({}, defaultForm)
      setTimeout(() => {
        this.$refs['dataForm'].clearValidate()
      }, 1000)
    },
    remove() {
      if (this.dataForm.id) {
        this.$confirm('此操作将永久删除该节点以及子节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(this.apiUri, this.dataForm.id).then(res => {
            if (res.code === 200) {
              this.getTree()
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
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一个节点'
        })
      }
    },
    handleTree(childNodes, status) {
      childNodes.forEach(v => {
        v.expanded = status
        if (v.childNodes.length > 0) {
          this.handleTree(v.childNodes, status)
        }
      })
    },
    handleCommand(command) {
      switch (command) {
        // 刷新
        case 'a':
          this.isHighlight = false
          this.reset()
          break
        // 收合所有
        case 'b':
          this.handleTree(this.$refs.treeRef.store.root.childNodes, false)
          break
        // 仅展开一级
        case 'c':
          this.handleTree(this.$refs.treeRef.store.root.childNodes, false)
          this.$refs.treeRef.store.root.childNodes.forEach(v => {
            v.expanded = true
          })
          break
        // 仅展开二级
        case 'd':
          this.handleTree(this.$refs.treeRef.store.root.childNodes, false)
          this.$refs.treeRef.store.root.childNodes.forEach(v => {
            v.expanded = true
            if (v.childNodes.length > 0) {
              v.childNodes.forEach(c => {
                c.expanded = true
              })
            }
          })
          break
        // 展开所有
        case 'e':
          this.handleTree(this.$refs.treeRef.store.root.childNodes, true)
          console.log(this.$refs.treeRef.store.root)
          break
        default:
          break
      }
    }
  }
}
</script>
