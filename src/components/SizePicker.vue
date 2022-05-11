<script>
export default {
  props: ['activeSize'],
  data() {
    return {
      showOptions: false,
    }
  },
  methods: {
    changeSize(size) {
      this.$emit('select', size)
      this.showOptions = false
    },
  },
}
</script>

<template>
  <div class="size-picker-wrapper">
    <span class="size-picker-tip" @click="showOptions = !showOptions">修改</span>
    <div :class="['size-picker-option-wrapper', { 'show-size-options': this.showOptions }]">
      <span v-for="(s, i) of [[45, 30], [60, 40], [90, 60], [120, 80], [150, 100], [225, 150], [30, 45], [40, 60], [60, 90], [80, 120], [100, 150], [150, 225]]" :key="i"
        :class="['size-picker-option', { 'active': s[0] === activeSize[0] && s[1] === activeSize[1] }]"
        style="background-color: #F6F6F6;" @click="changeSize(s)"
      >
        {{ `${s[0]}×${s[1]}&nbsp;mm` }}
      </span>
      <span class="size-picker-option"
        style="background-color: #F6F6F6;" @click="changeSize('custom')"
      >
        自定义尺寸
      </span>
    </div>
    
    <div v-show="showOptions" style="position:fixed;width:100vw;height:100vh;top:0;left:0;z-index:10;" @click="showOptions = false"></div>
  </div>
</template>

<style lang="scss">
.size-picker {
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
    right: 0;
    transform: translate(10px,12px) scaleY(0);
    transform-origin: top center;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 3px;
    width: 210px;
    padding: 8px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border-radius: 4px;
    z-index: 9999;
    background-color: white;

    opacity: 0;
    transition: all .3s ease-in-out;

    &.show-size-options {
      transform: translate(10px,12px) scaleY(1);
      opacity: 1;
    }
  }

  &-option {
    width: 94px;
    height: 34px;
    font-size: 12px;
    margin-top: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: #e5e7eb solid 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      color: var(--template-editor-primary-color);
    }
    
    &.active {
      border: 1px solid var(--template-editor-primary-color);
      position: relative;
      overflow: hidden;

      &::after {
        content: 'L';
        position: absolute;
        bottom: 0;
        right: 0;
        color: white;
        font-weight: 500;
        font-size: .7rem;
        transform: rotateY(180deg) rotate(-40deg) translateX(0px) translateY(4px);
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 18px;
        height: 28px;
        background-color: var(--template-editor-primary-color);
        transform-origin: left bottom;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
