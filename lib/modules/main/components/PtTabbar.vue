<template>
  <div class="PtTabbar">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PtTabbar'
})
</script>

<style lang="scss">
.PtTabbar {
  display: flex;
  justify-content: space-around;
}
</style>
