<script>
export default {
  name: 'QrCodeTemplate',
  props: ['templateInfo'],
}
</script>

<template>
  <img :src="templateInfo.svgDemo" style="display: inline-block; width: 100%; object-fit: cover;">
</template>
