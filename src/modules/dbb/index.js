import { ref } from 'vue'

import LogUtils from '../../utils/log'

export default class {
  static install (app, { viewModule, dialogModule, toastModule }) {
    LogUtils.d('[plugin install] dbb')

    app.config.globalProperties.$dbb = this

    // dependencies
    this.$view = viewModule
    this.$dialog = dialogModule
    this.$toast = toastModule
  }

  static do () {
    LogUtils.d('[pt-dbb] do', ...arguments)

    if (this.$toast.currentItems.length > 0) {
      const last = this.$toast.currentItems[this.$toast.currentItems.length - 1]
      this.$toast.hideByKey(last.key)
      return true
    }

    if (this.$dialog.currentItems.length > 0) {
      const last = this.$dialog.currentItems[this.$dialog.currentItems.length - 1]
      if (last.cancelable) {
        this.$dialog.hideByKey(last.key)
        return true
      }
      return null
    }

    if (this.$view.currentVisibles.length > 0) {
      const last = this.$view.currentVisibles[this.$view.currentVisibles.length - 1]
      if (last !== 'main') {
        if (this.$view.currentStacks[last].length > 1) {
          this.$view.pop({ stack: last })
          return true
        } else {
          this.$view.hide({ stack: last })
          return true
        }
      }
    } else {
      if (this.$view.currentStacks['main'].length > 1) {
        this.$view.pop()
        return true
      }
    }

    return false
  }
}
