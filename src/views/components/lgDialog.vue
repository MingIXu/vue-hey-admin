<template lang="pug">
  el-dialog(:title="title" :visible.sync="visible" :width="width" :before-close="close")
    div(v-loading="loadingAll" element-loading-text="加载中...")
      el-form(v-if="showForm"
        id="formRef"
        :ref="formRef"
        :rules="formRules"
        :model="value"
        :label-width="labelWidth")
        slot(name="form")
      slot(v-else)
    span.dialog-footer(v-if="action" slot="footer")
      slot(name="action")
        el-button(@click="close") 取消
        el-button(type="primary" @click="submitForm") 确定
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
      default: '100px'
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
  computed: {
    // 通过vuex存储加载状态
    loadingAll() {
      return this.$store.getters.loadingAll
    }
  },
  watch: {
    visible(val, oldVal) {
      if (!val) {
        this.$emit('on-close')
      } else {
        if (this.showForm) {
          this.$nextTick(() => {
            this.$refs[this.formRef].clearValidate()
          })
        }
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
            this.$emit('on-submit')
          }
        })
      } else {
        this.$emit('on-submit')
      }
    }
  }
}
</script>
