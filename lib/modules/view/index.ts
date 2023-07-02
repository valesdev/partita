import { type App, type Ref, type VNode, ref } from 'vue'

import LogUtils from '@/utils/log'

import PtViewStack from './components/PtViewStack.vue'
import PtView from './components/PtView.vue'

interface StackInstances {
  [key: string]: StackInstance
}

interface StackInstance {
  push: ({ name, params }: { name: string, params?: Record<string, unknown> | null }) => void
  pop: ({ steps }: { steps?: number }) => void
  replace: ({ name, params }: { name: string, params?: Record<string, unknown> | null }) => void
  clear: () => void
  getSize: () => number | null
}

interface StackItem {
  key: string
  vNode: VNode
}

interface ViewInstances {
  [key: string]: ViewInstance
}

interface ViewInstance {
  emitOnCreate: (event: ViewCreateEvent) => void
  emitOnDestroy: (event: ViewDestroyEvent) => void
  emitOnShow: (event: ViewShowEvent) => void
  emitOnHide: (event: ViewHideEvent) => void
}

class ViewCreateEvent extends CustomEvent<void> {
  constructor() {
    super('create')
  }
}

class ViewDestroyEvent extends CustomEvent<void> {
  constructor() {
    super('destroy')
  }

  runDefault (): void { }
}

class ViewShowEvent extends CustomEvent<void> {
  constructor() {
    super('show')
  }
}

class ViewHideEvent extends CustomEvent<void> {
  constructor() {
    super('hide')
  }
}

class ViewModule {
  private static stacks: Ref<StackInstances> = ref({})

  private static visibles: Ref<string[]> = ref([])

  static install (app: App): void {
    LogUtils.d('[pt] plugin install – view')

    app.config.globalProperties.$view = this

    // vue components
    app.component('PtViewStack', PtViewStack)
    app.component('PtView', PtView)
  }

  static get currentVisibles () {
    return this.visibles.value
  }

  static registerStack (
    name: string,
    instance: StackInstance
  ): void {
    LogUtils.d('[pt-view] registerStack')

    if (name in this.stacks.value) return

    this.stacks.value[name] = instance
  }

  static unregisterStack (
    name: string
  ): void {
    LogUtils.d('[pt-view] unregisterStack')

    if (!(name in this.stacks.value)) return

    delete this.stacks.value[name]
  }

  /**
   * 显示视图栈
   */
  static show (
    /**
     * 视图栈名称
     */
    stack: string
  ): void {
    LogUtils.d('[pt-view] show')

    if (this.visibles.value.indexOf(stack) !== -1) return

    this.visibles.value.push(stack)
  }

  /**
   * 隐藏视图栈
   */
  static hide (
    /**
     * 视图栈名称
     */
    stack: string
  ): void {
    LogUtils.d('[pt-view] hide')

    if (this.visibles.value.indexOf(stack) === -1) return

    this.visibles.value.splice(this.visibles.value.indexOf(stack), 1)
  }

  /**
   * 视图栈视图入栈
   */
  static push ({
    stack,
    name,
    params
  }: {
    /**
     * 视图栈名称
     */
    stack?: string,

    /**
     * 视图名称
     */
    name: string,

    /**
     * 视图属性
     */
    params?: Record<string, unknown> | null
  }): void {
    LogUtils.d('[pt-view] push', 'stack:', stack, 'name:', name, 'params:', params)

    stack = this._fallbackStack(stack)

    if (stack != undefined && stack in this.stacks.value) {
      this.stacks.value[stack].push({ name, params })
    }
  }

  /**
   * 视图栈视图出栈
   */
  static pop ({
    stack,
    steps = 1
  }: {
    /**
     * 视图栈名称
     */
    stack?: string,

    /**
     * 出栈数量
     */
    steps?: number
  } = { stack: undefined, steps: undefined }): void {
    LogUtils.d('[pt-view] pop', 'stack:', stack, 'steps:', steps)

    stack = this._fallbackStack(stack)

    if (stack != undefined && stack in this.stacks.value) {
      this.stacks.value[stack].pop({ steps })
    }
  }

  /**
   * 替换视图栈栈尾视图
   */
  static replace ({
    stack,
    name,
    params
  }: {
    /**
     * 视图栈名称
     */
    stack?: string,

    /**
     * 视图名称
     */
    name: string,

    /**
     * 视图属性
     */
    params?: Record<string, unknown> | null
  }): void {
    LogUtils.d('[pt-view] replace', 'stack:', stack, 'name:', name, 'params:', params)

    stack = this._fallbackStack(stack)

    if (stack != undefined && stack in this.stacks.value) {
      this.stacks.value[stack].replace({ name, params })
    }
  }

  /**
   * 清空视图栈
   */
  static clear ({
    stack
  }: {
    /**
     * 视图栈名称
     */
    stack?: string
  } = { stack: undefined }): void {
    LogUtils.d('[pt-view] clear', 'stack:', stack)

    stack = this._fallbackStack(stack)

    if (stack != undefined && stack in this.stacks.value) {
      this.stacks.value[stack].clear()
    }
  }

  /**
   * 获取指定视图栈的长度
   */
  static getSize ({
    stack
  }: {
    /**
     * 视图栈名称
     */
    stack?: string
  } = { stack: undefined }): number | null {
    stack = this._fallbackStack(stack)

    if (stack != undefined && stack in this.stacks.value) {
      return this.stacks.value[stack].getSize()
    }

    return null
  }

  private static _fallbackStack (
    stack?: string
  ): string | undefined {
    if (stack === undefined) {
      if (this.currentVisibles.length > 0) {
        return this.currentVisibles[this.currentVisibles.length - 1]
      }
    }
    return stack
  }
}

export default ViewModule

export {
  type StackInstances,
  type StackInstance,
  type StackItem,
  type ViewInstances,
  type ViewInstance,
  ViewCreateEvent,
  ViewDestroyEvent,
  ViewHideEvent,
  ViewShowEvent,
  PtViewStack
}
