import Commonjs from '@rollup/plugin-commonjs'
import NodeResolve from '@rollup/plugin-node-resolve'
import Postcss from 'rollup-plugin-postcss'
import Vue from 'rollup-plugin-vue'
import Url from '@rollup/plugin-url'
import WindiCSS from 'rollup-plugin-windicss'
import CssNano from 'cssnano'

export default [
  Commonjs(),
  NodeResolve(),
  Vue({
    css: false,
  }),
  Postcss({
    extract: 'style.css',
    plugins: [
      CssNano(),
    ],
  }),
  Url({
    include: ['**/*.ttf', '**/*.woff', '**/*.svg', '**/*.png'],
    fileName: '[name][extname]',
    destDir: 'dist/fonts',
  }),
  ...WindiCSS({
    config: {
      preflight: false,
      extract: {
        exclude: ['./src/theme/*.css'],
      },
    },
  }),
]

export const BabelPluginComponent = [
  'component',
  {
    'libraryName': 'element-ui',
    'styleLibraryName': '~src/theme',
  }
]