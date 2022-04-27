<script>
export default {
  name: 'Starter',
}
</script>

<template>
  <div class="w-50 flex flex-col justify-center items-center h-50 bg-pink-100 rounded">
    <img src="../assets/rollup.png" class="w-48px animate-bounce">
    <el-button class="mb-4" type="danger" icon="el-icon-sunny animate-spin" size="small"></el-button>
    <span class="text-sm text-teal-400">Powered by <a target="_blank" href="https://rollupjs.org">rollup</a> & <a target="_blank" href="https://vitejs.dev">Vite</a></span>
  </div>
</template>

<style lang="scss">
.el-button {
  &--small {
    font-size: 14px;
  }
}
</style>
