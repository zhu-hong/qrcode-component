<script>
import QrCode from 'qrcode.vue'
import { generateQrCodeContent, renderText } from '../utils'

export default {
  name: 'QrCodeContainer',
  props: ['qrInfo'],
  components: {
    QrCode,
  },
  computed: {
    tplInfo() {
      return this.qrInfo.model.config
    },
    tplData() {
      return this.qrInfo.model
    },
    qrCodeText() {
      return generateQrCodeContent(this.qrInfo.id)
    },
  },
  async mounted() {
    await this.$nextTick()

    const qrCodeContainer = this.$refs.qrCodeContainer
    qrCodeContainer.innerHTML = this.tplInfo.svg

    const qrCanvas = this.$refs.qrCodeCanvas.$el.querySelector('canvas').toDataURL()
    qrCodeContainer.querySelector('[data-type=qr]').setAttribute('href', qrCanvas)

    if(this.tplInfo.hasLogo) {
      qrCodeContainer.querySelector('[data-type=logo]').setAttribute('href', this.tplData.logo)
    }

    const containerWidth = qrCodeContainer.getBoundingClientRect().width

    if(this.tplInfo.hasTitle) {
      let titleHost = qrCodeContainer.querySelector('[data-type=title]')
      titleHost.textContent = ''
      renderText(titleHost, this.tplData.title, containerWidth)
    }

    if(this.tplInfo.hasSubTitle) {
      let subTitleHost = qrCodeContainer.querySelector('[data-type=subTitle]')
      subTitleHost.textContent = ''
      renderText(subTitleHost, this.tplData.subTitle, containerWidth)
    }

    if(this.tplInfo.tagCount > 0) {
      qrCodeContainer.querySelectorAll('[data-type=field]').forEach((fieldHost) => {
        fieldHost.textContent = ''
      })

      qrCodeContainer.querySelectorAll(`[data-count='${this.tplInfo.tagCount}']`).forEach((fieldHost, i) => {
        renderText(fieldHost, this.tplData.tagFields[i], containerWidth)
      })
    }
  },
}
</script>

<template>
  <div>
    <div ref="qrCodeContainer" style="width: 100%; height: 100%;"></div>
    <QrCode :value="qrCodeText" style="display: none;" ref="qrCodeCanvas" :size="200" />
  </div>
</template>
