import { type App, type Ref, ref } from 'vue'

import LogUtils from '@/utils/log'
import RandomUtils from '@/utils/random'

import PtToastHolder from './PtToastHolder.vue'

type ToastItem = {
  /**
   * 吐司 Key
   */
  key: string

  /**
   * 吐司内容
   */
  content: string

  /**
   * 吐司自动隐藏定时器
   */
  timer: number
}

interface ToastShowOptions {
  /**
   * 自动隐藏时长
   */
  timeout?: number
}

class ToastModule {
  private static items: Ref<ToastItem[]> = ref([])

  static install(app: App) {
    LogUtils.d('[pt] plugin install - toast')

    app.config.globalProperties.$toast = this
  }

  static get currentItems() {
    return this.items.value
  }

  /**
   * 显示吐司
   */
  static show(
    /**
     * 吐司内容
     */
    content: string,

    /**
     * 吐司配置
     */
    options: ToastShowOptions = { timeout: 2e3 }
  ): void {
    LogUtils.d('[pt-toast] show()', 'content:', content)

    const key = RandomUtils.string(6)

    const item: ToastItem = {
      key,
      content,
      timer: setTimeout(() => this.hideByKey(key), options.timeout)
    }

    this.items.value.push(item)
  }

  /**
   * 通过 Key 隐藏吐司
   */
  static hideByKey(
    /**
     * 吐司 Key
     */
    key: string
  ): void {
    LogUtils.d('[pt-toast] hideByKey()', 'key:', key)

    const index = this.items.value.findIndex((el: { key: string }) => el.key === key)
    if (index !== -1) {
      clearTimeout(this.items.value[index].timer)
      this.items.value.splice(index, 1)
    }
  }
}

export default ToastModule

export {
  type ToastShowOptions,
  type ToastItem,
  PtToastHolder
}
