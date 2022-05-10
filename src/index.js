import './reset.css'

import QrCodeContainerComponent from './components/QrCodeContainer.vue'
import QrCodeTemplateComponent from './components/QrCodeTemplate.vue'
import QrCodeBinderComponent from './components/QrCodeBinder.vue'
import QrCodeTemplateEditorComponent from './components/QrCodeTemplateEditor.vue'

export default {
  install: (Vue) => {
    Vue.component(QrCodeContainerComponent.name, QrCodeContainerComponent)
    Vue.component(QrCodeTemplateComponent.name, QrCodeTemplateComponent)
    Vue.component(QrCodeBinderComponent.name, QrCodeBinderComponent)
    Vue.component(QrCodeTemplateEditorComponent.name, QrCodeTemplateEditorComponent)
  },
}

export const QrCodeContainer = {
  install: (Vue) => {
    Vue.component(QrCodeContainerComponent.name, QrCodeContainerComponent)
  }
}

export const QrCodeTemplate = {
  install: (Vue) => {
    Vue.component(QrCodeTemplateComponent.name, QrCodeTemplateComponent)
  }
}

export const QrCodeBinder = {
  install: (Vue) => {
    Vue.component(QrCodeBinderComponent.name, QrCodeBinderComponent)
  }
}

export const QrCodeTemplateEditor = {
  install: (Vue) => {
    Vue.component(QrCodeTemplateEditorComponent.name, QrCodeTemplateEditorComponent)
  }
}
