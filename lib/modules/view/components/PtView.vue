<template>
  <div class="PtView">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount } from 'vue'
import { injectionKeyForViewStackFn } from '../injectionKeys'
import { ViewCreateEvent, ViewDestroyEvent, ViewHideEvent, ViewShowEvent } from '@/modules/view'

const props = defineProps<{
  viewKey: string,
}>()

const emit = defineEmits<{
  (e: 'show', event: ViewShowEvent): void,
  (e: 'hide', event: ViewHideEvent): void,
  (e: 'create', event: ViewCreateEvent): void,
  (e: 'destroy', event: ViewDestroyEvent): void
}>()

const viewStackFn = inject(injectionKeyForViewStackFn)

const emitOnCreate = (event: ViewCreateEvent) => {
  emit('create', event)
}

const emitOnDestroy = (event: ViewDestroyEvent) => {
  emit('destroy', event)
}

const emitOnShow = (event: ViewShowEvent) => {
  emit('show', event)
}

const emitOnHide = (event: ViewHideEvent) => {
  emit('hide', event)
}

viewStackFn?.registerView(
  props.viewKey,
  {
    emitOnCreate,
    emitOnDestroy,
    emitOnShow,
    emitOnHide
  }
)

onBeforeUnmount(() => {
  viewStackFn?.unregisterView(
    props.viewKey
  )
})
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
