<template>
  <TransitionGroup tag="div" class="PtToastHolder">
    <template v-for="item in $toast.currentItems" :key="item.key">
      <div class="PtToastHolder__item" @click="onClickItem(item)">
        <div class="PtToastHolder__item-bg" />

        <div class="PtToastHolder__item-fg">{{ item.content }}</div>
      </div>
    </template>
  </TransitionGroup>
</template>

<script>
export default {
  name: 'PtToastHolder',
  methods: {
    onClickItem (item) {
      Promise.resolve()
        .then(() => {
          return this.$toast.hideByKey(item.key)
        })
    }
  }
}
</script>

<style lang="scss">
.PtToastHolder {
  &__item {
    position: fixed;
    z-index: 30;
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
