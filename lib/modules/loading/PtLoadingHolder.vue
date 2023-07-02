<template>
  <TransitionGroup
    tag="div"
    class="PtLoadingHolder"
  >
    <div class="PtLoadingHolder__item" v-if="currentItem !== null">
      <div class="PtLoadingHolder__item-bg" />
      <div class="PtLoadingHolder__item-fg">
        <template v-if="currentItem.component !== undefined">
          <component :is="currentItem.component">{{ currentItem.content }}</component>
        </template>

        <template v-else-if="globalComponent !== undefined">
          <component :is="globalComponent">{{ currentItem.content }}</component>
        </template>

        <template v-else>
          <div class="PtLoadingHolder__item-content">{{ currentItem.content }}</div>
        </template>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { type Component, computed } from 'vue'

import MainModule from '@/modules/main'
import LoadingModule, { type LoadingItem } from '@/modules/loading'

const globalComponent = computed<Component | undefined>(() => {
  return MainModule.options.loading?.component
})

const currentItem = computed<LoadingItem | null>(() => {
  return LoadingModule.currentItem
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

  &__item-content {}
}
</style>
