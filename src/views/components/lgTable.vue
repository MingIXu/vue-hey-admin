<template lang="pug">
  .lg-tabel-container
    el-table(:key="tableKey"
      ref="table"
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      fixed
      fit
      border
      highlight-current-row
      style="width: 100%"
      @select="getRow"
      @select-all="getRow"
      @row-click="getRowClick")
      el-table-column(v-if="hasSelection" :label="columnsLabel" align="center" :type="columnsType" :index="indexMethod" width="55")
      el-table-column(v-for="thead in lgThead" :key="thead.label" :width="thead.width || ''" class-name="status-col" :prop="thead.label" :label="thead.text")
        template(slot-scope="scope")
          lgSolt(v-if="thead.render" :render="thead.render" :row="scope.row" :column="thead")
          div(v-else) {{ scope.row[thead.label] }}
      el-table-column(v-if="isOperation && lgButtons.operation" label="操作" :width="lgButtons.width ? lgButtons.width : 100 * lgButtons.operation[0].length"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right")
        template(slot-scope="scope")
          el-button(v-for="button in (lgButtons.statusName ? lgButtons.operation[scope.row[lgButtons.statusName]] : lgButtons.operation[0])"
            :key="button.name"
            v-permission="button.permission"
            v-waves=""
            size="small"
            :type="button.type"
            @click="fun(scope.row, button.id)")
            span(:style="button.color ? 'color:' + button.color : ''") {{ button.text }}
    .pagination-container
      el-pagination(ref="pagination"
        background
        :current-page="listQuery.current"
        :page-sizes="[10,20,50,100]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalList"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange")
</template>
<script>
const lgSolt = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, data) => {
    const element = data.props.render(h, data.props.row)
    if (typeof (element) === 'object' && element !== null) {
      return element
    } else {
      return h('span', element)
    }
  }
}
import permission from '@/directive/permission'
import waves from '@/directive/waves' // 水波纹指令
export default {
  name: 'LgTable',
  directives: {
    waves,
    permission
  },
  components: { lgSolt },
  props: {
    // 表格数据
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 表格数据长度
    totalList: {
      type: Number,
      default: 0
    },
    // 表头数据
    lgThead: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 状态名称
    statusName: {
      type: String,
      default: function() {
        return 'status'
      }
    },
    // 表格第一列
    hasSelection: {
      type: Boolean,
      default: true
    },
    // 第一列表格类型 |默认值：selection、index、expand
    columnsType: {
      type: String,
      default: 'selection'
    },
    // 如果columnsType为index时，第一列表头的名称
    columnsLabel: {
      type: String,
      default: '#'
    },
    // 判断是否需要操作按钮
    isOperation: {
      type: Boolean,
      default: true
    },
    // 操作按钮
    lgButtons: {
      type: Object,
      default: function() {
        return [{
          status: true, // 是否区分操作状态 true：根据当前列的数据状态值使用operation[状态值]; false：使用operation[0]
          width: 100, // 表格操作列的宽度
          operation: { // 操作按钮配置
            0: [{
              name: 'enable',
              text: '启用',
              id: 0,
              type: 'primary'
            }],
            1: [{
              name: 'disable',
              text: '禁用',
              id: 1,
              type: 'primary'
            }]
          }
        }]
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      listQuery: {
        current: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    // 通过vuex存储加载状态
    listLoading() {
      return this.$store.getters.listLoading
    }
  },
  created() {
    // 初始化页码、每页条数
    this.$emit('initListQuery', this.listQuery)
  },
  methods: {
    getRow(s, r) {
      this.$emit('getSelectArr', s, r)
    },
    getRowClick(r, e, c) {
      this.$emit('getRowClick', r, e, c)
    },
    // 按钮事件
    fun(row, buttonId) {
      this.$emit('operationEvent' + buttonId, row)
    },
    // 搜索页码获取列表
    getList() {
      this.$emit('getListByPagination', this.listQuery)
    },
    handleFilter() {
      // 手动触发 @current-page事件
      this.$refs.pagination.lastEmittedPage = 1
      // 通过筛选条件每次请求默认第一页
      this.listQuery.current = 1
      this.getList()
    },
    // 修改每页条数
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    // 页码改变时触发
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    // 索引
    indexMethod(index) {
      return this.listQuery.pageSize * (this.listQuery.current - 1) + index + 1
    }
  }
}
</script>
<style lang="scss">
.lg-tabel-container {
  .el-table th.is-leaf {
    background-color: #ecf0f7;
    color: #666;
  }
  .el-table tr:nth-child(even) {
    background-color: #fafafa;
  }
}
</style>

