import { ref } from 'vue'

import LogUtils from '../../utils/log'
import RandomUtils from '../../utils/random'

import toastHolderComponent from './toastHolderComponent'

export default class {
  static install (app) {
    LogUtils.d('[plugin install] toast')

    app.config.globalProperties.$toast = this

    // vue component
    app.component(toastHolderComponent.name, toastHolderComponent)

    // init
    this._items = ref([])
  }

  static get currentItems () {
    return this._items.value
  }

  static show (content, options = { timeout: 2e3 }) {
    LogUtils.d('[pt-toast] show', ...arguments)

    const key = RandomUtils.string(6)

    const item = {
      key,
      timer: setTimeout(() => this.hideByKey(key), options.timeout),
      content
    }

    this._items.value.push(item)
  }

  static hideByKey (key) {
    LogUtils.d('[pt-toast] hideByKey', ...arguments)

    if (typeof key === 'string') {
      const index = this._items.value.findIndex(el => el.key === key)
      if (index !== -1) {
        this._items.value.splice(index, 1)
      }
    }
  }
}
