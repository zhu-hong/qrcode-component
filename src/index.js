import { Button } from 'element-ui'

import './theme/fonts/element-icons.woff'
import './theme/fonts/element-icons.ttf'

import Starter from './components/Starter.vue'

import 'virtual:windi.css'

export default {
  install: (Vue) => {
    Vue.component(Button.name, Button)
    Vue.component(Starter.name, Starter)
  },
}