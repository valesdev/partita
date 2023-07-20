<template>
  <div class="PtTitlebarButton" @click="onClick">
    <slot />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
  emit(
    'click',
    event
  )
}
</script>

<style lang="scss">
.PtTitlebarButton {}
</style>
