<template>
  <div class="PtStatusbar" :class="{ 'mode-android': isAndroid } " />
</template>

<script>
export default {
  name: 'PtStatusbar',
  data () {
    return {
      isAndroid: false
    }
  },
  created () {
    this.isAndroid = (/Android/i.test(window.navigator.userAgent))
  }
}
</script>

<style lang="scss">
.PtStatusbar {
  width: 100%;
  background-color: #ffffff;
  height: env(safe-area-inset-top);

  &.mode-android {
    height: 25px;
  }
}
</style>
