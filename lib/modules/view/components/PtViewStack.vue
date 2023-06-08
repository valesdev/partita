<template>
  <TransitionGroup
    ref="root"
    tag="div"
    class="PtViewStack"
    :css="false"
    @before-enter="_onTransitionBeforeEnter"
    @enter="_onTransitionEnter"
    @before-leave="_onTransitionBeforeLeave"
    @leave="_onTransitionLeave"
  >
    <slot>
      <component
        v-for="view in items"
        :key="view.key"
        :is="view.vNode"
        :id="view.key"
      />
    </slot>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, ref, provide, createVNode, getCurrentInstance } from 'vue'
import RandomUtils from '@/utils/random'
import { default as ViewModule, type ViewInstance, type ViewInstances, type StackItem } from '@/modules/view'
import { ViewCreateEvent, ViewDestroyEvent, ViewHideEvent, ViewShowEvent } from '../events'
import { viewStackFn as injectionKeyForViewStackFn } from '../injectionKeys'

const app = getCurrentInstance()

const root = ref<ComponentPublicInstance | null>(null)

const props = defineProps<{
  /**
   * 视图栈名称
   */
  name: string,
}>()

const items = ref<StackItem[]>([])

const views = ref<ViewInstances>({})

const registerView = (
  key: string,
  instance: ViewInstance
) => {
  views.value[key] = instance
}

const unregisterView = (
  key: string
) => {
  delete views.value[key]
}

const push = ({
  name,
  params
}: {
  name: string
  params?: Record<string, unknown> | null
}): void => {
  const key = RandomUtils.string(6)
  const view = _generateView(key, name, params)

  if (view !== null) {
    if (items.value.length > 0) {
      const key = items.value[items.value.length - 1].key
      views.value[key].emitOnHide(new ViewHideEvent)
    }

    items.value.push(view)
    window.setTimeout(() => {
      views.value[key].emitOnCreate(new ViewCreateEvent)
      views.value[key].emitOnShow(new ViewShowEvent)
    }, 0)
  }
}

const pop = ({
  steps = 1
}: {
  steps?: number
} = {
    steps: undefined
  }): void => {
  if (items.value.length > steps) {
    let isRunDefault = true

    const runDefault = () => {
      items.value.splice(items.value.length - steps)

      const key = items.value[items.value.length - steps].key
      views.value[key].emitOnShow(new ViewShowEvent)
    }

    for (
      let i = items.value.length - 1;
      i >= items.value.length - steps;
      i--
    ) {
      const key = items.value[i].key
      views.value[key].emitOnHide(new ViewHideEvent)
      views.value[key].emitOnDestroy(
        Object.assign(new ViewDestroyEvent, {
          preventDefault() {
            isRunDefault = false
          },
          runDefault
        })
      )
    }

    if (isRunDefault) {
      runDefault()
    }
  }
}

const replace = ({
  name,
  params
}: {
  name: string
  params?: Record<string, unknown> | null
}): void => {
  const key = RandomUtils.string(6)
  const view = _generateView(key, name, params)

  if (view !== null) {
    if (items.value.length > 0) {
      let isRunDefault = true

      const runDefault = () => {
        items.value.splice(
          items.value.length - 1,
          1,
          view
        )
        window.setTimeout(() => {
          views.value[key].emitOnCreate(new ViewCreateEvent)
          views.value[key].emitOnShow(new ViewShowEvent)
        }, 0)
      }

      {
        const key = items.value[items.value.length - 1].key
        views.value[key].emitOnHide(new ViewHideEvent)
        views.value[key].emitOnDestroy(
          Object.assign(new ViewDestroyEvent, {
            preventDefault() {
              isRunDefault = false
            },
            runDefault
          })
        )
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

const _generateView = (
  key: string,
  name: string,
  props?: Record<string, unknown> | null
): StackItem | null => {
  if (app !== null) {
    const component = app.appContext.app.component(`View${name}`)

    if (component === undefined) {
      throw new Error('Invalid view component name.')
    }

    const vNode = createVNode(component, props)
    vNode.appContext = app.appContext

    return { key, vNode }
  }

  return null
}

// 动画部分

const _isLeaving = ref(false)

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
  if (_getViewCount() > 0 && !_isLeaving.value) {
    _animateElementBegin(el, 100)

    const lastView = _getLastView()
    if (lastView !== null) {
      _animateElementBegin(lastView, 0)
    }
  }
}

const _onTransitionEnter = (el: Element, done: () => void) => {
  if (_getViewCount() > 1 && !_isLeaving.value) {
    setTimeout(() => {
      _animateElementRun(el, 0, done)
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

  _isLeaving.value = true
  setTimeout(() => {
    _isLeaving.value = false
  }, 400)
}

const _onTransitionLeave = (el: Element, done: () => void) => {
  _animateElementRun(el, 100, done)

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
  el.classList.add('PtView__animating')
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
    el.classList.remove('PtView__animating')
    if (complete !== null) {
      complete()
    }
  }, { passive: true, once: true })
  el.style.transform = `translateX(${percent}%)`
}

provide(injectionKeyForViewStackFn, {
  registerView,
  unregisterView,
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
</script>

<style lang="scss">
.PtViewStack {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 1;

  .PtView__animating {
    pointer-events: none;
  }
}
</style>
