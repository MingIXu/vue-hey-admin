<template>
  <el-dialog :title="title" :visible.sync="visible" :width="width" :before-close="close">
    <el-form v-if="showForm" id="formRef" :ref="formRef" :rules="formRules" :model="value" :label-width="labelWidth">
      <slot name="form" />
    </el-form>
    <span v-else>
      <slot />
    </span>
    <span v-if="action" slot="footer" class="dialog-footer">
      <slot name="action">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </slot>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'LgDialog',
  props: {
    // 弹窗提示语
    title: {
      type: String,
      default: '提示'
    },
    // 弹窗显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 弹窗长度
    width: {
      type: String,
      default: '600px'
    },
    // 是否使用表单模板
    showForm: {
      type: Boolean,
      default: false
    },
    // 表单ref
    formRef: {
      type: String,
      default: 'form'
    },
    // 表单校验对象
    formRules: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 表单标题长度
    labelWidth: {
      type: String,
      default: '600px'
    },
    // 表单数据对象
    value: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 是否使用默认底部操作
    action: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    visible(val, oldVal) {
      if (!val) {
        this.$emit('on-close')
      } else {
        this.$nextTick(() => {
          this.$refs[this.formRef].clearValidate()
        })
      }
    },
    value(val) {
      console.log(val)
    }
  },
  methods: {
    close() {
      this.$emit('on-close')
    },
    submitForm() {
      if (this.showForm) {
        this.$refs[this.formRef].validate((valid) => {
          if (valid) {
            this.$emit('on-sumbit')
          }
        })
      } else {
        this.$emit('on-sumbit')
      }
    }
  }
}
</script>
