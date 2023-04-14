import { ref, createVNode } from 'vue'

import LogUtils from '../../utils/log'
import RandomUtils from '../../utils/random'

import { ViewCreateEvent, ViewDestroyEvent, ViewShowEvent, ViewHideEvent } from './events'

export default class {
  static install (app) {
    LogUtils.d('[plugin install] view')

    app.config.globalProperties.$view = this

    // dependencies
    this._app = app

    // init
    this._stacks = ref({ main: [] })
    this._visibles = ref([])
  }

  static get currentStacks () {
    return this._stacks.value
  }

  static get currentVisibles () {
    return this._visibles.value
  }

  static register ({ stack } = {}) {
    LogUtils.d('[pt-view] register', ...arguments)

    if (stack in this._stacks.value) return

    this._stacks.value[stack] = []
    this._visibles.value[stack] = false
  }

  static show ({ stack } = {}) {
    LogUtils.d('[pt-view] show', ...arguments)

    if (this._visibles.value.includes(stack)) return

    this._visibles.value.push(stack)
  }

  static hide ({ stack } = {}) {
    LogUtils.d('[pt-view] hide', ...arguments)

    if (!this._visibles.value.includes(stack)) return

    this._visibles.value.splice(this._visibles.value.indexOf(stack), 1)
  }

  static push ({ stack = null, name, params } = {}) {
    LogUtils.d('[pt-view] push', ...arguments)

    stack = this._fallbackStack(stack)

    if (this._stacks.value[stack].length > 0) {
      const key = this._stacks.value[stack][this._stacks.value[stack].length - 1].key
      const element = this._getViewElement(key)
      this._doViewHook(element, 'hide', () => {
      })
    }

    const key = RandomUtils.string(6)
    this._stacks.value[stack].push(
      this._generateView({ key, name, params })
    )

    setImmediate(() => {
      const element = this._getViewElement(key)
      this._doViewHook(element, 'create', () => {
      })
      this._doViewHook(element, 'show', () => {
      })
    })
  }

  static pop ({ stack = null, steps = 1 } = {}) {
    LogUtils.d('[pt-view] pop', ...arguments)

    stack = this._fallbackStack(stack)

    if (this._stacks.value[stack].length > steps) {
      let runDefault = false

      for (let i = this._stacks.value[stack].length - 1; i >= this._stacks.value[stack].length - steps; i--) {
        const key = this._stacks.value[stack][i].key
        const element = this._getViewElement(key)
        this._doViewHook(element, 'hide', () => {
        })
        this._doViewHook(element, 'destroy', () => {
          runDefault = true
        })
      }

      if (runDefault) {
        this._stacks.value[stack].splice(
          this._stacks.value[stack].length - steps
        )

        const key = this._stacks.value[stack][this._stacks.value[stack].length - steps].key
        const element = this._getViewElement(key)
        this._doViewHook(element, 'show', () => {
        })
      }
    }
  }

  static replace ({ stack = null, name, params } = {}) {
    LogUtils.d('[pt-view] replace', ...arguments)

    stack = this._fallbackStack(stack)

    if (this._stacks.value[stack].length > 0) {
      let runDefault = false

      {
        const key = this._stacks.value[stack][this._stacks.value[stack].length - 1].key
        const element = this._getViewElement(key)
        this._doViewHook(element, 'hide', () => {
        })
        this._doViewHook(element, 'destroy', () => {
          runDefault = true
        })
      }

      if (runDefault) {
        const key = RandomUtils.string(6)
        this._stacks.value[stack].splice(
          this._stacks.value[stack].length - 1,
          1,
          this._generateView({ key, name, params })
        )

        setImmediate(() => {
          const element = this._getViewElement(key)
          this._doViewHook(element, 'create', () => {
          })
          this._doViewHook(element, 'show', () => {
          })
        })
      }
    }
  }

  static clear ({ stack = null } = {}) {
    LogUtils.d('[pt-view] clear', ...arguments)

    stack = this._fallbackStack(stack)

    this._stacks.value[stack].splice(1)
  }

  static _generateView ({ key, name, params }) {
    const component = this._app.component(`View${name}`)
    const props = (typeof params === 'object' && params !== null) ? params : undefined

    if (typeof component === 'undefined') {
      throw new Error('Invalid view component name.')
    }

    const vNode = createVNode(component, props)
    vNode.appContext = this._app._context

    return { key, vNode }
  }

  static _getViewElement (key) {
    return window.document.getElementById(`pt-view-${key}`)
  }

  static _fallbackStack (stack = null) {
    if (stack === null) {
      if (this._visibles.value.length > 0) {
        return this._visibles.value[this._visibles.value.length - 1]
      }
      return 'main'
    }
    return stack
  }

  static _doViewHook (element, type, next) {
    if (element === null) return

    switch (type) {
      case 'create': {
        const event = new ViewCreateEvent()
        element.__vnode.ctx.ctx._doCreate(event)
        next()
      }
        break
      case 'destroy': {
        let runDefault = true
        const event = Object.assign(new ViewDestroyEvent(), {
          preventDefault () {
            runDefault = false
            return false
          },
          runDefault () {
            next()
          }
        })
        element.__vnode.ctx.ctx._doDestroy(event)
        if (runDefault) {
          next()
        }
      }
        break
      case 'show': {
        const event = new ViewShowEvent()
        element.__vnode.ctx.ctx._doShow(event)
        next()
      }
        break
      case 'hide': {
        const event = new ViewHideEvent()
        element.__vnode.ctx.ctx._doHide(event)
        next()
      }
        break
    }
  }
}
