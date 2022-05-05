import Vue from 'vue'
import App from './src/App.vue'

import QrCodeContainer from '../dist/lib.js'
import '../dist/style.css'

import 'virtual:windi.css'

Vue.config.productionTip = false

Vue.use(QrCodeContainer)

new Vue({
  render: (h) => h(App),
}).$mount('#app')