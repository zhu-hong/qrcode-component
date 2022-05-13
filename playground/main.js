import Vue from 'vue'
import App from './src/App.vue'
import router from './src/router'

// import YiYunQrCode from '../dist/index.min.js'
// import '../dist/style.css'

import YiYunQrCode from '../src'

import 'virtual:windi.css'

Vue.config.productionTip = false

Vue.use(YiYunQrCode)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')