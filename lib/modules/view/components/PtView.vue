<template>
  <div
    ref="root"
    class="PtView"
    @pt-view-create="onCreate"
    @pt-view-destroy="onDestroy"
    @pt-view-show="onShow"
    @pt-view-hide="onHide">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ViewCreateEvent, ViewDestroyEvent, ViewShowEvent, ViewHideEvent } from '@/modules/view'

const emit = defineEmits<{
  (e: 'create', event: ViewCreateEvent): void
  (e: 'destroy', event: ViewDestroyEvent): void
  (e: 'show', event: ViewShowEvent): void
  (e: 'hide', event: ViewHideEvent): void
}>()

const root = ref<HTMLElement | null>(null)

const onCreate = (event: ViewCreateEvent) => {
  emit('create', event)
}

const onDestroy = (event: ViewDestroyEvent) => {
  emit('destroy', event)
}

const onShow = (event: ViewShowEvent) => {
  emit('show', event)
}

const onHide = (event: ViewHideEvent) => {
  emit('hide', event)
}
</script>

<style lang="scss">
.PtView {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  transform: translateX(0);

  >.PtViewContent {
    flex: 1 1 auto;
    height: 1px;
  }
}
</style>
