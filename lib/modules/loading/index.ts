import { type App, type Ref, ref } from 'vue'

import LogUtils from '@/utils/log'

import PtLoadingHolder from './PtLoadingHolder.vue'

type LoadingItem = {
  content: string | null
}

class LoadingModule {
  private static items: Ref<LoadingItem[]> = ref([])

  static install(app: App) {
    LogUtils.d('[pt] plugin install - loading')

    app.config.globalProperties.$loading = this
  }

  static get currentShown(): boolean {
    return this.items.value.length > 0
  }

  static get currentContent(): string | null {
    return this.items.value.length > 0
      ? this.items.value[this.items.value.length - 1].content
      : null
  }

  /**
   * 显示加载指示器
   */
  static show(
    /**
     * 加载指示器内容
     */
    content: string | null = null
  ): void {
    LogUtils.d('[pt-loading] show()', 'content:', content)

    this.items.value.push({ content })
  }

  /**
   * 隐藏加载指示器
   */
  static hide(
    /**
     * 加载指示器内容
     */
    content: string | null = null
  ): void {
    LogUtils.d('[pt-loading] hide()', 'content:', content)

    if (typeof content === 'string') {
      const index = this.items.value.findIndex(el => el.content === content)
      if (index !== -1) {
        this.items.value.splice(index, 1)
      }
    } else {
      this.items.value.pop()
    }
  }
}

export default LoadingModule

export { PtLoadingHolder }
