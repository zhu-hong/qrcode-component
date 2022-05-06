<script>
export default {
  name: 'QrCodeTemplate',
  props: ['templateInfo'],
}
</script>

<template>
  <img :src="templateInfo.svgDemo" style="width: 100%; object-fit: cover;">
</template>
