<template>
  <div class="PtView" :id="id">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PtView',
  emits: ['show', 'hide', 'create', 'destroy'],
  props: {
    viewKey: { type: String, required: false, default: null }
  },
  provide () {
    return {
      view: this
    }
  },
  computed: {
    id () {
      if (this.viewKey !== null) {
        return `pt-view-${this.viewKey}`
      }
      return null
    }
  },
  methods: {
    _doShow (event) {
      this.$emit('show', event)
    },

    _doHide (event) {
      this.$emit('hide', event)
    },

    _doCreate (event) {
      this.$emit('create', event)
    },

    _doDestroy (event) {
      this.$emit('destroy', event)
    }
  }
}
</script>

<style lang="scss">
.PtView {
  background-color: #ffffff;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  > .PtViewContent {
    flex: 1 1 auto;
    height: 1px;
  }
}
</style>
