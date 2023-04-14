<template>
  <PtTitlebarButton @click="onClick">
    <slot>
      <a href="javascript:void(0);">Back</a>
    </slot>
  </PtTitlebarButton>
</template>

<script>
export default {
  name: 'PtTitlebarBackButton',
  inject: ['viewStack'],
  emits: ['click'],
  methods: {
    onClick (event) {
      let runDefault = true

      this.$emit('click', Object.assign(event, {
        preventDefault () {
          runDefault = false
          return false
        }
      }))

      if (runDefault) {
        this.viewStack.pop()
      }
    }
  }
}
</script>

<style lang="scss">
.PtTitlebarBackButton {
}
</style>
