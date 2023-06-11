<template>
  <div class="PtTitlebar">
    <div class="PtTitlebar__left">
      <slot name="left" />
    </div>

    <div class="PtTitlebar__center">
      <slot name="center" />
    </div>

    <div class="PtTitlebar__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.PtTitlebar {
  display: flex;
  align-items: center;

  &__left {
    flex: 0 0 auto;
    width: calc(90 / 360) * 100%;
    display: flex;
    justify-content: flex-start;
  }

  &__center {
    flex: 0 0 auto;
    width: calc(180 / 360) * 100%;
    display: flex;
    justify-content: center;
  }

  &__right {
    flex: 0 0 auto;
    width: calc(90 / 360) * 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
