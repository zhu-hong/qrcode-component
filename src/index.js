import QrCodeContainerComponent from './components/QrCodeContainer.vue'

export default {
  install: (Vue) => {
    Vue.component(QrCodeContainerComponent.name, QrCodeContainerComponent)
  },
}

export const QrCodeContainer = {
  install: (Vue) => {
    Vue.component(QrCodeContainerComponent.name, QrCodeContainerComponent)
  }
}