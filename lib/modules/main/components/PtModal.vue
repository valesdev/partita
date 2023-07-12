<template>
  <template v-if="isEnabled">
    <Teleport to="#app">
      <Transition
        @after-leave="onAfterLeave"
        @leave-cancelled="onLeaveCancelled">
        <template v-if="isActive">
          <div class="PtModal">
            <div class="PtModal__bg" @click="hide" />

            <div class="PtModal__fg" :class="`PtModal__fg__position-${props.position !== undefined ? props.position : 'bottom'}`">
              <slot />
            </div>
          </div>
        </template>
      </Transition>
    </Teleport>
  </template>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  /**
   * 弹窗是否可见
   */
  visible: boolean

  /**
   * 弹窗位置
   */
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void,
}>()

const show = () => {
  emit('update:visible', true)
}

const hide = () => {
  emit('update:visible', false)
}

/**
 * 是否渲染 `<Teleport>` 节点
 */
const isEnabled = ref<boolean>(false)

/**
 * 是否渲染 `.PtModal` 节点
 */
const isActive = ref<boolean>(false)

/**
 * 节点 `.PtModal` 动画结束的回调
 */
const onAfterLeave = () => {
  isEnabled.value = false
}

/**
 * 节点 `.PtModal` 动画取消的回调
 */
const onLeaveCancelled = () => {
  isEnabled.value = true
}

watch(() => props.visible, (val: boolean) => {
  if (val === true) {
    isEnabled.value = true
  }

  nextTick(() => {
    isActive.value = val
  })
}, { immediate: true })

defineExpose({
  show,
  hide
})
</script>

<style lang="scss">
.PtModal {
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &>&__bg {
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
  }

  &>&__fg {
    max-height: 100%;
    position: absolute;
    z-index: 1;

    &__position-top {
      top: 0;
      right: 0;
      left: 0;
    }

    &__position-bottom {
      right: 0;
      bottom: 0;
      left: 0;
    }

    &__position-left {
      top: 0;
      bottom: 0;
      left: 0;
    }

    &__position-right {
      top: 0;
      right: 0;
      bottom: 0;
    }

    &__position-center {
      position: static;
      margin-left: auto;
      margin-right: auto;
    }

    &__position-right,
    &__position-left {
      &>.PtViewContent {
        height: 100%;
      }
    }

    .PtViewContent {
      max-height: 100%;
    }
  }

  &.v-enter-active,
  &.v-leave-active {
    transition-property: visibility;
    transition-duration: 0.4s;

    &>.PtModal__bg {
      transition-property: visibility, opacity;
      transition-duration: 0.4s;
      will-change: opacity;
    }

    &>.PtModal__fg {
      transition-property: visibility, opacity, transform;
      transition-duration: 0.4s;
      transition-timing-function: cubic-bezier(0.1, 0.7, 0.1, 1);
      will-change: opacity, transform;
    }
  }

  &.v-enter-from,
  &.v-leave-to {
    visibility: hidden;

    &>.PtModal__bg {
      visibility: hidden;
      opacity: 0;
    }

    &>.PtModal__fg {
      visibility: hidden;

      &__position-top {
        transform: translate3d(0, -100%, 0);
      }

      &__position-bottom {
        transform: translate3d(0, 100%, 0);
      }

      &__position-left {
        transform: translate3d(-100%, 0, 0);
      }

      &__position-right {
        transform: translate3d(100%, 0, 0);
      }

      &__position-center {
        opacity: 0;
        transform: translate3d(0, 50vh, 0);
      }
    }
  }

  &.v-enter-to,
  &.v-leave-from {
    visibility: visible;

    &>.PtModal__bg {
      visibility: visible;
      opacity: 1;
    }

    &>.PtModal__fg {
      visibility: visible;
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>
