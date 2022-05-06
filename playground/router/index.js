import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home.vue'),
      children: [
        {
          path: '',
          component: () => import('../pages/QrCodeContainerPlayer.vue'),
        },
      ],
    },
  ],
})