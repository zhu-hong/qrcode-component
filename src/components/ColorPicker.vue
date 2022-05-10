<script>
export default {
  props: ['activeColor'],
  methods: {
    changeColor(color) {
      this.$emit('select', color)
    },
  },
}
</script>

<template>
  <el-dropdown trigger="click" @command="changeColor">
    <span style="cursor: pointer;color: var(--template-editor-primary-color);">修改</span>
    <el-dropdown-menu slot="dropdown" class="tpl-color-option-wrapper">
      <el-dropdown-item v-for="color of ['#FFFFFF', '#000000', '#254569', '#2B2A6F', '#2D65B7', '#3B75A9', '#67717C', '#838276', '#2F674C', '#148B64', '#586531', '#66383A', '#B52B2B', '#E68448', '#DC8C00', '#F9BD00']" :key="color"
                        :style="{ backgroundColor: color + '!important' }"
                        :class="['tpl-color-option', { 'active': activeColor === color }, { 'white-option': color === '#FFFFFF' }]"
                        :command="color">
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style lang="scss">
.tpl-color-option-wrapper {
  width: 125px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px !important;

  .tpl-color-option {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 4px !important;
    padding: 0 !important;

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