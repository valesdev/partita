import LogUtils from './utils/log'

// modules
import viewModule from './modules/view'
import dialogModule from './modules/dialog'
import toastModule from './modules/toast'
import loadingModule from './modules/loading'
import dbbModule from './modules/dbb'

// components
import PtHolder from './components/PtHolder'
import PtViewStack from './components/PtViewStack'
import PtView from './components/PtView'
import PtViewContent from './components/PtViewContent'
import PtStatusbar from './components/PtStatusbar'
import PtHomeIndicator from './components/PtHomeIndicator'
import PtTitlebar from './components/PtTitlebar'
import PtTitlebarButton from './components/PtTitlebarButton'
import PtTitlebarBackButton from './components/PtTitlebarBackButton'
import PtTabbar from './components/PtTabbar'
import PtSplitHeadbar from './components/PtSplitHeadbar'
import PtSplitFootbar from './components/PtSplitFootbar'
import PtModal from './components/PtModal'
import PtSpinner from './components/PtSpinner'
import PtPtrIndicator from './components/PtPtrIndicator'
import PtSlider from './components/PtSlider'
import PtSliderItem from './components/PtSliderItem'

export default class {
  static install (app) {
    LogUtils.d('[plugin install] pt')

    app.config.globalProperties.$pt = this

    // bootstrap modules
    app.use(viewModule)
    app.use(dialogModule)
    app.use(toastModule)
    app.use(loadingModule)
    app.use(dbbModule, { viewModule, dialogModule, toastModule })

    // register components
    app.component(PtHolder.name, PtHolder)
    app.component(PtViewStack.name, PtViewStack)
    app.component(PtView.name, PtView)
    app.component(PtViewContent.name, PtViewContent)
    app.component(PtStatusbar.name, PtStatusbar)
    app.component(PtHomeIndicator.name, PtHomeIndicator)
    app.component(PtTitlebar.name, PtTitlebar)
    app.component(PtTitlebarButton.name, PtTitlebarButton)
    app.component(PtTitlebarBackButton.name, PtTitlebarBackButton)
    app.component(PtTabbar.name, PtTabbar)
    app.component(PtSplitHeadbar.name, PtSplitHeadbar)
    app.component(PtSplitFootbar.name, PtSplitFootbar)
    app.component(PtModal.name, PtModal)
    app.component(PtSpinner.name, PtSpinner)
    app.component(PtPtrIndicator.name, PtPtrIndicator)
    app.component(PtSlider.name, PtSlider)
    app.component(PtSliderItem.name, PtSliderItem)
  }

  static setConfig (options = {}) {
    this._config = {
      ptr: null,
      spinner: null,
      ...options
    }
  }

  static get config () {
    return this._config
  }
}
