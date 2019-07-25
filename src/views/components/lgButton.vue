<template>
  <el-button v-if="permission()" :type="type" :size="size" :plain="plain" :round="round" :circle="circle" :loading="loading" :icon="icon" :autofocus="autofocus" :native-type="nativeType">{{ name }}</el-button>
</template>
<script>
export default {
  name: 'LgButton',
  props: {
    permissionValue: {
      type: String
    },
    // 按钮名称
    name: {
      type: String
    },
    // 按钮类型：primary / success / warning / danger / info / text
    type: {
      type: String,
      default: 'primary'
    },
    // 按钮尺寸：medium / small / mini
    size: {
      type: String,
      default: 'primary'
    },
    // 是否朴素按钮
    plain: {
      type: Boolean,
      default: false
    },
    // 是否朴素按钮
    round: {
      type: Boolean,
      default: false
    },
    // 是否圆形按钮
    circle: {
      type: Boolean,
      default: false
    },
    // 是否加载中状态
    loading: {
      type: Boolean,
      default: false
    },
    // 图标类名
    icon: {
      type: String
    },
    // 是否默认聚焦
    autofocus: {
      type: Boolean,
      default: false
    },
    // 原生 type 属性: button / submit / reset
    nativeType: {
      type: String,
      default: 'button'
    }
  },
  computed: {
    permissionButtons() {
      return this.$store.state.permission.permissionButtons
    }
  },

  methods: {
    permission() {
      // 处理存在权限按钮
      if (this.permissionValue) {
        const resButton = this.permissionButtons.find(v => v === this.permissionValue)
        return resButton !== undefined
      } else {
        return false
      }
    }
  }
}
</script>
