<template>
  <div class="PtSplitFootbar">
    <div class="PtSplitFootbar__content">
      <slot />
    </div>

    <div class="PtSplitFootbar__bar">
      <slot name="bar" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PtSplitFootbar'
}
</script>

<style lang="scss">
.PtSplitFootbar {
  flex: 1 1 auto;
  height: 100%;
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
