import Vue from 'vue'
import App from './src/App.vue'
import router from './src/router'

import yiyun_qrcode from '../dist/lib.js'
import '../dist/style.css'

import 'virtual:windi.css'

Vue.config.productionTip = false

Vue.use(yiyun_qrcode)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')