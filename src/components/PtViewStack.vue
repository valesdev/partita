<template>
  <TransitionGroup
    tag="div"
    name="view-stack"
    class="PtViewStack"

    :css="false"

    @before-enter="_onTransitionBeforeEnter"
    @enter="_onTransitionEnter"

    @before-leave="_onTransitionBeforeLeave"
    @leave="_onTransitionLeave"
  >
    <slot>
      <component
        ref="view"
        v-for="view in views"
        :key="view.key"
        :view-key="view.key"
        :is="view.vNode"
      />
    </slot>
  </TransitionGroup>
</template>

<script>
import Velocity from '../../vendor/velocity-animate'
import Hammer from '../../vendor/hammerjs'

export default {
  name: 'PtViewStack',
  props: {
    stack: { type: String, required: true }
  },
  provide () {
    return {
      viewStack: this
    }
  },
  computed: {
    views () {
      if (!(this.stack in this.$view.currentStacks)) {
        return []
      }

      return this.$view.currentStacks[this.stack]
    }
  },
  created () {
    this._isLeaving = false
  },
  mounted () {
    this._initTouch()
  },
  beforeUnmount () {
    this._destroyTouch()
  },
  methods: {
    pop () {
      this.$view.pop({ stack: this.stack })
    },

    _onTransitionBeforeEnter (el) {
      if (this._viewsCount() > 0 && !this._isLeaving) {
        Velocity(el, { 'translateX': '100%' }, { duration: 0 })
        Velocity(this._lastView(), { 'translateX': '0%' }, { duration: 0 })
      }
    },

    _onTransitionEnter (el, done) {
      if (this._viewsCount() > 1 && !this._isLeaving) {
        Velocity(el, { 'translateX': '0%' }, { duration: 400, easing: [0.3, 0.4, 0, 0.9], complete: done })
        Velocity(this._lastSecondView(), { 'translateX': '-50%' }, { duration: 400, easing: [0.3, 0.4, 0, 0.9] })
      }
    },

    _onTransitionBeforeLeave (el) {
      this._isLeaving = true
      setTimeout(() => {
        this._isLeaving = false
      }, 400)
    },

    _onTransitionLeave (el, done) {
      Velocity(el, { 'translateX': '100%' }, { duration: 400, easing: [0.3, 0.4, 0, 0.9], complete: done })
      if (this._viewsCount() > 1) {
        Velocity(this._lastSecondView(), { 'translateX': '0%' }, { duration: 400, easing: [0.3, 0.4, 0, 0.9] })
      }
    },

    _translateTo (value) {
      if (this._viewsCount() > 1) {
        Velocity(this._lastView(), { 'translateX': `${value * 100}%` }, { duration: 0, queue: false })
        Velocity(this._lastSecondView(), { 'translateX': `${50 * value - 50}%` }, { duration: 0, queue: false })
      }
    },

    _restoreTranslate () {
      if (this._viewsCount() > 0) {
        Velocity(this._lastView(), { 'translateX': '0%' }, { duration: 400 })
      }
      if (this._viewsCount() > 1) {
        Velocity(this._lastSecondView(), { 'translateX': '-50%' }, { duration: 400 })
      }
    },

    _viewsCount () {
      return this.$el.children.length
    },

    _lastView () {
      if (this.$el.children.length <= 0) return
      return this.$el.children[this.$el.children.length - 1]
    },

    _lastSecondView () {
      if (this.$el.children.length <= 1) return
      return this.$el.children[this.$el.children.length - 2]
    },

    _initTouch () {
      this._hm = new Hammer.Manager(this.$el)
      this._hm.options.domEvents = true
      this._hm.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }))
      this._hm.on('panstart', this._onPanMove.bind(this))
      this._hm.on('panmove', this._onPanMove.bind(this))
      this._hm.on('panend', this._onPanEnd.bind(this))
      this._hm.on('pancancel', this._onPanEnd.bind(this))
    },

    _destroyTouch () {
      if (!this._hm) return

      this._hm.destroy()
    },

    _onPanMove (event) {
      if (this._viewsCount() === 1) return

      event.srcEvent.stopPropagation()

      this._translateTo(Math.min(this.$el.offsetWidth, Math.max(0, event.deltaX)) / this.$el.offsetWidth)
    },

    _onPanEnd (event) {
      if (this._viewsCount() === 1) return

      event.srcEvent.stopPropagation()

      if (event.velocityX >= 0.5 || event.deltaX > (this.$el.offsetWidth / 2)) {
        setTimeout(() => this.pop(), 50)
        return
      }

      this._restoreTranslate()
    }
  }
}
</script>

<style lang="scss">
.PtViewStack {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 1;

  .velocity-animating {
    pointer-events: none;
  }
}
</style>
