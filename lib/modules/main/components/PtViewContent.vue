<template>
  <div
    ref="root"
    class="PtViewContent"
    :style="style"
    @scroll.passive="onScroll"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
  >
    <template v-if="enabledPtr">
      <slot name="ptr">
        <PtPtrWrapper
          :component="ptrComponent"
          :threshold="ptrThreshold"
          :state="ptrState"
        />
      </slot>
    </template>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { type Component, ref, computed } from 'vue'

import MainModule from '@/modules/main'

const props = defineProps<{
  /**
   * 下拉刷新被触发时的回调
   */
  pullToRefresh?: Function,

  /**
   * 下拉刷新自定义组件
   */
  ptrComponent?: Component,

  /**
   * 下拉刷新触发阈值
   */
  ptrThreshold?: number,

  /**
   * 无限滚动被触发时的回调
   */
  infiniteScroll?: Function
}>()

const root = ref<HTMLElement | null>(null)

/**
 * 当前是否正在执行下拉刷新
 */
var isDoingPtr = ref<boolean>(false)

/**
 * 当前是否正在执行无限滚动
 */
var isDoingIs = ref<boolean>(false)

/**
 * 当前下拉刷新状态
 */
var ptrState = ref<string>('pending_pull')

var ptrTouchStartY: number = 0

var isPtrMoving: boolean = false

/**
 * 当前是否已启用下拉刷新
 */
const enabledPtr = computed<boolean>(() => {
  return props.pullToRefresh !== undefined
})

/**
 * 当前是否已启用无限滚动
 */
const enabledIs = computed<boolean>(() => {
  return props.infiniteScroll !== undefined
})

/**
 * 下拉刷新自定义组件
 */
const ptrComponent = computed(() => {
  return props.ptrComponent ?? MainModule.options.ptr?.component
})

/**
 * 触发下拉刷新的滑动距离阈值
 */
const ptrThreshold = computed<number>(() => {
  return props.ptrThreshold ?? MainModule.options.ptr?.threshold ?? 0
})

const style = computed(() => {
  return {
    'transition-property': 'padding-top',
    'transition-timing-function': 'ease-in-out',
    'transition-duration': (isDoingPtr.value ? '0s' : '.25s')
  }
})

const onScroll = () => {
  // 执行无限滚动
  if (!enabledIs.value) return
  if (isDoingIs.value) return

  if (root.value !== null) {
    const scrollTop = root.value.scrollTop
    const scrollHeight = root.value.scrollHeight
    const height = root.value.offsetHeight
    const distance = height * 0.5

    if (scrollTop + height >= scrollHeight - distance) {
      isDoingIs.value = true
      Promise.resolve()
        .then(() => props.infiniteScroll?.apply(undefined))
        .finally(() => {
          isDoingIs.value = false
        })
    }
  }
}

const onTouchstart = (event: TouchEvent) => {
  // 执行下拉刷新
  if (!enabledPtr.value) return
  if (event.touches.length !== 1) return

  if (root.value !== null) {
    // 如未处于顶部
    if (root.value.scrollTop !== 0) return

    isDoingPtr.value = true
    ptrTouchStartY = event.touches[0].pageY
    isPtrMoving = false
  }
}

const onTouchmove = (event: TouchEvent) => {
  // 执行下拉刷新
  if (!enabledPtr.value) return
  if (!isDoingPtr.value) return
  if (event.changedTouches.length !== 1) return

  // 滑动距离
  const moved = (event.changedTouches[0].pageY - ptrTouchStartY) / 2

  // 如为上滑
  if (moved < 0) {
    isDoingPtr.value = false
    ptrTouchStartY = 0
    isPtrMoving = false
    return
  }

  // 如为下滑
  if (moved > 0) {
    isPtrMoving = true
  }

  if (isPtrMoving) {
    // 阻止默认行为
    event.preventDefault()

    _setPullDownIndicatorHeight(moved)

    if (moved < ptrThreshold.value) {
      ptrState.value = 'pulling'
    } else {
      ptrState.value = 'pending_release'
    }
  }
}

const onTouchend = (event: TouchEvent) => {
  // 执行下拉刷新
  if (!enabledPtr.value) return
  if (!isDoingPtr.value) return
  if (!isPtrMoving) return
  if (event.changedTouches.length !== 1) return

  // 滑动距离
  const moved = (event.changedTouches[0].pageY - ptrTouchStartY) / 2

  // 阻止默认行为
  event.preventDefault()

  isDoingPtr.value = false
  ptrTouchStartY = 0
  isPtrMoving = false

  if (moved < ptrThreshold.value) {
    // 复位
    _setPullDownIndicatorHeight(0)

    setTimeout(() => {
      ptrState.value = 'pending_pull'
    }, 200)
  } else {
    _setPullDownIndicatorHeight(ptrThreshold.value)

    ptrState.value = 'loading'

    Promise.all([
      // 开始执行回调
      Promise.resolve(props.pullToRefresh?.apply(undefined)),

      // 等待回调执行完成
      new Promise(resolve => setTimeout(resolve, 1e3))
    ])
      .finally(() => {
        // 回调执行完成，标记结束
        ptrState.value = 'loaded'

        setTimeout(() => {
          // 复位
          _setPullDownIndicatorHeight(0)

          setTimeout(() => {
            ptrState.value = 'pending_pull'
          }, 200)
        }, 1e3)
      })
  }
}

const _setPullDownIndicatorHeight = (value: number) => {
  if (root.value !== null) {
    root.value.style.paddingTop = `${value}px`
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
