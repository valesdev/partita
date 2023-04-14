<template>
  <div
    class="PtViewContent"
    :style="style"
    @scroll.passive="onScroll"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
  >
    <template v-if="enabledPtr">
      <PtPtrIndicator :threshold="ptrThreshold" :state="ptrState" />
    </template>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'PtViewContent',
  props: {
    /**
     * @var {Function} pullToRefresh 下拉刷新被触发时的回调
     */
    pullToRefresh: { type: Function, required: false, default: null },

    /**
     * @var {Function} infiniteScroll 无限滚动被触发时的回调
     */
    infiniteScroll: { type: Function, required: false, default: null }
  },
  data () {
    return {
      isDoingPtr: false,
      isDoingIs: false,
      ptrState: 'pending_pull',
      _ptrTouchStartY: 0,
      _isPtrMoving: false
    }
  },
  computed: {
    /**
     * @var {Boolean} enabledPtr 当前是否已启用下拉刷新
     */
    enabledPtr () {
      return typeof this.pullToRefresh === 'function'
    },

    /**
     * @var {Boolean} enabledIs 当前是否已启用无限滚动
     */
    enabledIs () {
      return typeof this.infiniteScroll === 'function'
    },

    /**
     * @var {Number} ptrThreshold 触发下拉刷新的滑动距离阈值
     */
    ptrThreshold () {
      if (this.$pt.config.ptr !== null && this.$pt.config.ptr.threshold !== null) {
        return this.$pt.config.ptr.threshold
      }
      return 0
    },

    style () {
      return {
        'transition-property': 'padding-top',
        'transition-timing-function': 'ease-in-out',
        'transition-duration': (this.isDoingPtr ? '0s' : '.25s')
      }
    }
  },
  methods: {
    onScroll () {
      // 执行无限滚动
      if (!this.enabledIs) return
      if (this.isDoingIs) return

      const scrollTop = this.$el.scrollTop
      const scrollHeight = this.$el.scrollHeight
      const height = this.$el.offsetHeight
      const distance = height * 0.5

      if (scrollTop + height >= scrollHeight - distance) {
        this.isDoingIs = true
        Promise.resolve()
          .then(() => this.infiniteScroll())
          .finally(() => {
            this.isDoingIs = false
          })
      }
    },

    onTouchstart (event) {
      // 执行下拉刷新
      if (!this.enabledPtr) return
      if (event.touches.length !== 1) return

      // 如未处于顶部
      if (this.$el.scrollTop !== 0) return

      this.isDoingPtr = true
      this._ptrTouchStartY = event.touches[0].pageY
      this._isPtrMoving = false
    },

    onTouchmove (event) {
      // 执行下拉刷新
      if (!this.enabledPtr) return
      if (!this.isDoingPtr) return
      if (event.changedTouches.length !== 1) return

      // 滑动距离
      const moved = (event.changedTouches[0].pageY - this._ptrTouchStartY) / 2

      // 如为上滑
      if (moved < 0) {
        this.isDoingPtr = false
        this._ptrTouchStartY = 0
        this._isPtrMoving = false
        return
      }

      // 如为下滑
      if (moved > 0) {
        this._isPtrMoving = true
      }

      if (this._isPtrMoving) {
        // 阻止默认行为
        event.preventDefault()

        this._setPullDownIndicatorHeight(moved)

        if (moved < this.ptrThreshold) {
          this.ptrState = 'pulling'
        } else {
          this.ptrState = 'pending_release'
        }
      }
    },

    onTouchend (event) {
      // 执行下拉刷新
      if (!this.enabledPtr) return
      if (!this.isDoingPtr) return
      if (!this._isPtrMoving) return
      if (event.changedTouches.length !== 1) return

      // 滑动距离
      const moved = (event.changedTouches[0].pageY - this._ptrTouchStartY) / 2

      // 阻止默认行为
      event.preventDefault()

      this.isDoingPtr = false
      this._ptrTouchStartY = 0
      this._isPtrMoving = false

      if (moved < this.ptrThreshold) {
        // 复位
        this._setPullDownIndicatorHeight(0)

        setTimeout(() => {
          this.ptrState = 'pending_pull'
        }, 200)
      } else {
        this._setPullDownIndicatorHeight(this.ptrThreshold)

        this.ptrState = 'loading'

        Promise.all([
          // 开始执行回调
          Promise.resolve(this.pullToRefresh()),

          // 等待回调执行完成
          new Promise(resolve => setTimeout(resolve, 1e3))
        ])
          .finally(() => {
            // 回调执行完成，标记结束
            this.ptrState = 'loaded'

            setTimeout(() => {
              // 复位
              this._setPullDownIndicatorHeight(0)

              setTimeout(() => {
                this.ptrState = 'pending_pull'
              }, 200)
            }, 1e3)
          })
      }
    },

    _setPullDownIndicatorHeight (value) {
      this.$el.style.paddingTop = `${value}px`
    }
  }
}
</script>

<style lang="scss">
.PtViewContent {
  position: relative;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
}
</style>
