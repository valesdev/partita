<template>
  <div class="PtTitlebarButton" @click="onClick">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PtTitlebarButton',
  emits: ['click'],
  methods: {
    onClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss">
.PtTitlebarButton {
}
</style>
