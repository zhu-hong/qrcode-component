<script>
import QrCode from 'qrcode.vue'
import { encodeSvg, generateQrCodeContent, renderText } from '../utils'

export default {
  name: 'QrCodeBinder',
  props: {
    tplInfo: {
      type: Object,
      required: true,
    },
    tplData: {
      type: Object,
      required: true,
    },
    focusColor: {
      type: String,
      default: '#fbbf24',
    },
  },
  components: {
    QrCode,
  },
  data() {
    return {
      focusVisible: false,
      focusType: '',
      focusIndex: 0,
      focusText: '',
    }
  },
  mounted() {
    this.renderTemplate()
  },
  computed: {
    qrCodeText() {
      return generateQrCodeContent(this.tplData.id)
    },
  },
  methods: {
    renderTemplate() {
      const qrCodeContainer = this.$refs.qrCodeContainer
      qrCodeContainer.innerHTML = this.tplInfo.svg

      this.renderData()
    },
    async renderData() {
      await this.$nextTick()

      const qrCodeContainer = this.$refs.qrCodeContainer
      qrCodeContainer.innerHTML = this.tplInfo.svg

      const qrSvg = this.$refs.qrCodeSvg.$el.innerHTML
      qrCodeContainer.querySelector('[data-type=qr]').setAttribute('href', 'data:image/svg+xml;utf8,' + encodeSvg(qrSvg))

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
    showFocus(type, index, text) {
      this.focusVisible = true

      this.focusType = type
      this.focusIndex = index
      this.focusText = text
      this.renderFocus()
    },
    renderFocus() {
      if(!this.focusVisible) return

      const mask = this.$refs.focuser
      const qrCodeContainer = this.$refs.qrCodeContainer

      if(['title', 'subTitle'].includes(this.focusType)) {
        const needMask = qrCodeContainer.querySelector(`[data-type=${this.focusType}-placeholder`)
        const len = Number(needMask.getAttribute('data-len'))
        let { top, left, height, width } = needMask.getBoundingClientRect()
        if(len) {
          needMask.textContent = '十'.repeat(len)
          let newPosition = needMask.getBoundingClientRect()
          width = newPosition.width
          left = newPosition.left
        } else {
           width = qrCodeContainer.getBoundingClientRect().width * Number(needMask.getAttribute('data-max')) / 100
        }

        mask.style.width = width + 20 + 'px'
        mask.style.top = top + 'px'
        mask.style.left = left + 'px'
        mask.style.height = height + 10 + 'px'
      } else if(this.focusType === 'field') {
        const needMasks = qrCodeContainer.querySelectorAll(`[data-type=${this.focusType}-placeholder${this.tplInfo.tagCount}`)
        needMasks.forEach((needMask, i) => {
          if(i === this.focusIndex) {
            const len = Number(needMask.getAttribute('data-len'))
            let { top, left, height, width } = needMask.getBoundingClientRect()
            if(len) {
              needMask.textContent = '十'.repeat(len)
              let newPosition = needMask.getBoundingClientRect()
              width = newPosition.width
              left = newPosition.left
            } else {
              width = qrCodeContainer.getBoundingClientRect().width * Number(needMask.getAttribute('data-max')) / 100
            }

            mask.style.width = width + 20 + 'px'
            mask.style.top = top + 'px'
            mask.style.left = left + 'px'
            mask.style.height = height + 10 + 'px'
          }
        })
      }

      if((typeof this.focusText === 'string' || typeof this.focusText === 'number') && this.focusText !== '') {
        mask.querySelector('span').style.display = 'inline-block'
        mask.querySelector('span').textContent = this.focusText
      } else {
        mask.querySelector('span').style.display = 'none'
      }
    },
    hiddenFocus() {
      this.focusVisible = false
    },
  },
  watch: {
    tplInfo: {
      deep: true,
      handler() {
        this.renderTemplate()
      },
    },
    tplData: {
      deep: true,
      handler() {
        this.renderData()
      },
    },
  },
}
</script>

<template>
  <div>
    <div ref="qrCodeContainer" style="width: 100%; height: 100%;"></div>

    <QrCode render-as="svg" :value="qrCodeText" style="display: none;" ref="qrCodeSvg" />

    <span
      v-show="focusVisible" style="display:inline-block;z-index:999;position:fixed;border-width:4px;border-style:solid;box-sizing:border-box;transform:translate(-10px, -5px);"
      ref="focuser" :style="{ 'border-color': focusColor }"
    >
      <span :style="{ 'background-color': focusColor }" style="display:inline-block;position:absolute;padding:4px;color:black;font-size:16px;top:0;right:0;transform:translate(4px,-100%);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
    </span>
  </div>
</template>
