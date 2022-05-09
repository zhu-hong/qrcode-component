import Commonjs from '@rollup/plugin-commonjs'
import NodeResolve from '@rollup/plugin-node-resolve'
import Postcss from 'rollup-plugin-postcss'
import Vue from 'rollup-plugin-vue'
import CssNano from 'cssnano'

export default [
  Commonjs(),
  NodeResolve({
    browser: true,
  }),
  Vue({
    css: false,
  }),
  Postcss({
    extract: 'style.css',
    plugins: [
      CssNano(),
    ],
  }),
]

export const BabelPluginComponent = [
  'component',
  {
    'libraryName': 'element-ui',
    'styleLibraryName': '~src/theme',
  }
]