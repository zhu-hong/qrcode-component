<script>
export default {
  name: 'QrCodeTemplate',
  props: ['tplInfo'],
}
</script>

<template>
  <img :src="tplInfo.svgDemo" style="display:inline-block;object-fit:cover;">
</template>
