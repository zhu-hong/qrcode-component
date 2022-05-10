<script>
export default {
  props: ['content'],
  data() {
    return {
      timer: null,
      toolTipVisible: true,
    }
  },
  methods: {
    showToolTip() {
      console.log(1)
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
  mounted() {
    this.toolTipVisible = false
  },
}
</script>

<template>
  <el-tooltip effect="dark" :content="content" placement="bottom" :manual="true" v-model="toolTipVisible">
    <div @mouseenter="showToolTip" @mouseleave="hiddenTip" @click="hiddenTip">
      <slot></slot>
    </div>
  </el-tooltip>
</template>
