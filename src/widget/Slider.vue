<script>
let inDrag = false
let basicX = 0
let wrapperWidth = 0
let basicScale = 0

export default {
  props: ['val', 'max'],
  async mounted() {
    await this.$nextTick()

    wrapperWidth = this.$el.getBoundingClientRect().width
    this.$refs.progress.style.width = this.val / this.max * 100 + '%'
    this.$refs.dragNode.style.left = this.val / this.max * 100 + '%'

    this.$refs.dragNode.addEventListener('mousedown', this.startDrag)

    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.stopDrag)
  },
  destroyed() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.stopDrag)
  },
  methods: {
    startDrag(e) {
      inDrag = true
      basicX = e.clientX
      basicScale = Number(this.$refs.progress.style.width.split('%')[0])
    },
    handleMouseMove(e) {
      if(!inDrag) return
      
      let distance = e.clientX - basicX
      let scale = distance / wrapperWidth * 100 + basicScale

      if(scale < 0) {
        scale = 0
      }
      if(scale > 100) {
        scale = 100
      }
      this.$refs.progress.style.width = Math.round(scale) + '%'
      this.$refs.dragNode.style.left = Math.round(scale) + '%'

      this.$emit('update:val', Math.round(this.max * (scale / 100)))
    },
    stopDrag() {
      inDrag = false
      this.$emit('change')
    },
  },
}
</script>

<template>
  <div class="template-editor-slider-wrapper">
    <div class="template-editor-slider-progress" ref="progress"></div>
    <div class="template-editor-slider-button" ref="dragNode" draggable="false"></div>
  </div>
</template>

<style lang="scss">
.template-editor-slider {
  &-wrapper {
    height: 6px;
    background-color: #E4E7ED;
    border-radius: 3px;

    position: relative;
  }
  &-progress {
    position: absolute;
    height: 100%;
    border-radius: 3px;
    width: 0;
    background-color: var(--template-editor-primary-color);
  }
  &-button {
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%) scale(1);
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    border: 2px solid var(--template-editor-primary-color);
    transition: transform .2s linear;

    &:hover {
      transform:  translate(-50%,-50%) scale(1.2);
      cursor: grab;
    }
    &:active {
      cursor: grabbing;
    }
  }
}
</style>
