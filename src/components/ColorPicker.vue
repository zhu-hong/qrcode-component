<script>
export default {
  props: ['activeColor'],
  data() {
    return {
      showOptions: false,
    }
  },
  methods: {
    changeColor(color) {
      this.$emit('select', color)
      this.showOptions = false
    },
  },
}
</script>

<template>
  <div class="color-picker-wrapper">
    <span class="color-picker-tip" @click="showOptions = !showOptions">修改</span>
    <div :class="['color-picker-option-wrapper', { 'show-color-options': this.showOptions }]">
      <span
        v-for="color of ['#FFFFFF', '#000000', '#254569', '#2B2A6F', '#2D65B7', '#3B75A9', '#67717C', '#838276', '#2F674C', '#148B64', '#586531', '#66383A', '#B52B2B', '#E68448', '#DC8C00', '#F9BD00']" :key="color"
        :style="{ backgroundColor: color }" @click="changeColor(color)"
        :class="['color-picker-option', { 'active': activeColor === color }, { 'white-option': color === '#FFFFFF' }]"
      >
      </span>

    </div>
    <div v-show="this.showOptions" style="position:fixed;width:100vw;height:100vh;top:0;left:0;z-index:10;" @click="showOptions = false"></div>
  </div>
</template>

<style lang="scss">
.color-picker {
  &-wrapper {
    position: relative;
  }

  &-tip {
    cursor: pointer;
    color: var(--template-editor-primary-color);
  }

  &-option-wrapper {
    position: absolute;
    top: 100%;
    right: 50%;
    transform: translate(50%,12px) scaleY(0);
    transform-origin: top center;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 3px;
    width: 125px;
    padding: 8px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border-radius: 4px;
    z-index: 99;

    opacity: 0;
    transition: all .3s ease-in-out;

    &.show-color-options {
      transform: translate(50%,12px) scaleY(1);
      opacity: 1;
    }
  }
  
  &-option {
    width: 25px;
    height: 25px;
    border-radius: 4px;
    cursor: pointer;

    &.white-option {
      border: solid 1px rgba(156, 163, 175, .4);
    }

    &.active {
      border-style: solid;
      border-width: 2px;
      border-color: var(--template-editor-primary-color);
    }
  }
}
</style>