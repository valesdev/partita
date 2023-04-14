import { ref } from 'vue'

import LogUtils from '../../utils/log'

import loadingHolderComponent from './loadingHolderComponent'

export default class {
  static install (app) {
    LogUtils.d('[plugin install] loading')

    app.config.globalProperties.$loading = this

    // vue component
    app.component(loadingHolderComponent.name, loadingHolderComponent)

    // init
    this._items = ref([])
  }

  static get currentShown () {
    return this._items.value.length > 0
  }

  static get currentContent () {
    return this._items.value.length > 0 ? this._items.value[this._items.value.length - 1] : null
  }

  static show (content = null) {
    LogUtils.d('[pt-loading] show', ...arguments)

    this._items.value.push(content)
  }

  static hide (content = null) {
    LogUtils.d('[pt-loading] hide', ...arguments)

    if (typeof content === 'string') {
      this._items.value.splice(this._items.value.indexOf(content), 1)
    } else {
      this._items.value.pop()
    }
  }
}
