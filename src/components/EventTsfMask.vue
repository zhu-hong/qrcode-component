<script>
export default {
  props: ['mask', 'currentNode'],
}
</script>

<template>
  <div draggable="false" :id="mask.id" v-show="mask.v" class="template-editor-event-tsfmask">
    <!-- 左上 -->
    <span draggable="false" class="vertex"
          style="cursor: nwse-resize; top: 0; left: 0; transform: translate(-50%,-50%);"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="tl">
    </span> 
    <!-- 右上 -->
    <span draggable="false" class="vertex"
          style="cursor: nesw-resize; top: 0; right: 0; transform: translate(50%,-50%);"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="tr">
    </span>
    <!-- 左下 -->
    <span draggable="false" class="vertex"
          style="cursor: nesw-resize; bottom: 0px; left: 0px; transform: translate(-50%,50%);"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="bl">
    </span>
    <!-- 右下 -->
    <span draggable="false" class="vertex"
          style="cursor: nwse-resize; bottom: 0px; right: 0px;  transform: translate(50%,50%);"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="br">
    </span>

    <!-- 左 -->
    <span draggable="false" class="side-left"
          style="cursor: ew-resize; top: 50%; left: 0px; transform: translate(-66.666%,-50%);" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect'].includes(currentNode.type)" data-position="l">
    </span>
    <!-- 右 -->
    <span draggable="false" class="side-right"
          style="cursor: ew-resize; top: 50%; right: 0;  transform: translate(66.666%,-50%);" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect', 'line'].includes(currentNode.type)" data-position="r">
    </span>
    <!-- 上 -->
    <span draggable="false" class="side-top"
          style="cursor: ns-resize; top: 0px; left: 50%; transform: translate(-50%,-66.666%);" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect'].includes(currentNode.type)" data-position="t">
    </span>
    <!-- 下 -->
    <span draggable="false" class="side-bottom"
          style="cursor: ns-resize; bottom: 0px; left: 50%; transform: translate(-50%,66.666%);" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect', 'line'].includes(currentNode.type)" data-position="b">
    </span>
  </div>
</template>

<style lang="scss">
.template-editor-event-tsfmask {
  border: 2px solid #FF9B04;
  position: fixed;
  cursor: move;
  box-sizing: border-box;

  > span {
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    border: 1px solid #B4B8C5;
    background-color: white;
  }

  .vertex {
    width: 12px;
    height: 12px;
  }

  .side {
    &-top, &-bottom {
      width: 16px;
      height: 8px;
    }
    &-left, &-right {
      width: 8px;
      height: 16px;
    }
  }
}
</style>
