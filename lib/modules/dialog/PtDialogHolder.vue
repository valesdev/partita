<template>
  <TransitionGroup
    tag="div"
    class="PtDialogHolder"
  >
    <template v-for="item in currentItems" :key="item.key">
      <div class="PtDialogHolder__item">
        <div class="PtDialogHolder__item-bg" @click.self="onClickItemBg(item)" />

        <div class="PtDialogHolder__item-fg">
          <div class="PtDialogHolder__item-title" v-if="item.title !== null">{{ item.title }}</div>

          <div class="PtDialogHolder__item-content" v-if="item.content !== null">{{ item.content }}</div>

          <div class="PtDialogHolder__item-content" v-if="item.extraComponent !== undefined">
            <component :is="item.extraComponent.is" v-bind="item.extraComponent.props" />
          </div>

          <div class="PtDialogHolder__item-buttons" v-if="item.buttons !== undefined">
            <template v-for="button in item.buttons" :key="button.value">
              <div
                tabindex="0"
                class="PtDialogHolder__item-button"
                :class="{ 'highlighted': button.highlighted }"
                @click="onClickItemButton(item, button)"
              >{{ button.label }}</div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import LogUtils from '@/utils/log'

import DialogModule, { type DialogItem, type DialogItemButton } from '@/modules/dialog'

const currentItems = computed<DialogItem[]>(() => {
  return DialogModule.currentItems
})

const onClickItemBg = (
  item: DialogItem
) => {
  if (item.cancelable !== true) return

  Promise.resolve()
    .then(() => {
      return Promise.resolve()
        .then(() => {
          if (item.callback !== undefined) {
            return item.callback(null)
          } else {
            return null
          }
        })
        .then((value) => {
          item.resolver(value)
        })
    })
    .then(() => {
      return DialogModule.hideByKey(item.key)
    })
    .catch(e => {
      LogUtils.i('[pt-dialog] error', e)
    })
}

const onClickItemButton = (
  item: DialogItem,
  button: DialogItemButton
) => {
  Promise.resolve()
    .then(() => {
      return Promise.resolve()
        .then(() => {
          if (item.callback !== undefined) {
            return item.callback(button.value)
          } else {
            return button.value
          }
        })
        .then((value) => {
          item.resolver(value)
        })
    })
    .then(() => {
      return DialogModule.hideByKey(item.key)
    })
    .catch(e => {
      LogUtils.i('[pt-dialog] error', e)
    })
}
</script>

<style lang="scss">
.PtDialogHolder {
  &__item {
    position: fixed;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &__item-bg {
    background-color: rgba(0, 0, 0, 0.4);
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
