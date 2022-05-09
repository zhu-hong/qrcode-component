<script>
export default {
  data() {
    return {
      showTab: false,
    }
  },
  computed: {
    routes() {
      return this.$router.options.routes.find(({ path }) => path === '/').children
    },
  },
  methods: {
    toPath(name) {
      this.showTab = false
      if(this.$route.name === name) return
      this.$router.push({ name })
    },
  },
}
</script>

<template>
  <div :class="['w-full h-70px z-99 bg-white flex-none shadow-sm absolute top-0 left-0 flex justify-center items-center gap-4 transition-all transform', { '-translate-y-full': !showTab }]">
    <span
      v-for="r of routes" :key="r.name" 
      :class="['cursor-pointer px-4 py-2 rounded transition-all select-none hover:(opacity-80)', $route.name === r.name ? 'bg-rose-400 text-black' : 'bg-gray-900 text-white']"
      @click="toPath(r.name)"
    >
      {{ r.name }}
    </span>

    <span class="absolute top-full right-200px px-2 py-1 border rounded-b border-t-transparent cursor-pointer bg-white" @click="showTab = !showTab">
      <svg t="1651805230614" :class="['transition-all transform', { 'rotate-180': !showTab }]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1894" width="16" height="16"><path d="M512 378.24l-418.88 418.88L0 704l512-512 512 512-93.12 93.12z" fill="#262626" p-id="1895"></path></svg>
    </span>
  </div>
</template>
