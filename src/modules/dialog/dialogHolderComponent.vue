<template>
  <TransitionGroup tag="div" class="PtDialogHolder">
    <template v-for="item in $dialog.currentItems" :key="item.key">
      <div class="PtDialogHolder__item">
        <div class="PtDialogHolder__item-bg" @click.self="onClickItemBg(item)" />

        <div class="PtDialogHolder__item-fg">
          <div class="PtDialogHolder__item-title" v-if="item.title !== null">{{ item.title }}</div>

          <div class="PtDialogHolder__item-content" v-if="item.content !== null">{{ item.content }}</div>

          <div class="PtDialogHolder__item-content" v-if="item.component !== null">
            <component :is="item.component.is" v-bind="item.component.props" />
          </div>

          <div class="PtDialogHolder__item-buttons">
            <template v-for="button in item.buttons" :key="button.value">
              <div
                tabindex="0"
                class="PtDialogHolder__item-button"
                :class="{ 'highlight': button.isHighlight }"
                @click="onClickItemButton(item, button)"
              >{{ button.label }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </TransitionGroup>
</template>

<script>
import LogUtils from '../../utils/log'

export default {
  name: 'PtDialogHolder',
  methods: {
    onClickItemBg (item) {
      if (!item.cancelable) return

      Promise.resolve()
        .then(() => {
          if (item.callback !== null) {
            return Promise.resolve()
              .then(() => {
                return item.callback(null)
              })
              .then(value => {
                item.resolver(value)
              })
          } else {
            item.resolver(null)
          }
        })
        .then(() => {
          return this.$dialog.hideByKey(item.key)
        })
        .catch(() => {
          LogUtils.i('[pt-dialog] error', ...arguments)
        })
    },

    onClickItemButton (item, button) {
      Promise.resolve()
        .then(() => {
          if (item.callback !== null) {
            return Promise.resolve()
              .then(() => {
                return item.callback(button.value)
              })
              .then(value => {
                item.resolver(value)
              })
          } else {
            item.resolver(button.value)
          }
        })
        .then(() => {
          return this.$dialog.hideByKey(item.key)
        })
        .catch(() => {
          LogUtils.i('[pt-dialog] error', ...arguments)
        })
    }
  }
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

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
