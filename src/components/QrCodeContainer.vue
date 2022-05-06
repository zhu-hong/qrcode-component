<script>
import QrCode from 'qrcode.vue'
import { encodeSvg, renderText } from '../utils'

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
      return this.qrCodeInfo.model
    },
    qrCodeText() {
      return `https://dl-mobileres.effio.cn/yiyunapp/?qrid=${this.qrCodeInfo.id}`
    },
  },
  async mounted() {
    await this.$nextTick()

    const qrCodeContainer = this.$refs.qrCodeContainer
    qrCodeContainer.innerHTML = this.tplInfo.svg

    const qrCanvas = this.$refs.qrCodeCanvas.$el.querySelector('canvas').toDataURL()
    qrCodeContainer.querySelector('[data-type=qr]').setAttribute('href', qrCanvas)

    // const qrSvg = this.$refs.qrCodesvg.$el.innerHTML
    // qrCodeContainer.querySelector('[data-type=qr]').setAttribute('href', 'data:image/svg+xml;utf8,' + encodeSvg(qrSvg))

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

      qrCodeContainer.querySelectorAll(`[data-count='${this.tplInfo.tagCount}']`).forEach((fieldHost, i) => {
        renderText(fieldHost, this.tplData.tagFields[i], containerWidth)
      })
    }
  },
}
</script>

<template>
  <div style="width: 100%; height: 100%;">
    <div ref="qrCodeContainer" style="width: 100%; height: 100%;"></div>
    <QrCode :value="qrCodeText" style="display: none;" ref="qrCodeCanvas" :size="300" />
    <!-- <QrCode render-as="svg" :value="qrCodeText" style="display: none;" ref="qrCodesvg" :size="300" /> -->
  </div>
</template>
