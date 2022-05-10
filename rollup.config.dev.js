import { defineConfig } from 'rollup'
import commonPlugin from './rollup.config.plugin'

export default defineConfig({
  input: './src/index.js',
  output: {
    format: 'esm',
    file: 'dist/lib.js',
  },
  plugins: [
    ...commonPlugin,
  ],
})