import { defineConfig } from 'rollup'
import commonPlugin, { BabelPluginComponent } from './rollup.config.plugin'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  input: './src/index.js',
  output: {
    format: 'esm',
    file: 'dist/lib.js',
  },
  plugins: [
    ...commonPlugin,
    babel({
      exclude: 'node_modules/**',
      plugins: [BabelPluginComponent],
      babelHelpers: 'bundled',
    }),
  ],
})