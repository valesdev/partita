<template>
  <TransitionGroup
    ref="root"
    tag="div"
    class="PtViewStack"
    :class="{
      'is-animating': isAnimating
    }"
    :css="false"
    @touchstart.passive="_onTouchstart"
    @touchmove.capture="_onTouchmove"
    @touchend.passive="_onTouchend"
    @before-enter="_onTransitionBeforeEnter"
    @enter="_onTransitionEnter"
    @before-leave="_onTransitionBeforeLeave"
    @leave="_onTransitionLeave">
    <slot>
      <component
        v-for="view in items"
        :key="view.key"
        :is="view.component"
        v-bind="view.bind"
        :id="`PtViewStack-item-${view.key}`"
        @pt-view-create="onViewCreate"
        @pt-view-destroy="onViewDestroy"
        @pt-view-show="onViewShow"
        @pt-view-hide="onViewHide" />
    </slot>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, ref, provide, getCurrentInstance, onBeforeUnmount, markRaw } from 'vue'
import RandomUtils from '@/utils/random'
import { default as ViewModule, type StackItem, ViewCreateEvent, ViewDestroyEvent, ViewShowEvent, ViewHideEvent } from '@/modules/view'
import { injectionKeyForViewStackFn } from '../injectionKeys'

const app = getCurrentInstance()

const root = ref<ComponentPublicInstance | null>(null)

const props = defineProps<{
  /**
   * 视图栈名称
   */
  name: string,

  /**
   * 异常回调
   *
   * @param error 异常
   */
  onError?: (error: Error) => void,
}>()

const emit = defineEmits<{
  (e: 'view-create', event: ViewCreateEvent): void
  (e: 'view-destroy', event: ViewDestroyEvent): void
  (e: 'view-show', event: ViewShowEvent): void
  (e: 'view-hide', event: ViewHideEvent): void
}>()

const items = ref<StackItem[]>([])

const isAnimating = ref<boolean>(false)

const onViewCreate = (event: ViewCreateEvent) => {
  emit('view-create', event)
}

const onViewDestroy = (event: ViewDestroyEvent) => {
  emit('view-destroy', event)
}

const onViewShow = (event: ViewShowEvent) => {
  emit('view-show', event)
}

const onViewHide = (event: ViewHideEvent) => {
  emit('view-hide', event)
}

// 逻辑部分

const push = async ({
  name,
  params
}: {
  name: string
  params?: Record<string, unknown> | null
}): Promise<void> => {
  const key = RandomUtils.string(6)
  const view = await _generateView(key, name, params)

  if (view !== null) {
    if (items.value.length > 0) {
      // 前视图 Key
      const lastKey = items.value[items.value.length - 1].key

      // 前视图 DOM
      const lastEl = window.document.getElementById(`PtViewStack-item-${lastKey}`)

      // 触发前视图 hide 事件
      lastEl?.dispatchEvent(new ViewHideEvent)
    }

    // 新视图入栈
    items.value.push(view)

    window.setTimeout(() => {
      // 新视图 DOM
      const el = window.document.getElementById(`PtViewStack-item-${key}`)

      // 触发新视图 create 事件
      el?.dispatchEvent(new ViewCreateEvent)

      // 触发新视图 show 事件
      el?.dispatchEvent(new ViewShowEvent)
    }, 0)
  }
}

const pop = ({
  steps = 1
}: {
  steps?: number
} = { steps: undefined }): void => {
  if (items.value.length > steps) {
    let isRunDefault = true

    const runDefault = () => {
      // 原视图出栈
      items.value.splice(items.value.length - steps)

      // 前视图 Key
      const lastKey = items.value[items.value.length - steps].key

      // 前视图 DOM
      const lastEl = window.document.getElementById(`PtViewStack-item-${lastKey}`)

      // 触发前视图 show 事件
      lastEl?.dispatchEvent(new ViewShowEvent)
    }

    for (
      let i = items.value.length - 1;
      i >= items.value.length - steps;
      i--
    ) {
      // 原视图 Key
      const key = items.value[i].key

      // 原视图 DOM
      const el = window.document.getElementById(`PtViewStack-item-${key}`)

      // 触发原视图 hide 事件
      el?.dispatchEvent(new ViewHideEvent)

      // 触发原视图 destroy 事件
      const destroyEvent = new ViewDestroyEvent
      destroyEvent.preventDefault = () => {
        isRunDefault = false
      }
      destroyEvent.runDefault = () => {
        setTimeout(() => {
          runDefault()
        }, 0)
      }
      el?.dispatchEvent(destroyEvent)
    }

    if (isRunDefault) {
      runDefault()
    }
  }
}

