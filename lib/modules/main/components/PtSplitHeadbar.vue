<template>
  <div class="PtSplitHeadbar">
    <div class="PtSplitHeadbar__bar">
      <slot name="bar" />
    </div>

    <div class="PtSplitHeadbar__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.PtSplitHeadbar {
  flex: 1 1 auto;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &__bar {
    flex: 0 0 auto;
  }

  &__content {
    flex: 1 1 auto;
    height: 1%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .PtViewContent {
    flex: 1 1 auto;
    height: 1%;
  }
}
</style>
