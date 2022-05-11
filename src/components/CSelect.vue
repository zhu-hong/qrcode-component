<script>
export default {
  props: ['val', 'options'],
  data() {
    return {
      showOptions: false,
    }
  },
  methods: {
    selectVal(val) {
      this.$emit('update:val', val)
      this.$emit('change')
    },
  },
  computed: {
    selectedVal() {
      const selected = this.nanoOptions.find(({ value }) => value === this.val)
      if(selected) {
        return selected.name
      }
      return this.val
    },
    nanoOptions() {
      if(this.options[0].name) {
        return this.options
      }
      return this.options.map((o) => ({ value: o, name: o }))
    },
  },
}
</script>

<template>
  <div @click="showOptions = !showOptions" :class="['template-editor-select', { 'focus': showOptions }]">
    <span class="template-editor-select-value">{{ selectedVal }}</span>

    <svg style="width:10px;height:10px;" :class="[{ 'template-editor-select-isshow': !showOptions }]" t="1651805230614" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1894" width="16" height="16"><path d="M512 378.24l-418.88 418.88L0 704l512-512 512 512-93.12 93.12z" fill="#262626" p-id="1895"></path></svg>

    <div :class="['template-editor-select-wrapper', { 'template-editor-select-show': showOptions }]">
      <span @click="selectVal(o.value)" :class="['template-editor-select-option', { 'selected': val === o.value }]" v-for="(o, i) of nanoOptions" :key="i">{{ o.name }}</span>
    </div>

    <div v-show="showOptions" style="position:fixed;width:100vw;height:100vh;top:0;left:0;z-index:10;cursor:default;" @click.stop="showOptions = false"></div>
  </div>
</template>

<style lang="scss">
.template-editor {
  &-select {
    position: relative;
    height: 34px;
    border-width: 1px;
    border-style: solid;
    border-color: #DFE3E9;
    padding: 6px 8px;
    color: #000c25;
    border-radius: 4px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.focus {
      border-color: var(--template-editor-primary-color);
    }

    &-isshow {
      transform: rotate(180deg);
    }

    &-value {
      display: inline-block;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }

    &-wrapper {
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      padding: 4px 0;
      position: absolute;
      top: 100%;
      transform: translateY(10px) scaleY(0);
      border-radius: 4px;
      right: 0;
      width: 100%;
      max-height: 200px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      z-index: 9999;
      transform-origin: top center;
      transition: transform .15s ease-in-out;

      &.template-editor-select-show {
        transform: translateY(10px) scaleY(1);
      }
    }

    &-option {
      flex: none;
      width: 100%;
      padding: 4px 6px;
      color: #000c25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      transition: background-color .1s ease-in-out;

      &.selected {
        font-weight: 500;
        color: var(--template-editor-primary-color);
        background-color: #f5f7fa;
      }

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
