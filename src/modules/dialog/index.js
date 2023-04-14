import { ref } from 'vue'

import LogUtils from '../../utils/log'
import RandomUtils from '../../utils/random'

import dialogHolderComponent from './dialogHolderComponent'

export default class {
  static install (app) {
    LogUtils.d('[plugin install] dialog')

    app.config.globalProperties.$dialog = this

    // vue component
    app.component(dialogHolderComponent.name, dialogHolderComponent)

    // init
    this._items = ref([])
  }

  static get currentItems () {
    return this._items.value
  }

  static show (content = null, title = null, {
    component = null,
    buttons,
    cancelable = false,
    callback = null
  }) {
    LogUtils.d('[pt-dialog] show', ...arguments)

    const key = RandomUtils.string(6)

    return new Promise(resolve => {
      const item = {
        key,
        title,
        content,
        component,
        buttons,
        cancelable,
        callback,
        resolver: resolve
      }

      this._items.value.push(item)
    })
  }

  static hideByKey (key) {
    LogUtils.d('[pt-dialog] hideByKey', ...arguments)

    if (typeof key === 'string') {
      const index = this._items.value.findIndex(el => el.key === key)
      if (index !== -1) {
        this._items.value.splice(index, 1)
      }
    }
  }

  static alert (content, title = null, options = null) {
    return this.show(
      content,
      title,
      {
        buttons: [
          { value: null, label: '好的' }
        ],
        cancelable: true,
        ...options
      }
    )
  }

  static confirm (content, title = null, options = null) {
    return this.show(
      content,
      title,
      {
        buttons: [
          { value: false, label: '取消' },
          { value: true, label: '确认', isHighlight: true }
        ],
        cancelable: false,
        ...options
      }
    )
  }
}
