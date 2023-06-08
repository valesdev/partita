<template>
  <div class="PtModal" :class="{ 'active': props.visible }">
    <div class="PtModal__bg" @click="hide" />

    <div class="PtModal__fg" :class="`PtModal__fg__position-${props.position !== undefined ? props.position : 'bottom'}`">
      <PtViewContent :style="{ 'width': props.width, 'height': props.height }">
        <slot />
      </PtViewContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import PtViewContent from './PtViewContent.vue'

const props = defineProps<{
  /**
   * 弹窗是否可见
   */
  visible: boolean,

  /**
   * 弹窗位置
   */
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right',

  /**
   * 弹窗宽度
   */
  width?: string,

  /**
   * 弹窗高度
   */
  height?: string,
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

defineExpose({
  show,
  hide
})
</script>

<style lang="scss">
.PtModal {
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  visibility: hidden;
  transition-property: visibility;
  transition-duration: 0.4s;

  &__bg {
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    visibility: hidden;
    opacity: 0;
    transition-property: visibility, opacity;
    transition-duration: 0.4s;
    will-change: opacity;
  }

  &__fg {
    max-height: 100%;
    background-color: #ffffff;
    position: absolute;
    z-index: 1;
    visibility: hidden;
    transition-property: visibility, opacity, transform;
    transition-duration: 0.4s;
    transition-timing-function: cubic-bezier(0.1, 0.7, 0.1, 1);
    will-change: opacity, transform;

    &__position-top {
      top: 0;
      right: 0;
      left: 0;
      transform: translate3d(0, -100%, 0);
    }

    &__position-bottom {
      right: 0;
      bottom: 0;
      left: 0;
      transform: translate3d(0, 100%, 0);
    }

    &__position-left {
      top: 0;
      bottom: 0;
      left: 0;
      transform: translate3d(-100%, 0, 0);
    }

    &__position-right {
      top: 0;
      right: 0;
      bottom: 0;
      transform: translate3d(100%, 0, 0);
    }

    &__position-center {
      position: static;
      margin-left: auto;
      margin-right: auto;
      opacity: 0;
      transform: translate3d(0, 50vh, 0);
    }

    &__position-right,
    &__position-left {
      & > .PtViewContent {
        height: 100%;
      }
    }

    > .PtViewContent {
      max-height: 100%;
    }
  }

  &.active {
    visibility: visible;

    .PtModal__bg {
      visibility: visible;
      opacity: 1;
    }

    .PtModal__fg {
      visibility: visible;
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>
