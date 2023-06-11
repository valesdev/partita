<template>
  <div class="PtSpinner">
    <template v-if="component !== undefined">
      <component :is="component">
        <slot />
      </component>
    </template>

    <template v-else>
      <div class="PtSpinner__wrap">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Component, computed } from 'vue'

import MainModule from '@/modules/main'

const component = computed<Component | undefined>(() => {
  return MainModule.options.spinner?.component
})
</script>

<style lang="scss">
.PtSpinner {
  &__wrap {}
}
</style>