const replace = async ({
  name,
  params
}: {
  name: string
  params?: Record<string, unknown> | null
}): Promise<void> => {
  const key = RandomUtils.string(6)
  const view = await _generateView(key, name, params)

  if (view !== null) {
    if (items.value.length > 0) {
      let isRunDefault = true

      const runDefault = () => {
        // 原视图出栈、新视图入栈
        items.value.splice(
          items.value.length - 1,
          1,
          view
        )

        window.setTimeout(() => {
          // 新视图 DOM
          const el = window.document.getElementById(`PtViewStack-item-${key}`)

          // 触发新视图 create 事件
          el?.dispatchEvent(new ViewCreateEvent)

          // 触发新视图 show 事件
          el?.dispatchEvent(new ViewShowEvent)
        }, 0)
      }

      {
        // 原视图 Key
        const key = items.value[items.value.length - 1].key

        // 原视图 DOM
        const el = window.document.getElementById(`PtViewStack-item-${key}`)

        // 触发原视图 hide 事件
        el?.dispatchEvent(new ViewHideEvent)

        // 触发原视图 destroy 事件
        const destroyEvent = new ViewDestroyEvent
        destroyEvent.preventDefault = () => {
          isRunDefault = false
        }
        destroyEvent.runDefault = () => {
          setTimeout(() => {
            runDefault()
          }, 0)
        }
        el?.dispatchEvent(destroyEvent)
      }

      if (isRunDefault) {
        runDefault()
      }
    }
  }
}

const clear = (): void => {
  items.value.splice(1)
}

const getSize = (): number | null => {
  return items.value.length
}

const _generateView = async (
  key: string,
  name: string,
  bind?: Record<string, unknown> | null
): Promise<StackItem | null> => {
  if (app !== null) {
    return Promise.resolve()
      .then(() => {
        const component = app.appContext.app.component(`View${name}`)

        if (component === undefined) {
          throw new Error('Invalid view component name.')
        }

        /**
         * @link https://github.com/vuejs/core/issues/7898
         * @link https://github.com/vuejs/core/pull/7901
         */
        if ('__asyncLoader' in component) {
          return component.__asyncLoader()
        } else {
          return component
        }
      })
      .then(component => {
        return {
          key,
          component: markRaw(component),
          bind
        }
      })
      .catch(error => {
        if (props.onError !== undefined) {
          props.onError(error)
          return null
        }

        throw error
      })
  }

  return Promise.resolve(null)
}

// 动画部分

let isLeaving: boolean = false

const _getViewCount = () => {
  if (root.value === null) return 0

  return root.value.$el.children.length
}

const _getLastView = () => {
  if (root.value === null) return null

  if (root.value.$el.children.length <= 0) return null

  return root.value.$el.children[root.value.$el.children.length - 1] as HTMLElement
}

const _getLastSecondView = () => {
  if (root.value === null) return null

  if (root.value.$el.children.length <= 1) return null

  return root.value.$el.children[root.value.$el.children.length - 2] as HTMLElement
}

const _onTransitionBeforeEnter = (el: Element) => {
  if (_getViewCount() > 0 && !isLeaving) {
    _animateElementBegin(el, 100)

    const lastView = _getLastView()
    if (lastView !== null) {
      _animateElementBegin(lastView, 0)
    }
  }
}

const _onTransitionEnter = (el: Element, done: () => void) => {
  if (_getViewCount() > 1 && !isLeaving) {
    isAnimating.value = true

    setTimeout(() => {
      _animateElementRun(el, 0, () => {
        isAnimating.value = false
        done()
      })
    }, 0)

    const lastSecondView = _getLastSecondView()
    if (lastSecondView !== null) {
      _animateElementRun(lastSecondView, -50, null)
    }
  }
}

const _onTransitionBeforeLeave = (el: Element) => {
  _animateElementBegin(el, 0)

  const lastSecondView = _getLastSecondView()
  if (lastSecondView !== null) {
    _animateElementBegin(lastSecondView, -50)
  }

  isLeaving = true
  setTimeout(() => {
    isLeaving = false
  }, 400)
}

const _onTransitionLeave = (el: Element, done: () => void) => {
  isAnimating.value = true
  _animateElementRun(el, 100, () => {
    isAnimating.value = false
    done()
  })

  if (_getViewCount() > 1) {
    const lastSecondView = _getLastSecondView()
    if (lastSecondView !== null) {
      _animateElementRun(lastSecondView, 0, null)
    }
  }
}

const _animateElementBegin = (
  element: Element,
  percent: number
) => {
  const el = element as HTMLElement
  el.style.transitionProperty = 'transform'
  el.style.transitionDuration = '400ms'
  el.style.transitionTimingFunction = 'cubic-bezier(0.3, 0.4, 0, 0.9)'
  el.style.transform = `translateX(${percent}%)`
  el.classList.add('is-animating')
}

