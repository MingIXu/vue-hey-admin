import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissionButtons = store.getters && store.getters.permissionButtons
    if (value) {
      const permissionButton = value

      const hasPermission = permissionButtons.some(button => {
        return button === permissionButton
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
