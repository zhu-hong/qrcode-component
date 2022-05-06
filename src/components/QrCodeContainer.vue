<script>
import QrCode from 'qrcode.vue'
import { renderText } from '../utils'

export default {
  name: 'QrCodeContainer',
  props: ['qrCodeInfo'],
  components: {
    QrCode,
  },
  computed: {
    tplInfo() {
      return this.qrCodeInfo.model.config
    },
    tplData() {
      const qrCodeInfo = JSON.parse(JSON.stringify(this.qrCodeInfo))
      delete qrCodeInfo.model.config
      return qrCodeInfo.model
    },
    qrCodeText() {
      return `https://dl-mobileres.effio.cn/yiyunapp/?qrid=${this.qrCodeInfo.id}`
    },
  },
  mounted() {
    const qrCodeContainer = this.$refs.qrCodeContainer
    qrCodeContainer.innerHTML = this.tplInfo.svg

    const qrCanvas = this.$refs.qrCodeCanvas.$el.querySelector('canvas')
    qrCodeContainer.querySelector('[data-type=qr]').setAttribute('href', qrCanvas.toDataURL())


    qrCodeContainer.querySelector('[data-type=bg]').setAttribute('fill', this.tplData.backgroudColor)

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

    if(this.tplInfo.tagCount !== 0) {
      qrCodeContainer.querySelectorAll('[data-type=field]').forEach((fieldHost) => {
        fieldHost.textContent = ''
      })

      qrCodeContainer.querySelectorAll(`[data-count='${this.tplData.tagFields.length}']`).forEach((fieldHost, i) => {
        renderText(fieldHost, this.tplData.tagFields[i], containerWidth)
      })
    }

  },
}
</script>

<template>
  <div class="qrcode-container">
    <div ref="qrCodeContainer" class="qrcode-container"></div>
    <QrCode :value="qrCodeText" style="display: none;" ref="qrCodeCanvas" :size="500" />
  </div>
</template>

<style scoped>
.qrcode-container {
  width: 100%;
  height: 100%;
}
</style>
