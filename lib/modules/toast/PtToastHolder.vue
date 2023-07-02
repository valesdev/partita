<template>
  <TransitionGroup
    tag="div"
    class="PtToastHolder"
  >
    <template v-for="item in currentItems" :key="item.key">
      <div class="PtToastHolder__item" @click="onClickItem(item)">
        <div class="PtToastHolder__item-bg" />

        <div class="PtToastHolder__item-fg">
          <template v-if="item.component !== undefined">
            <component :is="item.component">
              <template v-if="item.content !== null">{{ item.content }}</template>
            </component>
          </template>

          <template v-else>
            <div class="PtToastHolder__item-content">
              <template v-if="item.content !== null">{{ item.content }}</template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ToastModule, { type ToastItem } from '@/modules/toast'

const currentItems = computed<ToastItem[]>(() => {
  return ToastModule.currentItems
})

const onClickItem = (
  item: ToastItem
) => {
  Promise.resolve().then(() => {
    return ToastModule.hideByKey(item.key)
  })
}
</script>

<style lang="scss">
.PtToastHolder {
  &__item {
    position: fixed;
    z-index: 30;
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

  &__item-content {
  }
}
</style>
