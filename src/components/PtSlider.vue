<script>
import { h } from 'vue'

import Velocity from '../../vendor/velocity-animate'
import Hammer from '../../vendor/hammerjs'

export default {
  name: 'PtSlider',
  emits: ['update:value'],
  props: {
    value: { type: Number, required: true },
    speed: { type: Number, required: false, default: 300 },
    autoplay: { type: Boolean, required: false, default: false },
    duration: { type: Number, required: false, default: 3000 },
    loop: { type: Boolean, required: false, default: false }
  },
  provide () {
    return {
      slider: this
    }
  },
  data () {
    return {
      realIndex: (!this.loop ? this.value : this.value + 1)
    }
  },
  watch: {
    value (after, before) {
      if (after === before) return
      if (after < 0) return
      if (after > (this._getTotal() - 1)) return

      this.slideTo(after)
    }
  },
  mounted () {
    this._syncTranslate()

    this._initInterval()
    this._initTouch()
  },
  beforeUnmount () {
    this._deinitInterval()
    this._deinitTouch()
  },
  methods: {
    slideTo (index) {
      this._deinitInterval()
      this._initInterval()

      if (!this.loop) {
        this.realIndex = index
      } else {
        if (this.realIndex === 1 && index === (this._getTotal() - 1)) {
          // slide first to last
          this.realIndex = 0
        } else if (this.realIndex === (this._getRealTotal() - 2) && index === 0) {
          // slide last to first
          this.realIndex = this._getRealTotal() - 1
        } else {
          // slide normally
          this.realIndex = index + 1
        }
      }

      this._translate(this._getTranslate(this.realIndex))
    },

    slideNext () {
      this.$emit('update:value', this._getIsAtEnd() ? 0 : this.value + 1)
    },

    slidePrev () {
      this.$emit('update:value', (this._getIsAtStart() ? this._getTotal() - 1 : this.value - 1))
    },

    _getTotal () {
      return this.$slots.default().length
    },

    _getRealTotal () {
      return this.$slots.default().length + (this.loop ? 2 : 0)
    },

    _getIsAtStart () {
      return this.value === 0
    },

    _getIsAtEnd () {
      return this.value === (this._getTotal() - 1)
    },

    _translate (translate, { animated = true, omitEvents = false } = {}) {
      Velocity(
        this.$refs.inner,
        { 'translateX': `${translate}px` },
        {
          queue: false,
          duration: (animated ? this.speed : 0),
          easing: 'ease-out',
          complete: !omitEvents ? this._onSlideChange : undefined
        }
      )
    },

    _getTranslate (index) {
      return -1 * this.$refs.inner.children[index].offsetLeft
    },

    _syncTranslate () {
      this._translate(this._getTranslate(this.realIndex), { animated: false, omitEvents: false })
    },

    _restoreTranslate () {
      this._translate(this._getTranslate(this.realIndex))
    },

    _onSlideChange () {
      if (this.loop) {
        if (this.realIndex === 0) {
          this._translate(this._getTranslate(this._getRealTotal() - 2), { animated: false, omitEvents: true })
          this.realIndex = this._getRealTotal() - 2
        }
        if (this.realIndex === this._getRealTotal() - 1) {
          this._translate(this._getTranslate(1), { animated: false, omitEvents: true })
          this.realIndex = 1
        }
      }
    },

    _initInterval () {
      if (!this.autoplay) return

      this._timer = setTimeout(() => {
        this._stepTimer()
      }, this.duration)
    },

    _deinitInterval () {
      if (!this._timer) return

      clearTimeout(this._timer)
    },

    _stepTimer () {
      this.slideNext()
      this._deinitInterval()
      this._initInterval()
    },

    _initTouch () {
      this._mc = new Hammer.Manager(this.$refs.inner)
      this._mc.options.domEvents = true
      this._mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }))
      this._mc.on('panstart', this._onPanmove.bind(this))
      this._mc.on('panmove', this._onPanmove.bind(this))
      this._mc.on('panend', this._onPanend.bind(this))
      this._mc.on('pancancel', this._onPanend.bind(this))
    },

    _deinitTouch () {
      if (!this._mc) return

      this._mc.destroy()
    },

    _onPanmove (event) {
      event.srcEvent.stopPropagation()

      this._deinitInterval()

      this._translate(this._getTranslate(this.realIndex) + event.deltaX, { animated: false, omitEvents: false })
    },

    _onPanend (event) {
      event.srcEvent.stopPropagation()

      this._deinitInterval()
      this._initInterval()

      if (
        (event.velocityX >= 0.5 || event.deltaX > (this.$refs.inner.offsetWidth / 2)) &&
        ((!this.loop && !this._getIsAtStart()) || this.loop)
      ) {
        this.slidePrev()
        return
      }

      if (
        (event.velocityX <= -0.5 || event.deltaX < (0 - this.$refs.inner.offsetWidth / 2)) &&
        ((!this.loop && !this._getIsAtEnd()) || this.loop)
      ) {
        this.slideNext()
        return
      }

      this._restoreTranslate()
    }
  },
  render () {
    const children = this.$slots.default()

    const nodes = [
      ...(this.loop ? [children[children.length - 1]] : []),
      ...children,
      ...(this.loop ? [children[0]] : []),
    ]

    return h(
      'div',
      { class: 'PtSlider' },
      [
        h(
          'div',
          {
            ref: 'inner',
            class: 'PtSlider__inner'
          },
          nodes
        )
      ]
    )
  }
}
</script>

<style lang="scss">
.PtSlider {
  position: relative;
  overflow: hidden;

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
  }
}
</style>
