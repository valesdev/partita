<template>
  <PtTitlebarButton @click="onClick">
    <slot>
      <a href="javascript:void(0);">Back</a>
    </slot>
  </PtTitlebarButton>
</template>

<script setup lang="ts">
import { inject } from 'vue'

import { injectionKeyForViewStackFn } from '@/modules/view/injectionKeys'

const viewStackFn = inject(injectionKeyForViewStackFn)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
  let runDefault = true

  emit(
    'click',
    Object.assign(event, {
      preventDefault() {
        runDefault = false
        return false
      }
    })
  )

  if (runDefault) {
    viewStackFn?.pop()
  }
}
</script>

<style lang="scss">
.PtTitlebarBackButton {}
</style>
