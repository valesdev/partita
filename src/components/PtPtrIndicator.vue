<template>
  <div class="PtPtrIndicator" :style="style">
    <template v-if="$pt.config.ptr !== null && $pt.config.ptr.component !== null">
      <component :is="$pt.config.ptr.component" :state="state">
        <slot />
      </component>
    </template>

    <template v-else>
      <div class="PtPtrIndicator__wrap">
        <slot />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PtPtrIndicator',
  props: {
    threshold: { type: Number, required: true },
    state: { type: String, required: true }
  },
  computed: {
    style () {
      return {
        'margin-top': `${-this.threshold}px`
      }
    }
  }
}
</script>

<style lang="scss">
.PtPtrIndicator {
  &__wrap {
  }
}
</style>
