import { type App, type Component } from 'vue'

import LogUtils from '@/utils/log'

// modules
import ViewModule from '@/modules/view'
import DialogModule from '@/modules/dialog'
import ToastModule from '@/modules/toast'
import LoadingModule from '@/modules/loading'
import DbbModule from '@/modules/dbb'

// components
import PtHolder from './components/PtHolder.vue'
import PtViewContent from './components/PtViewContent.vue'
import PtStatusbar from './components/PtStatusbar.vue'
import PtHomeIndicator from './components/PtHomeIndicator.vue'
import PtTitlebar from './components/PtTitlebar.vue'
import PtTitlebarButton from './components/PtTitlebarButton.vue'
import PtTitlebarBackButton from './components/PtTitlebarBackButton.vue'
import PtTabbar from './components/PtTabbar.vue'
import PtSplitHeadbar from './components/PtSplitHeadbar.vue'
import PtSplitFootbar from './components/PtSplitFootbar.vue'
import PtModal from './components/PtModal.vue'
import PtPtrWrapper from './components/PtPtrWrapper.vue'

interface PartitaLoadingOptions {
  /**
   * 加载指示器自定义组件
   */
  component?: Component
}

interface PartitaPtrOptions {
  /**
   * 下拉刷新自定义组件
   */
  component?: Component

  /**
   * 下拉刷新触发阈值
   */
  threshold?: number
}

interface PartitaDialogOptions {
  /**
   * 对话框的默认按钮文字
   */
  defaultLabelForOk?: string | (() => string)

  /**
   * 对话框的默认按钮文字
   */
  defaultLabelForYes?: string | (() => string)

  /**
   * 对话框的默认按钮文字
   */
  defaultLabelForNo?: string | (() => string)
}

interface MainModuleOptions {
  /**
   * 加载指示器相关配置
   */
  loading?: PartitaLoadingOptions

  /**
   * 下拉刷新相关配置
   */
  ptr?: PartitaPtrOptions

  /**
   * 对话框相关配置
   */
  dialog?: PartitaDialogOptions
}

class MainModule {
  private static _options: MainModuleOptions = {}

  static install (app: App, options?: MainModuleOptions) {
    LogUtils.d('[pt] plugin install - pt')

    app.config.globalProperties.$pt = this

    // vue components
    app.component('PtHolder', PtHolder)
    app.component('PtViewContent', PtViewContent)
    app.component('PtStatusbar', PtStatusbar)
    app.component('PtHomeIndicator', PtHomeIndicator)
    app.component('PtTitlebar', PtTitlebar)
    app.component('PtTitlebarButton', PtTitlebarButton)
    app.component('PtTitlebarBackButton', PtTitlebarBackButton)
    app.component('PtTabbar', PtTabbar)
    app.component('PtSplitHeadbar', PtSplitHeadbar)
    app.component('PtSplitFootbar', PtSplitFootbar)
    app.component('PtModal', PtModal)
    app.component('PtPtrWrapper', PtPtrWrapper)

    // options
    if (options !== undefined) {
      this._options = options
    }

    // bootstrap modules
    app.use(ViewModule)
    app.use(DialogModule)
    app.use(ToastModule)
    app.use(LoadingModule)
    app.use(DbbModule)
  }

  static get options (): MainModuleOptions {
    return this._options
  }
}

export default MainModule

export {
  type MainModuleOptions,
  type PartitaLoadingOptions as PartitaSpinnerOptions,
  type PartitaPtrOptions,
  type PartitaDialogOptions
}