const _animateElementRun = (
  element: Element,
  percent: number,
  complete: (() => void) | null
) => {
  const el = element as HTMLElement
  el.addEventListener('transitionend', function () {
    el.style.transitionProperty = ''
    el.style.transitionDuration = ''
    el.style.transitionTimingFunction = ''
    el.classList.remove('is-animating')
    if (complete !== null) {
      complete()
    }
  }, { passive: true, once: true })
  el.style.transform = `translateX(${percent}%)`
}

// 触控部分

let isSwipeInit: boolean = false
let isSwiping: boolean = false
let swipeStartAt: number = 0
let swipeStartX: number = 0
let swipeStartY: number = 0
let swipeLastX: number = 0
let swipeLastY: number = 0

const _onTouchstart = (event: TouchEvent) => {
  if (event.touches.length !== 1) return

  const touch = event.touches[0]

  if (touch.clientX > 30) return

  isSwipeInit = true
  swipeStartAt = event.timeStamp
  swipeStartX = touch.clientX
  swipeStartY = touch.clientY
}

const _onTouchmove = (event: TouchEvent) => {
  if (!isSwipeInit) return

  if (event.touches.length !== 1) return

  const touch = event.touches[0]

  swipeLastX = touch.clientX
  swipeLastY = touch.clientY

  const deltaX = swipeLastX - swipeStartX
  const deltaY = swipeLastY - swipeStartY

  if (!isSwiping) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwiping = true
    } else {
      isSwiping = false
      isSwipeInit = false
    }
  }

  if (!isSwiping) return

  event.stopPropagation()
  event.preventDefault()

  if (_getViewCount() > 1) {
    const lastView = _getLastView()
    if (lastView !== null) {
      _translateElementSwiping(lastView, `${Math.max(0, deltaX)}px`)
    }

    const lastSecondView = _getLastSecondView()
    if (lastSecondView !== null) {
      _translateElementSwiping(lastSecondView, `calc(-50% + ${Math.max(0, deltaX / 2)}px)`)
    }
  }
}

const _onTouchend = (event: TouchEvent) => {
  if (!isSwipeInit) return
  if (!isSwiping) return

  isSwipeInit = false
  isSwiping = false

  const deltaX = swipeLastX - swipeStartX
  const viewportWidth = (event.currentTarget as HTMLElement).offsetWidth
  const velocityX = deltaX / (event.timeStamp - swipeStartAt)

  if (velocityX > 0.2 || deltaX > viewportWidth / 2) {
    if (_getViewCount() > 1) {
      const lastView = _getLastView()
      if (lastView !== null) {
        _translateElementFinish(lastView)
      }

      const lastSecondView = _getLastSecondView()
      if (lastSecondView !== null) {
        _translateElementFinish(lastSecondView)
      }
    }

    pop()
  } else {
    if (_getViewCount() > 1) {
      const lastView = _getLastView()
      if (lastView !== null) {
        _translateElementRestore(lastView, '0px')
      }

      const lastSecondView = _getLastSecondView()
      if (lastSecondView !== null) {
        _translateElementRestore(lastSecondView, '-50%')
      }
    }
  }
}

const _translateElementSwiping = (
  element: Element,
  value: string
) => {
  const el = element as HTMLElement
  el.style.transform = `translateX(${value})`
  el.classList.add('is-animating')
  isAnimating.value = true
}

const _translateElementFinish = (
  element: Element
) => {
  const el = element as HTMLElement
  el.classList.remove('is-animating')
  isAnimating.value = false
}

const _translateElementRestore = (
  element: Element,
  value: string
) => {
  const el = element as HTMLElement
  el.addEventListener('transitionend', function () {
    el.style.transitionProperty = ''
    el.style.transitionDuration = ''
    el.style.transitionTimingFunction = ''
    el.classList.remove('is-animating')
    isAnimating.value = false
  }, { passive: true, once: true })
  el.style.transitionProperty = 'transform'
  el.style.transitionDuration = '400ms'
  el.style.transitionTimingFunction = 'cubic-bezier(0.3, 0.4, 0, 0.9)'
  el.style.transform = `translateX(${value})`
  el.classList.add('is-animating')
  isAnimating.value = true
}

// 其他

provide(injectionKeyForViewStackFn, {
  push,
  pop,
  replace,
  clear,
  getSize
})

ViewModule.registerStack(
  props.name,
  {
    push,
    pop,
    replace,
    clear,
    getSize
  }
)

onBeforeUnmount(() => {
  ViewModule.unregisterStack(
    props.name
  )
})
</script>

<style lang="scss">
.PtViewStack {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 1;

  &.is-animating {
    pointer-events: none;
  }

  .PtView {
    &.is-animating {
      box-shadow: 0 0 30px rgb(0, 0, 0, 0.2);
    }
  }
}
</style>
