import MainModule from '@/modules/main'
import ViewModule from '@/modules/view'
import DialogModule from '@/modules/dialog'
import ToastModule from '@/modules/toast'
import LoadingModule from '@/modules/loading'
import DbbModule from '@/modules/dbb'

export default MainModule

export { ViewModule, DialogModule, ToastModule, LoadingModule, DbbModule }

export * from '@/modules/main'
export * from '@/modules/view'
export * from '@/modules/dialog'
export * from '@/modules/toast'
export * from '@/modules/loading'
export * from '@/modules/dbb'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Partita 主模块
     */
    $pt: typeof MainModule

    /**
     * Partita 视图模块
     */
    $view: typeof ViewModule

    /**
     * Partita 对话框模块
     */
    $dialog: typeof DialogModule

    /**
     * Partita 吐司模块
     */
    $toast: typeof ToastModule

    /**
     * Partita 加载指示器模块
     */
    $loading: typeof LoadingModule

    /**
     * Partita 设备返回键模块
     */
    $dbb: typeof DbbModule
  }
}
