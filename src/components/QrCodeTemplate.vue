<script>
export default {
  name: 'QrCodeTemplate',
  props: ['templateInfo'],
}
</script>

<template>
  <img :src="templateInfo.svgDemo" style="display:inline-block;object-fit:cover;">
</template>
