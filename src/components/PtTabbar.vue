<template>
  <div class="PtTabbar">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PtTabbar'
}
</script>

<style lang="scss">
.PtTabbar {
  display: flex;
  justify-content: space-around;
}
</style>
