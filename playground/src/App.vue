<script>
import PlaygroundMenu from './components/PlaygroundMenu.vue'
export default {
  components: {
    PlaygroundMenu,
  },
}
</script>

<template>
  <div class="w-screen h-screen relative flex flex-col">
    <PlaygroundMenu />
    <div class="flex-1 bg-[#fdfdfd]">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #CFD1D4;
  border-radius: 5px;
}
::-webkit-scrollbar-corner,
::-webkit-scrollbar-track {
  background: transparent;
}
</style>
