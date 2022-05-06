import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home.vue'),
      redirect: 'QrCodeContainerPlayer',
      children: [
        {
          path: 'QrCodeContainerPlayer',
          name: 'QrCodeContainerPlayer',
          component: () => import('../pages/QrCodeContainerPlayer.vue'),
        },
        {
          path: 'QrCodeTemplatePlayer',
          name: 'QrCodeTemplatePlayer',
          component: () => import('../pages/QrCodeTemplatePlayer.vue'),
        },
        {
          path: 'QrCodeBinderPlayer',
          name: 'QrCodeBinderPlayer',
          component: () => import('../pages/QrCodeContainerPlayer.vue'),
        },
        {
          path: 'QrCodeTemplateEditorPlayer',
          name: 'QrCodeTemplateEditorPlayer',
          component: () => import('../pages/QrCodeContainerPlayer.vue'),
        },
      ],
    },
  ],
})