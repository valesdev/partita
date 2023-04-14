<template>
  <div class="PtSpinner">
    <template v-if="$pt.config.spinner !== null && $pt.config.spinner.component !== null">
      <component :is="$pt.config.spinner.component">
        <slot />
      </component>
    </template>

    <template v-else>
      <div class="PtSpinner__wrap">
        <slot />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PtSpinner'
}
</script>

<style lang="scss">
.PtSpinner {
  &__wrap {
  }
}
</style>
