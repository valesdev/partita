<template>
  <div class="PtPtrIndicator" :style="style">
    <template v-if="component !== undefined">
      <component :is="component" :state="state">
        <slot />
      </component>
    </template>

    <template v-else>
      <div class="PtPtrIndicator__wrap">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import MainModule from '@/modules/main'

const props = defineProps<{
  /**
   * 下拉刷新触发阈值
   */
   threshold: number,

  /**
   * 下拉刷新状态
   */
  state?: string
}>()

const component = computed(() => {
  return MainModule.options.ptr?.component
})

const style = computed(() => {
  return {
    'margin-top': `${-props.threshold}px`
  }
})
</script>

<style lang="scss">
.PtPtrIndicator {
  &__wrap {}
}
</style>
