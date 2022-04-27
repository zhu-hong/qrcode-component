import { defineConfig } from 'rollup'
import commonPlugin, { BabelPluginComponent } from './rollup.config.plugin'
import { babel } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default defineConfig({
  input: './src/index.js',
  output: {
    format: 'esm',
    file: 'dist/lib.js',
    sourcemap: true,
  },
  plugins: [
    ...commonPlugin,
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            'useBuiltIns': 'usage',
            'corejs': '3',
          },
        ]
      ],
      plugins: [
        ['@babel/plugin-transform-runtime'],
        BabelPluginComponent,
      ],
      babelHelpers: 'runtime',
    }),
    terser({
      compress: {
        pure_funcs: ['console.log'],
      },
    }),
  ],
})