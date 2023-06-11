<template>
  <div class="PtStatusbar" :class="{ 'mode-android': isAndroid }" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const isAndroid = computed<boolean>(() => {
  return /Android/i.test(window.navigator.userAgent)
})
</script>

<style lang="scss">
.PtStatusbar {
  width: 100%;
  background-color: #ffffff;
  height: env(safe-area-inset-top);

  &.mode-android {
    height: 25px;
  }
}
</style>
