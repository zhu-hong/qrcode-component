<script>
export default {
  props: ['mask', 'currentNode'],
}
</script>

<template>
  <div draggable="false" :id="mask.id" v-show="mask.v" class="border-2px border-[#FF9B04] fixed cursor-move children:(inline-block absolute rounded-full border border-[#B4B8C5] bg-white)">
    <!-- 左上 -->
    <span draggable="false" class="w-12px h-12px top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" style="cursor: nwse-resize;"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="tl">
    </span> 
    <!-- 右上 -->
    <span draggable="false" class="w-12px h-12px top-0 right-0 transform translate-x-1/2 -translate-y-1/2" style="cursor: nesw-resize;"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="tr">
    </span>
    <!-- 左下 -->
    <span draggable="false" class="w-12px h-12px bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2" style="cursor: nesw-resize;"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="bl">
    </span>
    <!-- 右下 -->
    <span draggable="false" class="w-12px h-12px bottom-0 right-0 transform translate-x-1/2 translate-y-1/2" style="cursor: nwse-resize;"
          v-show="['qr', 'logo', 'rect'].includes(currentNode.type)" data-position="br">
    </span>

    <!-- 左 -->
    <span draggable="false" class="w-8px h-16px top-1/2 left-0 transform -translate-x-2/3 -translate-y-1/2" style="cursor: ew-resize;" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect'].includes(currentNode.type)" data-position="l">
    </span>
    <!-- 右 -->
    <span draggable="false" class="w-8px h-16px top-1/2 right-0 transform translate-x-2/3 -translate-y-1/2" style="cursor: ew-resize;" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect', 'line'].includes(currentNode.type)" data-position="r">
    </span>
    <!-- 上 -->
    <span draggable="false" class="w-16px h-8px top-0 left-1/2 transform -translate-x-1/2 -translate-y-2/3" style="cursor: ns-resize;" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect'].includes(currentNode.type)" data-position="t">
    </span>
    <!-- 下 -->
    <span draggable="false" class="w-16px h-8px bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2/3" style="cursor: ns-resize;" 
          v-show="['title', 'subTitle', 'field', 'logo', 'rect', 'line'].includes(currentNode.type)" data-position="b">
    </span>
  </div>
</template>
