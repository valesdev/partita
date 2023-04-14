<template>
  <TransitionGroup tag="div" class="PtLoadingHolder">
    <div class="PtLoadingHolder__item" v-if="$loading.currentShown">
      <div class="PtLoadingHolder__item-bg" />
      <div class="PtLoadingHolder__item-fg">
        <PtSpinner>{{ $loading.currentContent }}</PtSpinner>
      </div>
    </div>
  </TransitionGroup>
</template>

<script>
export default {
  name: 'PtLoadingHolder'
}
</script>

<style lang="scss">
.PtLoadingHolder {
  &__item {
    position: fixed;
    z-index: 40;
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
