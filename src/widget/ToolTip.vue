<script>
export default {
  props: ['content'],
  data() {
    return {
      timer: null,
      toolTipVisible: false,
    }
  },
  methods: {
    showToolTip() {
      if(this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(() => {
        this.toolTipVisible = true
      }, 1500)
    },
    hiddenTip() {
      if(this.timer) {
        clearTimeout(this.timer)
      }

      this.toolTipVisible = false
    },
  },
}
</script>

<template>
  <div class="template-editor-tooltip-wrapper" @mouseenter="showToolTip" @mouseleave="hiddenTip" @click="hiddenTip">
    <slot></slot>

    <div class="template-editor-tooltip" v-show="toolTipVisible">{{ content }}</div>
  </div>
</template>

<style lang="scss">
.template-editor {
  &-tooltip-wrapper {
    position: relative;
  }
  &-tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%,14px);
    white-space: nowrap;
    padding: 8px 14px;
    font-size: 14px;
    background-color: black;
    color: white;
    border-radius: 6px;
    z-index: 10;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 12px;
      height: 12px;
      background-color: black;
      z-index: -1;
      top: 0;
      left: 50%;
      transform: translate(-50%,-50%) rotate(45deg);
    }
  }
}
</style>
