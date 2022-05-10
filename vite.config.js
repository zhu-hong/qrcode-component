import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  root: 'playground',
  plugins: [
    createVuePlugin(),
    WindiCSS({
      config: {
        preflight: false,
      },
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
})
