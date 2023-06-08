import { type App, type Component, type Ref, ref, markRaw } from 'vue'

import LogUtils from '@/utils/log'
import RandomUtils from '@/utils/random'

import PtDialogHolder from './PtDialogHolder.vue'

import MainModule from '@/modules/main'

interface DialogItemButton {
  value: unknown
  label: string
  highlighted?: boolean
}

interface DialogItemComponent {
  is: Component
  props?: Record<string, unknown> | null
}

interface DialogItem {
  /**
   * 对话框 Key
   */
  key: string

  /**
   * 对话框标题
   */
  title: string | null

  /**
   * 对话框内容
   */
  content: string | null

  /**
   * 对话框自定义组件
   */
  component?: DialogItemComponent

  /**
   * 对话框按钮
   */
  buttons?: DialogItemButton[]

  /**
   * 对话框是否允许取消
   */
  cancelable?: boolean

  /**
   * 对话框交互回调
   */
  callback?: (
    /**
     * 交互结果
     */
    value: unknown
  ) => void

  /**
   * 对话框交互回调
   */
  resolver: (
    /**
     * 交互结果
     */
    value: unknown
  ) => void
}

interface DialogShowOptions {
  /**
   * 对话框自定义组件
   */
  component?: DialogItemComponent

  /**
   * 对话框按钮
   */
  buttons?: DialogItemButton[]

  /**
   * 对话框是否允许取消
   */
  cancelable?: boolean

  /**
   * 对话框交互回调
   *
   * @param value 交互结果
   */
  callback?: (value: unknown) => void
}

class DialogModule {
  private static items: Ref<DialogItem[]> = ref([])

  static install(app: App) {
    LogUtils.d('[pt] plugin install - dialog')

    app.config.globalProperties.$dialog = this
  }

  static get currentItems() {
    return this.items.value
  }

  /**
   * 显示对话框
   *
   * @returns 交互结果
   */
  static show(
    /**
     * 对话框内容
     */
    content: string | null = null,

    /**
     * 对话框标题
     */
    title: string | null = null,

    /**
     * 对话框配置
     */
    options?: DialogShowOptions
  ): Promise<unknown> {
    LogUtils.d('[pt-dialog] show()', 'content:', content, 'title:', title)

    const key = RandomUtils.string(6)

    return new Promise<unknown>((resolve) => {
      const item: DialogItem = {
        key,
        title,
        content,
        component: options?.component !== undefined && options?.component !== null ? markRaw(options.component) : undefined,
        buttons: options?.buttons,
        cancelable: options?.cancelable ?? false,
        callback: options?.callback,
        resolver: resolve
      }

      this.items.value.push(item)
    })
  }

  /**
   * 通过 Key 隐藏对话框
   */
  static hideByKey(
    /**
     * 对话框 Key
     */
    key: string
  ): void {
    LogUtils.d('[pt-dialog] hideByKey()', 'key:', key)

    const index = this.items.value.findIndex((el: { key: string }) => el.key === key)
    if (index !== -1) {
      this.items.value.splice(index, 1)
    }
  }

  /**
   * 显示提示对话框
   *
   * @returns 交互结果
   */
  static alert(
    /**
     * 对话框内容
     */
    content: string | null = null,

    /**
     * 对话框标题
     */
    title: string | null = null,

    /**
     * 对话框配置
     */
    options?: DialogShowOptions
  ): Promise<unknown> {
    return this.show(content, title, {
      buttons: [{ value: null, label: this.defaultLabelForOk }],
      cancelable: true,
      ...options
    })
  }

  /**
   * 显示确认对话框
   *
   * @returns 交互结果
   */
  static confirm(
    /**
     * 对话框内容
     */
    content: string | null = null,

    /**
     * 对话框标题
     */
    title: string | null = null,

    /**
     * 对话框配置
     */
    options?: DialogShowOptions
  ): Promise<unknown> {
    return this.show(content, title, {
      buttons: [
        { value: false, label: this.defaultLabelForNo },
        { value: true, label: this.defaultLabelForYes, highlighted: true }
      ],
      cancelable: false,
      ...options
    })
  }

  private static get defaultLabelForOk() {
    return typeof MainModule.options.dialog?.defaultLabelForOk === 'function'
      ? MainModule.options.dialog?.defaultLabelForOk()
      : MainModule.options.dialog?.defaultLabelForOk !== undefined
        ? MainModule.options.dialog?.defaultLabelForOk
        : 'OK'
  }

  private static get defaultLabelForYes() {
    return typeof MainModule.options.dialog?.defaultLabelForYes === 'function'
      ? MainModule.options.dialog?.defaultLabelForYes()
      : MainModule.options.dialog?.defaultLabelForYes !== undefined
        ? MainModule.options.dialog?.defaultLabelForYes
        : 'Yes'
  }

  private static get defaultLabelForNo() {
    return typeof MainModule.options.dialog?.defaultLabelForNo === 'function'
      ? MainModule.options.dialog?.defaultLabelForNo()
      : MainModule.options.dialog?.defaultLabelForNo !== undefined
        ? MainModule.options.dialog?.defaultLabelForNo
        : 'No'
  }
}

export default DialogModule

export { type DialogItem, type DialogItemButton, PtDialogHolder }
