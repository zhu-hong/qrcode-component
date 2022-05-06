<script>
import PlaygroundMenu from './components/PlaygroundMenu.vue'
export default {
  components: {
    PlaygroundMenu,
  },
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col min-w-6xl">
    <PlaygroundMenu />
    <div class="flex-1 bg-[#fdfdfd] overflow-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
