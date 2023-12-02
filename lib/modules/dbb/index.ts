import { type App } from 'vue'

import LogUtils from '@/utils/log'

import ViewModule from '@/modules/view'
import DialogModule from '@/modules/dialog'
import ToastModule from '@/modules/toast'

class DbbModule {
  static install (app: App): void {
    LogUtils.d('[pt] plugin install - dbb')

    app.config.globalProperties.$dbb = this
  }

  /**
   * 执行设备返回键
   *
   * @returns 是否执行成功
   */
  static do (): boolean | null {
    LogUtils.d('[pt-dbb] do')

    if (ToastModule.currentItems.length > 0) {
      const last = ToastModule.currentItems[ToastModule.currentItems.length - 1]
      ToastModule.hideByKey(last.key)
      return true
    }

    if (DialogModule.currentItems.length > 0) {
      const last = DialogModule.currentItems[DialogModule.currentItems.length - 1]
      if (last.cancelable) {
        DialogModule.hideByKey(last.key)
        return true
      }
      return null
    }

    if (ViewModule.currentVisibles.length >= 2) {
      const lastStack = ViewModule.currentVisibles[ViewModule.currentVisibles.length - 1]
      const lastStackSize = ViewModule.getSize({ stack: lastStack })
      if (lastStackSize !== null && lastStackSize >= 2) {
        ViewModule.pop({ stack: lastStack })
        return true
      } else {
        ViewModule.hide(lastStack)
        return true
      }
    } else {
      const stackSize = ViewModule.getSize()
      if (stackSize !== null && stackSize >= 2) {
        ViewModule.pop()
        return true
      }
    }

    return false
  }
}

export default DbbModule
