<template>
  <TransitionGroup
    tag="div"
    class="PtLoadingHolder"
  >
    <div class="PtLoadingHolder__item" v-if="currentShown">
      <div class="PtLoadingHolder__item-bg" />
      <div class="PtLoadingHolder__item-fg">
        <template v-if="currentContent !== null">
          <PtSpinner>{{ currentContent }}</PtSpinner>
        </template>
        <template v-else>
          <PtSpinner />
        </template>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import LoadingModule from '@/modules/loading'

const currentShown = computed<boolean>(() => {
  return LoadingModule.currentShown
})

const currentContent = computed<string | null>(() => {
  return LoadingModule.currentContent
})
</script>

<style lang="scss">
.PtLoadingHolder {
  &__item {
    position: fixed;
    z-index: 40;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &__item-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
  }

  &__item-fg {
    position: relative;
    z-index: 1;
  }
}
</style>
