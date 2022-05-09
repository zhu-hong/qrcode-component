import Vue from 'vue'
import App from './src/App.vue'
import router from './src/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import YiYunQrCode from '../dist/lib.js'
import '../dist/style.css'

import 'virtual:windi.css'

Vue.config.productionTip = false

Vue.use(YiYunQrCode)
Vue.use(ElementUI)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')