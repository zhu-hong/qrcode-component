<script>
export default {
  props: ['activeSize'],
  methods: {
    changeSize(size) {
      this.$emit('select', size)
    },
  },
}
</script>

<template>
  <el-dropdown trigger="click" @command="changeSize">
    <span style="cursor: pointer;">修改</span>
    <el-dropdown-menu class="tpl-size-option-wrapper" slot="dropdown">
      <span class="tpl-size-title">标签尺寸</span>
      <el-dropdown-item v-for="(s, i) of [[45, 30], [60, 40], [90, 60], [120, 80], [150, 100], [225, 150], [30, 45], [40, 60], [60, 90], [80, 120], [100, 150], [150, 225]]" :key="i"
        :class="['tpl-size-option', { 'active': s[0] === activeSize[0] && s[1] === activeSize[1] }]"
        style="background-color: #F6F6F6;" :command="s"
      >
        {{ `${s[0]}×${s[1]}&nbsp;mm` }}
      </el-dropdown-item>
      <el-dropdown-item class="tpl-size-option"
        style="background-color: #F6F6F6;" :command="'custom'"
      >
        自定义尺寸
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style lang="scss">
.tpl-size-option-wrapper {
  width: 210px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px !important;

  .tpl-size-title {
    width: 100%;
    color: rgba(156, 163, 175, 1);
    font-size: 14px;
  }

  .tpl-size-option {
    width: 94px;
    height: 34px;
    font-size: 12px !important;
    margin-top: 4px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: #e5e7eb solid 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      color: #0B58D2 !important;
    }
    
    &.active {
      border: 1px solid #0B58D2;
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
        transform: rotateY(180deg) rotate(-35deg) translateX(-5px) translateY(10px);
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 18px;
        height: 28px;
        background-color: #0B58D2;
        transform-origin: left bottom;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
