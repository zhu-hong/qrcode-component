import './theme/fonts/element-icons.woff'
import './theme/fonts/element-icons.ttf'

import 'virtual:windi.css'

import QrCodeContainer from './components/QrCodeContainer.vue'

export default {
  install: (Vue) => {
    Vue.component(QrCodeContainer.name, QrCodeContainer)
  },
}