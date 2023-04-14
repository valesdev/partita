<template>
  <div class="PtModal" :class="{ 'active': visible }">
    <div class="PtModal__bg" @click="hide" />

    <div class="PtModal__fg" :class="`PtModal__fg__position-${position}`">
      <PtViewContent :style="{ 'width': width, 'height': height }">
        <slot />
      </PtViewContent>
    </div>
  </div>
</template>

<script>
import PtViewContent from 'partita/components/PtViewContent'

export default {
  name: 'PtModal',
  emits: ['update:visible'],
  props: {
    visible: { type: Boolean, required: true },
    position: { type: String, required: false, default: 'bottom' },
    width: { type: String, required: false, default: null },
    height: { type: String, required: false, default: null }
  },
  components: {
    [PtViewContent.name]: PtViewContent
  },
  provide () {
    return {
      modal: this
    }
  },
  methods: {
    show () {
      this.$emit('update:visible', true)
    },

    hide () {
      this.$emit('update:visible', false)
    }
  }
}
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
