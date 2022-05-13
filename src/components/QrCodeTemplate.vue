<script>
export default {
  name: 'QrCodeTemplate',
  props: {
    tplInfo: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <img :src="tplInfo.svgDemo" style="display:inline-block;object-fit:cover;">
</template>
