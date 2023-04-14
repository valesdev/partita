<template>
  <div class="PtSliderItem">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PtSliderItem',
  inject: ['slider']
}
</script>

<style lang="scss">
.PtSliderItem {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
