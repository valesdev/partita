<template>
  <div class="PtPtrWrapper" :style="style">
    <template v-if="component !== undefined">
      <component :is="component" :state="state">
        <slot />
      </component>
    </template>

    <template v-else>
      <div class="PtPtrWrapper__wrap">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Component, computed } from 'vue'

const props = defineProps<{
  /**
   * 下拉刷新自定义组件
   */
  component?: Component,

  /**
   * 下拉刷新触发阈值
   */
  threshold: number,

  /**
   * 下拉刷新状态
   */
  state?: string
}>()

const style = computed(() => {
  return {
    'margin-top': `${-props.threshold}px`
  }
})
</script>

<style lang="scss">
.PtPtrWrapper {
  &__wrap {}
}
</style>
