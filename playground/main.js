import Vue from 'vue'
import App from './src/App.vue'

import Starter from '../dist/lib.js'
import '../dist/style.css'

import 'virtual:windi.css'

Vue.config.productionTip = false

Vue.use(Starter)

new Vue({
  render: (h) => h(App),
}).$mount('#app')