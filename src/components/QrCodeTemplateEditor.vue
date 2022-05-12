<script>
import { nativeControls, fontFamilys as nativeFonts, nativeColors } from '../data'
import { generateControl, reRenderDynamicAttrs, getId } from '../utils'
import EventTsfMask from '../widget/EventTsfMask.vue'
import ColorPicker from '../widget/ColorPicker.vue'
import SizePicker from '../widget/SizePicker.vue'
import CSelect from '../widget/CSelect.vue'
import ToolTip from '../widget/ToolTip.vue'
import Slider from '../widget/Slider.vue'

let inDrag = false
let moved = false
let [
  elWidth,
  elHeight,
  elX,
  elY,
  clientX,
  clientY,
  distanceTop,
  distanceLeft,
  distanceBottom,
  distanceRight,
] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 被拖动元素的宽高/元素的坐标/鼠标的坐标/鼠标距元素上下左右的坐标
let dragMode, dragPosition, dragNode

export default {
  name: 'QrCodeTemplateEditor',
  props: {
    primaryColor: {
      type: String,
      default: '#0B58D2',
    },
    fonts: {
      type: Array,
      default: () => [],
    },
    colors: {
      type: Array,
      default: () => [],
    },
    preTplInfo: {
      type: Object,
      default: () => ({
        defaultColor: "#FFFFFF",
        defaultWidth: 150,
        defaultHeight: 100,
      }),
    },
    preControls: {
      type: Array,
      default: () => [],
    },
    templateName: {
      type: String,
      default: '',
    },
    showHotKeyBoard: {
      type: Boolean,
      default: true,
    },
    showControlLib: {
      type: Boolean,
      default: true,
    },
    showAttrsBoard: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ColorPicker,
    EventTsfMask,
    SizePicker,
    ToolTip,
    CSelect,
    Slider,
  },
  data() {
    return {
      scale: 100,
      controls: [],
      tplInfo: {
        bgColor: '#FFFFFF',
        width: 150,
        height: 100,
      },
      nativeControls: Object.freeze(nativeControls),
      currentNode: {},
      tplName: '',
      maskVisible: false,
      showLineDashSelect: false,
      placeholds: [],
      tplReadySize: {
        v: false,
        width: 0,
        height: 0,
      },
      cloneControlCache: null,
      startRecord: false,
      undoHub: {
        stack: [],
        stackIndex: 0,
        canUndo: false,
        canUnundo: false,
      },
    }
  },
  async mounted() {
    this.setDefaultNode()

    this.$refs.tpl.addEventListener('dragover', (e) => { e.preventDefault() })
    this.$refs.tpl.addEventListener('drop', this.handleDrop)

    const mask = this.$refs.mask.$el
    mask.addEventListener('mousedown', this.handleMouseDown)
    mask.addEventListener('mousemove', this.handleMouseMove)

    window.addEventListener('resize', this.renderMask)
    window.addEventListener('resize', this.renderPlaceholder)
    window.addEventListener('scroll', this.renderMask)
    window.addEventListener('scroll', this.renderPlaceholder)
    document.addEventListener('keydown', this.handleKeyboard)
    window.addEventListener('mouseup', this.stopDrag)

    this.tplInfo.bgColor = this.preTplInfo.defaultColor
    this.tplInfo.width = this.preTplInfo.defaultWidth
    this.tplInfo.height = this.preTplInfo.defaultHeight
    
    this.preControls.forEach((c) => {
      this.initControl(c)
    })

    await this.$nextTick()
    this.renderPlaceholder()
    
    this.startRecord = true
    // console.log('mounted')
    this.setRecord()
    this.undoHub.canUndo = false
  },
  destroyed() {
    window.removeEventListener('resize', this.renderMask)
    window.removeEventListener('resize', this.renderPlaceholder)
    window.removeEventListener('scroll', this.renderMask)
    window.removeEventListener('scroll', this.renderPlaceholder)
    document.removeEventListener('keydown', this.handleKeyboard)
    window.removeEventListener('mouseup', this.stopDrag)
  },
  methods: {
    modifyScale(scale) {
      const scaled = this.scale + scale
      const scaledHeight = this.tplInfo.height * scaled / 100
      const scaledwidth = this.tplInfo.width * scaled / 100
      if(scaledHeight > 255 || scaledHeight < 20 || scaledwidth > 255 || scaledwidth < 20) return
      this.scale += scale
    },
    handleDrag({ ctx }, e) {
      e.dataTransfer.setData('text/plain', JSON.stringify(ctx))
    },
    canIAddThisControl(type) {
      let can = true
      const len = this.controls.filter((c) => c.type === type).length

      switch (type) {
        case 'title':
        case 'subTitle':
        case 'logo':
        case 'qr':
          if(len >= 1) {
            can = false
          }
          break;
        case 'field':
          if(len >= 8) {
            can = false
          }
          break;
        case 'line':
          if(len >= 3) {
            can = false
          }
          break;
        case 'rect':
          if(len >= 10) {
            can = false
          }
          break;
        default:
          break;
      }

      return can
    },
    fitScale() {
      let longerEdge = this.tplInfo.width > this.tplInfo.height ? this.tplInfo.width : this.tplInfo.height
      let scale = 150 / longerEdge
      this.scale = Math.round(scale * 100)
    },
    handleDrop(e) {
      e.preventDefault()

      let controlInfo = e.dataTransfer.getData('text')
      if(!controlInfo) return
      controlInfo = JSON.parse(controlInfo)

      this.handleAddControl('drop' ,controlInfo, e)
    },
    handleAddControl(ctrlType, controlInfo, e) {
      const type = controlInfo.type
      if(!this.canIAddThisControl(type)) {
        return
      }

      controlInfo.id = getId()

      let shorterEdge = this.tplInfo.width > this.tplInfo.height ? this.tplInfo.height : this.tplInfo.width

      let cType = controlInfo.type
      
      if(cType === 'field') {
        let len = this.controls.filter(({ type }) => type === 'field').length
        controlInfo.children[1].children[0].static.textContent += len + 1
      }
      
      if(cType === 'rect') {
        if(controlInfo.dynamic.width > shorterEdge) {
          controlInfo.dynamic.width = shorterEdge / 2 * 3
          controlInfo.dynamic.height = shorterEdge / 2 * 3
        }
      } else if (['title', 'subTitle', 'field'].includes(cType)) {
        let size = Math.round((this.tplInfo.width * 3) / 2 / controlInfo.children[1].children[0].static.textContent.length)
        if(size > 72) {
          controlInfo.dynamic.size = 72
        } else if(size < 12) {
          controlInfo.dynamic.size = 12
        } else {
          controlInfo.dynamic.size = size
        }
      } else if (cType === 'qr') {
        if(controlInfo.dynamic.width > shorterEdge) {
          controlInfo.dynamic.width = shorterEdge / 2 * 3
          controlInfo.dynamic.height = shorterEdge / 2 * 3
        }
      } else if (cType === 'logo') {
        if(controlInfo.dynamic.width > shorterEdge) {
          controlInfo.dynamic.width = shorterEdge / 2 * 3
          controlInfo.dynamic.height = shorterEdge / 2 * 3
        }
      }

      const control = generateControl(controlInfo, this.tplInfo.width * 3)

      if(ctrlType === 'drop') {
        const wrapperInfo = this.$refs.tpl.getBoundingClientRect()
        controlInfo.transform = {
          x: (e.clientX - wrapperInfo.left) / (this.scale / 100),
          y: (e.clientY - wrapperInfo.top) / (this.scale / 100),
        }
      } else if(ctrlType === 'api') {
        if(e) {
          controlInfo.transform = {
            x: e[0],
            y: e[1],
          }
        } else {
          controlInfo.transform = {
            x: 0,
            y: 0,
          }
        }
      }
      
      control.setAttribute('transform', `translate(${controlInfo.transform.x},${controlInfo.transform.y})`)

      this.$refs.wrapper.append(control)
      this.controls.push(controlInfo)

      this.placeholds.push({
        id: getId(),
        pid: controlInfo.id,
      })

      control.addEventListener('mousedown', this.handleMouseDown)
      control.dispatchEvent(new MouseEvent('mousedown'))
      this.stopDrag()

      // console.log('drag add')
      this.setRecord()
    },
    addControl(widgetType, position) {
      const widgets = nativeControls.map(({ ctx }) => ctx)
      const widgetTypes = widgets.map(({ type }) => type)
      if(!widgetTypes.includes(widgetType)) return
      
      const widget = JSON.parse(JSON.stringify(widgets.find(({ type }) => type === widgetType)))

      this.handleAddControl('api', widget, position)
    },
    initControl(c) {
      const controlInfo = JSON.parse(JSON.stringify(c))

      const type = controlInfo.type
      if(!this.canIAddThisControl(type)) {
        return false
      }

      controlInfo.id = getId()

      if(type === 'field') {
        let len = document.querySelectorAll('[data-type=field]').length
        controlInfo.children[1].children[0].static.textContent = `字段显示区${++len}`
      }

      const control = generateControl(controlInfo, this.tplInfo.width * 3)
      
      control.setAttribute('transform', `translate(${controlInfo.transform.x},${controlInfo.transform.y})`)

      this.$refs.wrapper.append(control)

      this.controls.push(controlInfo)
      this.placeholds.push({
        id: getId(),
        pid: controlInfo.id,
      })

      control.addEventListener('mousedown', this.handleMouseDown)

      return true
    },
    handleMouseDown(e) {
      if(e.button === 1 || e.button === 0) {
        let mark = e.currentTarget.classList.contains('tpl-control-placeholder')
        if(mark) {
          let cid = e.currentTarget.getAttribute('id')
          let pid = this.placeholds.find(({ id }) => id === cid).pid
          this.currentNode = this.controls.find(({ id }) => id === pid)
  
          dragMode = 'move'
          dragNode = JSON.parse(JSON.stringify(this.currentNode))
        } else {
          dragPosition = e.target.dataset.position
          dragMode = e.target.dataset.position ? 'resize' : 'move'
    
          dragNode = JSON.parse(JSON.stringify(this.currentNode))
  
          let currentNode = this.controls.find(({ id }) => id === e.currentTarget.getAttribute('id'))
          if(currentNode) {
            this.currentNode = currentNode
            dragNode = JSON.parse(JSON.stringify(this.currentNode))
          }
        }
  
        const elInfo = e.currentTarget.getBoundingClientRect()
        elWidth = elInfo.width
        elHeight = elInfo.height
        elX = elInfo.left
        elY = elInfo.top
        clientX = e.clientX
        clientY = e.clientY
        distanceLeft = clientX - elX
        distanceTop = clientY - elY
        distanceBottom = elHeight - distanceTop
        distanceRight = elWidth - distanceLeft
  
        inDrag = true
        this.maskVisible = true
      }
    },
    handleMouseMove(e) {
      if (!inDrag) return

      if(dragMode === 'move') {
        this.moveControl(e)
        moved = true
        return
      }

      const containerInfo = this.$refs.container.getBoundingClientRect()
      
      if(e.clientX > containerInfo.right) {
        return
      }
      
      if(e.clientX < containerInfo.left) {
        return
      }
      
      if(e.clientY > containerInfo.bottom) {
        return
      }
      
      if(e.clientY < containerInfo.top) {
        return
      }
      
      let nodeType = dragNode.type

      if(nodeType === 'rect') {
        this.resizeRect(e, dragPosition)
      }

      if(nodeType === 'qr') {
        this.resizeQr(e, dragPosition)
      }

      if(nodeType === 'line') {
        this.resizeLine(e, dragPosition)
      }

      if(nodeType === 'logo') {
        this.resizeLogo(e, dragPosition)
      }

      if(['title', 'subTitle', 'field'].includes(nodeType)) {
        this.resizeText(e, dragPosition)
      }

      moved = true
    },
    setDefaultNode() {
      this.currentNode = {
        type: 'bg',
        attrs: {
          'data-type': 'bg',
        },
      }
    },
    async renderMask() {
      if(this.currentNode.type === 'bg') {
        this.maskVisible = false
        return
      }

      let currentNodeId = this.currentNode.id

      await this.$nextTick()
      const mask = this.$refs.mask.$el
      const needMask = document.getElementById(currentNodeId).getBoundingClientRect()

      mask.style.top = needMask.top + 'px'
      mask.style.left = needMask.left + 'px'
      mask.style.width = needMask.width + 'px'
      mask.style.height = needMask.height + 'px'
      this.maskVisible = true
    },
    setTransform() {
      if(this.currentNode.type === 'bg') return
      const node = document.getElementById(this.currentNode.id)
      node.setAttribute('transform', `translate(${this.currentNode.transform.x},${this.currentNode.transform.y})`)
    },
    changeColor(color) {
      let type = this.currentNode.type
      switch (type) {
        case 'bg':
          if(this.tplInfo.bgColor === color) return
          this.tplInfo.bgColor = color
          // console.log('tpl bg')
          this.setRecord()
          break;
        case 'rect':
          if(this.currentNode.dynamic.fill === color) return
          this.currentNode.dynamic.fill = color
          // console.log('control color')
          this.setRecord()
          break;
        case 'title':
        case 'subTitle':
        case 'field':
          if(this.currentNode.children[1].dynamic.fill === color) return
          this.currentNode.children[1].dynamic.fill = color
          // console.log('control color')
          this.setRecord()
          break;
        case 'line':
          if(this.currentNode.children[1].dynamic.stroke === color) return
          this.currentNode.children[1].dynamic.stroke = color
          // console.log('control color')
          this.setRecord()
          break;
        default:
          break;
      }
    },
    changeSize(size) {
      if(size !== 'custom') {
        this.setTemplateSize(size)
      } else {
        this.tplReadySize.width = this.tplInfo.width
        this.tplReadySize.height = this.tplInfo.height
        this.tplReadySize.v = true
      }

    },
    reTplSize() {
      this.setTemplateSize([this.tplReadySize.width, this.tplReadySize.height])
      
      this.tplReadySize.v = false
    },
    // 设置模版尺寸
    setTemplateSize(originsize) {
      const size = JSON.parse(JSON.stringify(originsize))
      
      if(size[0] === this.tplInfo.width && size[1] === this.tplInfo.height) return

      if(size[0] > 250) {
        size[0] = 250
      } else if(size[0] < 20) {
        size[0] = 20
      }
      if(size[1] > 250) {
        size[1] = 250
      } else if(size[1] < 20) {
        size[1] = 20
      }

      this.tplInfo.width = size[0]
      this.tplInfo.height = size[1]
      // console.log('tpl size')
      this.setRecord()

      this.scale = 100

      this.reRenderRightAlignText()
    },
    setLineDash(style) {
      const base = this.currentNode.children[1].dynamic['stroke-width']
      
      if(this.currentNode.children[1].dynamic['stroke-dasharray'] === style.split(' ').map((d) => d * base).join(' ')) return
      this.currentNode.children[1].dynamic['stroke-dasharray'] = style.split(' ').map((d) => d * base).join(' ')
      // console.log('line dash')
      this.setRecord()
    },
    // 移除当前控件
    removeControl() {
      if(this.currentNode.type === 'bg') return

      const curId = this.currentNode.id
      const delIdx = this.controls.findIndex(({ id }) => id === curId)
      const delPIdx = this.placeholds.findIndex(({ pid }) => pid === curId)

      document.getElementById(curId).remove()

      this.controls.splice(delIdx, 1)
      this.placeholds.splice(delPIdx, 1)

      document.querySelectorAll('[data-type=field]').forEach((el, index) => {
        el.textContent = `字段显示区${index + 1}`
      })
      
      this.setDefaultNode()

      // console.log('remove')
      this.setRecord()
    },
    handleKeyboard(e) {
      if(e.code === 'Delete') {
        this.removeControl()
      }
      if(e.code === 'Backspace') {
        if(e.target.tagName === 'INPUT') return
        this.removeControl()
      }
      if(['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'].includes(e.code)) {
        this.moveControlByKey(e.code)
      }
      if((e.ctrlKey || e.metaKey) && e.code === 'KeyC') {
        this.cloneControl()
      }
      if((e.ctrlKey || e.metaKey) && e.code === 'KeyV') {
        this.pasteControl()
      }
      if((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyZ') {
        this.unUndo()
      } else if((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        this.undo()
      }
    },
    toggleBold() {
      if(!['title', 'subTitle', 'field'].includes(this.currentNode.type)) return

      const style = this.currentNode.children[1].dynamic['font-weight']
      style === 'bold' ? this.currentNode.children[1].dynamic['font-weight'] = 'normal' : this.currentNode.children[1].dynamic['font-weight'] = 'bold'
      // console.log('text bold')
      this.setRecord()
    },
    toggleItalic() {
      if(!['title', 'subTitle', 'field'].includes(this.currentNode.type)) return

      const style = this.currentNode.children[1].dynamic['font-style']
      style === 'italic' ? this.currentNode.children[1].dynamic['font-style'] = 'normal' : this.currentNode.children[1].dynamic['font-style'] = 'italic'
      // console.log('text italic')
      this.setRecord()
    },
    toEdge(type) {
      if(this.currentNode.type === 'bg') return
      if(type === 'top') {
        if(this.currentNodeLevel === this.controls.length - 1) return

        const currentEl = document.getElementById(this.currentNode.id)
        currentEl.remove()
        this.$refs.wrapper.insertAdjacentElement('beforeend', currentEl)

        const currentNode = this.controls.splice(this.currentNodeLevel, 1)
        this.controls.push(...currentNode)
      } else if(type === 'bottom') {
        if(this.currentNodeLevel === 0) return

        const currentEl = document.getElementById(this.currentNode.id)
        currentEl.remove()
        this.$refs.wrapper.insertAdjacentElement('afterbegin', currentEl)

        const currentNode = this.controls.splice(this.currentNodeLevel, 1)
        this.controls.unshift(...currentNode)
      }
      // console.log('level')
      this.setRecord()
    },
    moveLevel(type) {
      if(this.currentNode.type === 'bg') return
      if(type === 'up') {
        if(this.currentNodeLevel === this.controls.length - 1) return

        const currentEl = document.getElementById(this.currentNode.id)
        const nextEl = currentEl.nextElementSibling
        currentEl.remove()
        nextEl.insertAdjacentElement('afterend', currentEl)

        const level = this.currentNodeLevel
        const currentNode = this.controls.splice(this.currentNodeLevel, 1)
        this.controls.splice(level + 1, 0, ...currentNode)
      } else if(type === 'dowm') {
        if(this.currentNodeLevel === 0) return

        const currentEl = document.getElementById(this.currentNode.id)
        const prevEl = currentEl.previousElementSibling
        currentEl.remove()
        prevEl.insertAdjacentElement('beforebegin', currentEl)

        const level = this.currentNodeLevel
        const currentNode = this.controls.splice(this.currentNodeLevel, 1)
        this.controls.splice(level - 1, 0, ...currentNode)
      }
      // console.log('level')
      this.setRecord()
    },
    moveControl(e) {
      const tplInfo = this.$refs.tpl.getBoundingClientRect()
      const containerInfo = this.$refs.container.getBoundingClientRect()

      const moveX = e.clientX
      const moveY = e.clientY
      elX = moveX - distanceLeft - tplInfo.x
      elY = moveY - distanceTop - tplInfo.y

      // 左边界
      const leftEdge = containerInfo.x - tplInfo.x
      if(elX < leftEdge) {
        elX = leftEdge
      }

      // 上边界
      const topEdge = containerInfo.y - tplInfo.y
      if(elY < topEdge) {
        elY = topEdge
      }

      // 右边界
      if(moveX + distanceRight > containerInfo.right) {
        elX = containerInfo.right - containerInfo.left - distanceLeft - distanceRight - (tplInfo.left - containerInfo.left)
      }

      // 下边界
      if(moveY + distanceBottom > containerInfo.bottom) {
        elY = containerInfo.bottom - tplInfo.top - (distanceTop + distanceBottom)
      }

      // if (elX <= 0) {
      //   elX = 0
      // }
      // // 左边界
      // if (elY <= 0) {
      //   elY = 0
      // }
      // // 上边界
      // if (moveX + distanceRight > tplInfo.width + tplInfo.left) {
      //   elX = tplInfo.width - elWidth
      // }
      // // 右边界
      // if (moveY + distanceBottom > tplInfo.height + tplInfo.top) {
      //   elY = tplInfo.height - elHeight
      // }
      // // 下边界

      this.currentNode.transform = {
        x: elX / (this.scale / 100),
        y: elY / (this.scale / 100),
      }
    },
    resizeRect(e, dragPosition) {
      const containerInfo = this.$refs.container.getBoundingClientRect()
      const tplInfo = this.$refs.tpl.getBoundingClientRect()

      if(dragPosition === 'r') {
        let distanceX = (e.clientX - clientX) / this.scale * 100
        let resizedWidth = dragNode.dynamic.width + distanceX
        if(resizedWidth > 0) {
          this.currentNode.dynamic.width = resizedWidth
        }
      } else if (dragPosition === 'b') {
        let distanceY = (e.clientY - clientY) / this.scale * 100
        let resizedHeight = dragNode.dynamic.height + distanceY
        if(resizedHeight > 0) {
          this.currentNode.dynamic.height = resizedHeight
        }
      } else if(dragPosition === 'l') {
        let distanceX = (e.clientX - clientX) / this.scale * 100
        let resizedWidth = dragNode.dynamic.width - distanceX
        if(resizedWidth > 0) {
          this.currentNode.dynamic.width = resizedWidth
          this.currentNode.transform.x = dragNode.transform.x + distanceX
        }
      } else if(dragPosition === 't') {
        let distanceY = (e.clientY - clientY) / this.scale * 100
        let resizedHeight = dragNode.dynamic.height - distanceY
        if(resizedHeight > 0) {
          this.currentNode.dynamic.height = resizedHeight
          this.currentNode.transform.y = dragNode.transform.y + distanceY
        }
      } else if(dragPosition === 'br') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX = (e.clientX - clientX) / this.scale * 100

        let resizedWidth = dragNode.dynamic.width + distanceX
        let resizedHeight = resizedWidth / ratio
        if(resizedWidth > 0) {
          if(resizedHeight + this.currentNode.transform.y <= containerInfo.bottom - tplInfo.top) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
          } else {
            resizedHeight = Math.floor(containerInfo.bottom - tplInfo.top - this.currentNode.transform.y)
            resizedWidth = resizedHeight * ratio
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
          }
        }

      } else if(dragPosition === 'tl') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX = (clientX - e.clientX) / this.scale * 100

        let resizedWidth = dragNode.dynamic.width + distanceX
        let resizedHeight = resizedWidth / ratio
        if(resizedWidth > 0) {
          if(containerInfo.bottom - tplInfo.top - (this.currentNode.dynamic.height + this.currentNode.transform.y) + resizedHeight <= containerInfo.height) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
            this.currentNode.transform.x = dragNode.transform.x - distanceX
            this.currentNode.transform.y = dragNode.transform.y - (this.currentNode.dynamic.height - dragNode.dynamic.height)
          }
        }
      } else if(dragPosition === 'bl') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX = (clientX - e.clientX) / this.scale * 100

        let resizedWidth = dragNode.dynamic.width + distanceX
        let resizedHeight = resizedWidth / ratio
        if(resizedWidth > 0) {
          if(resizedHeight + this.currentNode.transform.y < containerInfo.bottom - tplInfo.top) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
            this.currentNode.transform.x = dragNode.transform.x - distanceX
          } else {
            resizedHeight = Math.floor(containerInfo.bottom - tplInfo.top - this.currentNode.transform.y)
            resizedWidth = resizedHeight * ratio
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
          }

        }
      } else if(dragPosition === 'tr') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX =  (e.clientX - clientX) / this.scale * 100

        let resizedWidth = dragNode.dynamic.width + distanceX
        let resizedHeight = resizedWidth / ratio
        if(resizedWidth > 0) {
          if(containerInfo.bottom - tplInfo.top - (this.currentNode.dynamic.height + this.currentNode.transform.y) + resizedHeight <= containerInfo.height) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
            this.currentNode.transform.y = dragNode.transform.y - (this.currentNode.dynamic.height - dragNode.dynamic.height)
          }
        }
      }
    },
    resizeQr(e, dragPosition) {
      const containerInfo = this.$refs.container.getBoundingClientRect()
      const tplInfo = this.$refs.tpl.getBoundingClientRect()

      if(dragPosition === 'br') {
        let distanceX = (e.clientX - clientX) / this.scale * 100
        let resizedSize = dragNode.dynamic.width + distanceX
        if(resizedSize > 0) {
          if(resizedSize + this.currentNode.transform.y <= containerInfo.bottom - tplInfo.top) {
            this.currentNode.dynamic.width = resizedSize
            this.currentNode.dynamic.height = resizedSize
          } else {
            resizedSize = Math.floor(containerInfo.bottom - tplInfo.top - this.currentNode.transform.y)
            this.currentNode.dynamic.width = resizedSize
            this.currentNode.dynamic.height = resizedSize
          }
        }
      } else if(dragPosition === 'tl') {
        let distanceX = (clientX - e.clientX) / this.scale * 100
        let resizedSize = dragNode.dynamic.width + distanceX
        if(resizedSize > 0) {
          if(containerInfo.bottom - tplInfo.top - (this.currentNode.dynamic.height + this.currentNode.transform.y) + resizedSize <= containerInfo.height) {
            this.currentNode.dynamic.width = resizedSize
            this.currentNode.dynamic.height = resizedSize

            this.currentNode.transform.x = dragNode.transform.x - distanceX
            this.currentNode.transform.y = dragNode.transform.y - distanceX
          }
        }
      } else if(dragPosition === 'bl') {
        let distanceX = (clientX - e.clientX) / this.scale * 100

        let resizedSize = dragNode.dynamic.width + distanceX
        if(resizedSize > 0) {
          if(resizedSize + this.currentNode.transform.y <= containerInfo.bottom - tplInfo.top) {
            this.currentNode.dynamic.width = resizedSize
            this.currentNode.dynamic.height = resizedSize
            this.currentNode.transform.x = dragNode.transform.x - distanceX
          } else {
            resizedSize = Math.floor(containerInfo.bottom - tplInfo.top - this.currentNode.transform.y)
            this.currentNode.dynamic.width = resizedSize
            this.currentNode.dynamic.height = resizedSize
          }
        }
      } else if(dragPosition === 'tr') {
        let distanceX =  (e.clientX - clientX) / this.scale * 100
        let resizedSize = dragNode.dynamic.width + distanceX
        if(resizedSize > 0) {
          if(containerInfo.bottom - tplInfo.top - (this.currentNode.dynamic.height + this.currentNode.transform.y) + resizedSize <= containerInfo.height) {
            this.currentNode.dynamic.width = resizedSize
            this.currentNode.dynamic.height = resizedSize

            this.currentNode.transform.y = dragNode.transform.y - distanceX
          }
        }
      }
    },
    stopDrag() {
      if(inDrag === true) {
        inDrag = false
        if(moved === true) {
          // console.log('move/resize')
          this.setRecord()
          moved = false
        }
      }
    },
    resizeLine(e, dragPosition) {
      if(dragPosition === 'r') {
        let distanceX = (e.clientX - clientX) / this.scale * 100
        let resizedLen = dragNode.children[1].dynamic.x2 + distanceX
        if(resizedLen > 0) {
          this.currentNode.children[1].dynamic.x2 = resizedLen
          this.currentNode.children[0].dynamic.width = dragNode.children[0].dynamic.width + distanceX
        }
      } else if(dragPosition === 'b') {
        let distanceY = (e.clientY - clientY) / this.scale * 100
        let resizedSW = dragNode.children[1].dynamic['stroke-width'] + distanceY
        if(resizedSW > 0) {
          this.currentNode.children[1].dynamic['stroke-width'] = resizedSW
          this.currentNode.children[0].dynamic.height = dragNode.children[0].dynamic.height + distanceY

          let sw = dragNode.children[1].dynamic['stroke-width'],
              sd = dragNode.children[1].dynamic['stroke-dasharray'].split(' ').map((i) => i / sw).join(' '),
              csw = this.currentNode.children[1].dynamic['stroke-width']
          this.currentNode.children[1].dynamic['stroke-dasharray'] = sd.split(' ').map((i) => i * csw).join(' ')

          this.currentNode.children[1].dynamic.transform = `translate(10,${this.currentNode.children[1].dynamic['stroke-width'] / 2 + 10})`
        }
      }
    },
    resizeLogo(e, dragPosition) {
      const containerInfo = this.$refs.container.getBoundingClientRect()
      const tplInfo = this.$refs.tpl.getBoundingClientRect()

      if(dragPosition === 'r') {
        let distanceX = (e.clientX - clientX) / this.scale * 100

        let resizedWidth = Math.round(dragNode.dynamic.width + distanceX)

        if(resizedWidth >= 3 && resizedWidth <= this.tplInfo.width * 3) {
          this.currentNode.dynamic.width = resizedWidth
        }

      } else if (dragPosition === 'b') {
        let distanceY = (e.clientY - clientY) / this.scale * 100

        let resizedHeight = Math.round(dragNode.dynamic.height + distanceY)

        if(resizedHeight >= 3 && resizedHeight <= this.tplInfo.height * 3) {
          this.currentNode.dynamic.height = resizedHeight
        }
      } else if(dragPosition === 'l') {
        let distanceX = (e.clientX - clientX) / this.scale * 100

        let resizedWidth = Math.round(dragNode.dynamic.width - distanceX)

        if(resizedWidth >= 3 && resizedWidth <= this.tplInfo.width * 3) {
          this.currentNode.dynamic.width = resizedWidth
          this.currentNode.transform.x = dragNode.transform.x + distanceX
        }
      } else if(dragPosition === 't') {
        let distanceY = (e.clientY - clientY) / this.scale * 100

        let resizedHeight = Math.round(dragNode.dynamic.height - distanceY)

        if(resizedHeight >= 3 && resizedHeight <= this.tplInfo.height * 3) {
          this.currentNode.dynamic.height = resizedHeight
          this.currentNode.transform.y = dragNode.transform.y + distanceY
        }
      } else if(dragPosition === 'br') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX = (e.clientX - clientX) / this.scale * 100

        let resizedWidth = Math.round(dragNode.dynamic.width + distanceX)
        let resizedHeight = Math.round(resizedWidth / ratio)

        if(resizedWidth >= 3 && resizedWidth <= this.tplInfo.width * 3 && resizedHeight >= 3 && resizedHeight <= this.tplInfo.height * 3) {
          if(resizedHeight + this.currentNode.transform.y <= containerInfo.bottom - tplInfo.top) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
          } else {
            resizedHeight = Math.floor(containerInfo.bottom - tplInfo.top - this.currentNode.transform.y)
            resizedWidth = resizedHeight * ratio
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
          }
        }
      } else if(dragPosition === 'tl') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX = (e.clientX - clientX) / this.scale * 100

        let resizedWidth = Math.round(dragNode.dynamic.width - distanceX)
        let resizedHeight = Math.round(resizedWidth / ratio)

        if(resizedWidth >= 3 && resizedWidth <= this.tplInfo.width * 3 && resizedHeight >= 3 && resizedHeight <= this.tplInfo.height * 3) {
          if(containerInfo.bottom - tplInfo.top - (this.currentNode.dynamic.height + this.currentNode.transform.y) + resizedHeight <= containerInfo.height) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
            this.currentNode.transform.x = dragNode.transform.x + distanceX
            this.currentNode.transform.y = dragNode.transform.y - (this.currentNode.dynamic.height - dragNode.dynamic.height)
          }
        }
      } else if(dragPosition === 'bl') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX = (clientX - e.clientX) / this.scale * 100

        let resizedWidth = Math.round(dragNode.dynamic.width + distanceX)
        let resizedHeight = Math.round(resizedWidth / ratio)

        if(resizedWidth >= 3 && resizedWidth <= this.tplInfo.width * 3 && resizedHeight >= 3 && resizedHeight <= this.tplInfo.height * 3) {
          if(resizedHeight + this.currentNode.transform.y <= containerInfo.bottom - tplInfo.top) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
            this.currentNode.transform.x = dragNode.transform.x - distanceX
          } else {
            resizedHeight = Math.floor(containerInfo.bottom - tplInfo.top - this.currentNode.transform.y)
            resizedWidth = resizedHeight * ratio
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
          }
        }
      } else if(dragPosition === 'tr') {
        const ratio = dragNode.dynamic.width / dragNode.dynamic.height
        let distanceX = (e.clientX - clientX) / this.scale * 100

        let resizedWidth = Math.round(dragNode.dynamic.width + distanceX)
        let resizedHeight = Math.round(resizedWidth / ratio)

        if(resizedWidth >= 3 && resizedWidth <= this.tplInfo.width * 3 && resizedHeight >= 3 && resizedHeight <= this.tplInfo.height * 3) {
          if(containerInfo.bottom - tplInfo.top - (this.currentNode.dynamic.height + this.currentNode.transform.y) + resizedHeight <= containerInfo.height) {
            this.currentNode.dynamic.width = resizedWidth
            this.currentNode.dynamic.height = resizedHeight
            this.currentNode.transform.y = dragNode.transform.y - (this.currentNode.dynamic.height - dragNode.dynamic.height)
          }
        }
      }
    },
    async renderPlaceholder() {
      await this.$nextTick()

      this.placeholds.forEach(({ id, pid }) => {
        const needMask = document.getElementById(pid).getBoundingClientRect()
        const placeholderEl = document.getElementById(id)

        placeholderEl.style.top = needMask.top + 'px'
        placeholderEl.style.left = needMask.left + 'px'
        placeholderEl.style.width = needMask.width + 'px'
        placeholderEl.style.height = needMask.height + 'px'
      })
    },
    resizeText(e, dragPosition) {
      const size = dragNode.dynamic.size
      const len = dragNode.children[1].children[0].static.textContent.length

      if(dragPosition === 'r') {
        const distanceX = (e.clientX - clientX) / this.scale * 100

        let resizedWidth = dragNode.children[0].dynamic.width + distanceX
        if(resizedWidth >= size * len + 14) {
          this.currentNode.children[0].dynamic.width = resizedWidth
        }
      } else if(dragPosition === 'l') {
        const distanceX = (clientX - e.clientX) / this.scale * 100

        let resizedWidth = dragNode.children[0].dynamic.width + distanceX
        if(resizedWidth >= size * len + 14) {
          this.currentNode.children[0].dynamic.width = resizedWidth
          this.currentNode.transform.x = dragNode.transform.x - distanceX
        }
      } else if(dragPosition === 'b') {
        const distanceY = (e.clientY - clientY) / this.scale * 100

        let resized = Math.round(dragNode.dynamic.size + distanceY)

        if(resized <= 72 && resized >= 12) {
          this.currentNode.dynamic.size = resized
        }
      } else if(dragPosition === 't') {
        const distanceY = (clientY - e.clientY) / this.scale * 100

        let resized = Math.round(dragNode.dynamic.size + distanceY)

        if(resized <= 72 && resized >= 12) {
          this.currentNode.dynamic.size = resized
          this.currentNode.transform.y = dragNode.transform.y - distanceY
        }
      }
    },
    generateUseTpl() {
      const tplCache = document.createElement('div')
      tplCache.innerHTML = this.$refs.tpl.outerHTML

      let hasTitle = this.controls.find(({ type }) => type === 'title')
      if(hasTitle) {
        const textHost = tplCache.querySelector('[data-type=title]')
        const wrapper = textHost.parentNode
        const titleShadowWidth = Number(tplCache.querySelector(`#${hasTitle.id}`).querySelector('rect').getAttribute('width'))
        const dataMax = Math.round(titleShadowWidth / (this.tplInfo.width * 3) * 100)
        const dataLen = Math.round(titleShadowWidth / hasTitle.dynamic.size)

        const align = hasTitle.dynamic.align

        if(align === 'right') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', `${hasTitle.children[0].dynamic.width / (this.tplInfo.width * 3) * 100}%`)
          textHost.setAttribute('y', '0')
          textHost.setAttribute('dy', hasTitle.dynamic.size)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', 'title-placeholder')
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('data-len', dataLen)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', `${hasTitle.children[0].dynamic.width / (this.tplInfo.width * 3) * 100}%`)
          placeholder.setAttribute('y', '0')
          placeholder.setAttribute('dy', hasTitle.dynamic.size)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        } else if (align === 'left') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', 0)
          textHost.setAttribute('y', 0)
          textHost.setAttribute('dy', hasTitle.dynamic.size)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', 'title-placeholder')
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', 0)
          placeholder.setAttribute('y', 0)
          placeholder.setAttribute('dy', hasTitle.dynamic.size)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        } else if (align === 'center') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', 0)
          textHost.setAttribute('y', 0)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', 'title-placeholder')
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('data-len', dataLen)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', 0)
          placeholder.setAttribute('y', 0)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        }

        wrapper.previousSibling.remove()
      }

      let hasSubTitle = this.controls.find(({ type }) => type === 'subTitle')
      if(hasSubTitle) {
        const textHost = tplCache.querySelector('[data-type=subTitle]')
        const wrapper = textHost.parentNode
        const titleShadowWidth = Number(tplCache.querySelector(`#${hasSubTitle.id}`).querySelector('rect').getAttribute('width'))
        const dataMax = Math.round(titleShadowWidth / (this.tplInfo.width * 3) * 100)
        const dataLen = Math.round(titleShadowWidth / hasSubTitle.dynamic.size)

        const align = hasSubTitle.dynamic.align

        if(align === 'right') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', `${hasSubTitle.children[0].dynamic.width / (this.tplInfo.width * 3) * 100}%`)
          textHost.setAttribute('y', '0')
          textHost.setAttribute('dy', hasSubTitle.dynamic.size)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', 'subTitle-placeholder')
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('data-len', dataLen)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', `${hasSubTitle.children[0].dynamic.width / (this.tplInfo.width * 3) * 100}%`)
          placeholder.setAttribute('y', '0')
          placeholder.setAttribute('dy', hasSubTitle.dynamic.size)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        } else if (align === 'left') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', 0)
          textHost.setAttribute('y', 0)
          textHost.setAttribute('dy', hasSubTitle.dynamic.size)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', 'subTitle-placeholder')
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', 0)
          placeholder.setAttribute('y', 0)
          placeholder.setAttribute('dy', hasSubTitle.dynamic.size)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        } else if (align === 'center') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', 0)
          textHost.setAttribute('y', 0)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', 'subTitle-placeholder')
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('data-len', dataLen)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', 0)
          placeholder.setAttribute('y', 0)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        }

        wrapper.previousSibling.remove()
      }

      let fields = this.controls.filter(({ type }) => type === 'field')
      let textHosts = tplCache.querySelectorAll('[data-type=field]')
      fields.forEach((field, index) => {
        const textHost = textHosts[index]
        const wrapper = textHost.parentNode
        const shadowWidth = Number(tplCache.querySelector(`#${field.id}`).querySelector('rect').getAttribute('width'))
        const dataMax = Math.round(shadowWidth / (this.tplInfo.width * 3) * 100)
        const dataLen = Math.round(shadowWidth / field.dynamic.size)

        textHost.setAttribute('data-count', fields.length)

        const align = field.dynamic.align

        if(align === 'right') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', `${field.children[0].dynamic.width / (this.tplInfo.width * 3) * 100}%`)
          textHost.setAttribute('y', '0')
          textHost.setAttribute('dy', field.dynamic.size)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', `field-placeholder${fields.length}`)
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('data-len', dataLen)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', `${field.children[0].dynamic.width / (this.tplInfo.width * 3) * 100}%`)
          placeholder.setAttribute('y', '0')
          placeholder.setAttribute('dy', field.dynamic.size)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        } else if (align === 'left') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', 0)
          textHost.setAttribute('y', 0)
          textHost.setAttribute('dy', field.dynamic.size)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', `field-placeholder${fields.length}`)
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', 0)
          placeholder.setAttribute('y', 0)
          placeholder.setAttribute('dy', field.dynamic.size)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        } else if (align === 'center') {
          textHost.setAttribute('data-max', dataMax)
          textHost.setAttribute('data-len', dataLen)
          textHost.setAttribute('x', 0)
          textHost.setAttribute('y', 0)
          textHost.textContent = ''
  
          const placeholder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          placeholder.setAttribute('data-type', `field-placeholder${fields.length}`)
          placeholder.setAttribute('data-max', dataMax)
          placeholder.setAttribute('data-len', dataLen)
          placeholder.setAttribute('fill', 'transparent')
          placeholder.setAttribute('x', 0)
          placeholder.setAttribute('y', 0)
          placeholder.textContent = '十'
          wrapper.append(placeholder)
        }
        wrapper.previousSibling.remove()
      })

      let hasLogo = this.controls.find(({ type }) => type === 'logo')
      if(hasLogo) {
        const wrapper = tplCache.querySelector(`#${hasLogo.id}`)
        wrapper.children[0].remove()
        wrapper.children[0].remove()
      }

      let hasQr = this.controls.find(({ type }) => type === 'qr')
      if(hasQr) {
        const qr = tplCache.querySelector(`#${hasQr.id}`)
        qr.setAttribute('href', '')
      }
      
      return tplCache.innerHTML
    },
    isLicitTpl() {
      if(!this.controls.find(({ type }) => type === 'qr')) {
        return false
      }
      return true
    },
    getTplDemoBlob() {
      if(this.isLicitTpl()) {
        return new Blob([this.$refs.tpl.outerHTML], { type: 'image/svg+xml', })
      } else {
        return false
      }
    },
    generateUsefulData() {
      if(this.isLicitTpl()) {
        return {
          name: this.tplName,
          svg: this.generateUseTpl(),
          width: this.tplInfo.width,
          height: this.tplInfo.height,
          defaultColor: this.tplInfo.bgColor,
          hasLogo: this.controls.find(({ type }) => type === 'logo') ? true : false,
          hasTitle: this.controls.find(({ type }) => type === 'title') ? true : false,
          hasSubTitle: this.controls.find(({ type }) => type === 'subTitle') ? true : false,
          tagCount: this.controls.filter(({ type }) => type === 'field').length,
          controls: JSON.stringify(this.controls),
        }
      } else {
        return false
      }
    },
    // saveTpl() {
    //   if(this.tplName.length === 0) {
    //     this.$message.error('标签名称不能为空')
    //     return
    //   }

    //   if(!this.controls.find(({ type }) => type === 'qr')) {
    //     this.$message.error('当前标签模板未添加二维码控件')
    //     return
    //   }

    //   this.applySaveTpl()
    // },
    // async applySaveTpl() {

    //   const svgBlob = new Blob([this.$refs.tpl.outerHTML], { type: 'image/svg+xml', })
    //   svgBlob.name = getId(10) + '.svg'
    //   const url = await upLoadFile(svgBlob)
    //   if(!url) {
    //     this.$message.error('模版缩略图上传失败')
    //     return
    //   }

    //   const tpl = {
    //     name: this.tplName,
    //     svg: this.generateUseTpl(),
    //     svgDemo: url,
    //     width: this.tplInfo.width,
    //     height: this.tplInfo.height,
    //     hasLogo: this.controls.find(({ type }) => type === 'logo') ? true : false,
    //     hasTitle: this.controls.find(({ type }) => type === 'title') ? true : false,
    //     hasSubTitle: this.controls.find(({ type }) => type === 'subTitle') ? true : false,
    //     tagCount: this.controls.filter(({ type }) => type === 'field').length,
    //     controls: JSON.stringify(this.controls),
    //     defaultColor: this.tplInfo.bgColor,
    //   }

    //   if(this.mode === 'create') {
    //     const code = await Qr.createTpl(tpl)
    //     if(code === 1000) {
    //       this.$message.success('保存成功')
    //       this.$router.go(-1)
    //     } else if (code === 12020) {
    //       this.$message.error('模板名称重复')
    //     }
    //   } else {
    //     tpl.id = this.id
    //     const code = await Qr.editTpl(tpl)
    //     if(code === 1000) {
    //       this.$message.success('保存成功')
    //       this.$router.go(-1)
    //     } else if (code === 12020) {
    //       this.$message.error('模板名称重复')
    //     } else if(code === 1009) {
    //       this.$message.error('模板不存在')
    //     }
    //   }

    // },
    checkReadySize() {
      if(isNaN(this.tplReadySize.width)) {
        this.tplReadySize.width = 150
      }
      if(isNaN(this.tplReadySize.height)) {
        this.tplReadySize.height = 150
      }

      if(this.tplReadySize.width > 250) {
        this.tplReadySize.width = 250
      } else if (this.tplReadySize.width < 20) {
        this.tplReadySize.width = 20
      } else {
        this.tplReadySize.width = this.tplReadySize.width
      }

      if(this.tplReadySize.height > 250) {
        this.tplReadySize.height = 250
      } else if (this.tplReadySize.height < 20) {
        this.tplReadySize.height = 20
      } else {
        this.tplReadySize.height = this.tplReadySize.height
      }
    },
    moveControlByKey(key) {
      if(this.currentNode.type === 'bg') return

      switch (key) {
        case 'ArrowRight':
          this.currentNode.transform.x++
          break;
        case 'ArrowLeft':
          this.currentNode.transform.x--
          break;
        case 'ArrowUp':
          this.currentNode.transform.y--
          break;
        case 'ArrowDown':
          this.currentNode.transform.y++
          break;
      }
      // console.log('move by key')
      this.setRecord()
    },
    cloneControl() {
      if(this.currentNode.type === 'bg') return

      let clonedControl = JSON.parse(JSON.stringify(this.currentNode))
      clonedControl.transform.x += 10
      clonedControl.transform.y += 10

      this.cloneControlCache = clonedControl
    },
    pasteControl() {
      if(this.cloneControlCache === null) return
      let state = this.initControl(this.cloneControlCache)
      this.cloneControlCache.transform.x += 10
      this.cloneControlCache.transform.y += 10

      if(state === true) {
        // console.log('paste')
        this.setRecord()
      }
    },
    undo() {
      if(!this.undoHub.canUndo) return

      this.setDefaultNode()

      this.undoHub.stackIndex--
      this.useUndo(this.undoHub.stack[this.undoHub.stackIndex])

      if(this.undoHub.stackIndex === 0) {
        this.undoHub.canUndo = false
      }

      if(this.undoHub.stack.length > 1) {
        this.undoHub.canUnundo = true
      }
    },
    unUndo() {
      if(!this.undoHub.canUnundo) return

      this.setDefaultNode()

      this.undoHub.stackIndex++
      this.useUndo(this.undoHub.stack[this.undoHub.stackIndex])

      if(this.undoHub.stackIndex === this.undoHub.stack.length - 1) {
        this.undoHub.canUnundo = false
      }

      this.undoHub.canUndo = true
    },
    setRecord() {
      if(!this.startRecord) return

      if(this.undoHub.stack.length < 100) {
        this.undoHub.canUndo = true
        this.undoHub.canUnundo = false
        
        this.undoHub.stack = this.undoHub.stack.slice(0, this.undoHub.stackIndex + 1)

        this.undoHub.stack.push([
          {
            type: 'tpl',
            data: JSON.parse(JSON.stringify(this.tplInfo)),
          },{
            type: 'controls',
            data: JSON.parse(JSON.stringify(this.controls)),
          }
        ])

        this.undoHub.stackIndex = this.undoHub.stack.length - 1
      }
    },
    useUndo(states) {
      let clonedStates = JSON.parse(JSON.stringify(states))
      clonedStates.forEach(({ type, data }) => {
        if(type === 'tpl') {
          this.tplInfo = data
        } else {
          this.controls = []
          this.placeholds = []
          this.$refs.wrapper.innerHTML = ''
    
          data.forEach((c) => {
            this.initControl(c)
          })
        }
      })
    },
    setTextAlign(type) {
      if(!['title', 'subTitle', 'field'].includes(this.currentNode.type)) return

      if(this.currentNode.dynamic.align === type) return

      this.currentNode.dynamic.align = type
      // console.log('text align')
      this.setRecord()
    },
    reRenderRightAlignText() {
      const textControls = this.controls.filter(({ type, dynamic }) => {
        if(['title', 'subTitle', 'field'].includes(type) && dynamic.align === 'right') {
          return true
        }
        return false
      })

      textControls.forEach((c) => {
        reRenderDynamicAttrs(c, document.getElementById(c.id), this.tplInfo.width * 3)
      })
    },
  },
  watch: {
    currentNode: {
      deep: true,
      handler() {
        if(this.currentNode.type === 'logo') {
          if(this.currentNode.dynamic.width <= 0) {
            this.currentNode.dynamic.width = 1
          }
          if(this.currentNode.dynamic.width > this.tplInfo.width * 3) {
            this.currentNode.dynamic.width = this.tplInfo.width * 3
          }
          if(this.currentNode.dynamic.height <= 0) {
            this.currentNode.dynamic.height = 1
          }
          if(this.currentNode.dynamic.height > this.tplInfo.height * 3) {
            this.currentNode.dynamic.height = this.tplInfo.height * 3
          }
        }

        this.setTransform()
        reRenderDynamicAttrs(this.currentNode, document.getElementById(this.currentNode.id), this.tplInfo.width * 3)
        this.renderMask()
        this.renderPlaceholder()
      }
    },
    scale() {
      this.renderMask()
      this.renderPlaceholder()
    },
    'tplInfo.width'() {
      this.renderPlaceholder()
    },
    'tplInfo.height'() {
      this.renderPlaceholder()
    },
    tplName() {
      this.$emit('update:templateName', this.tplName)
    },
    templateName: {
      immediate: true,
      handler() {
        this.tplName = this.templateName
      },
    },
  },
  computed: {
    currentNodeLevel() {
      return this.controls.findIndex((c) => c.id === this.currentNode.id)
    },
    logoWidth: {
      get: function() {
        if(this.currentNode.type !== 'logo') return 0
        let size = this.currentNode.dynamic
        return Math.ceil(size.width / 3)
      },
      set: function(val) {
        if(isNaN(val)) return
        this.currentNode.dynamic.width = val * 3
        // console.log('logo size')
        this.setRecord()
      },
    },
    logoHeight: {
      get: function() {
        if(this.currentNode.type !== 'logo') return 0
        let size = this.currentNode.dynamic
        return Math.ceil(size.height / 3)
      },
      set: function(val) {
        if(isNaN(val)) return
        this.currentNode.dynamic.height = val * 3
        // console.log('logo size')
        this.setRecord()
      },
    },
    nanoFonts() {
      return nativeFonts.concat(this.fonts)
    },
    nanoColors() {
      return nativeColors.concat(this.colors)
    },
  },
}
</script>

<template>
  <div class="template-editor-container" :style="{ '--template-editor-primary-color': primaryColor }">
    <div class="template-editor-header" v-show="showHotKeyBoard">
      <tool-tip content="撤销">
        <svg @click="undo" width="18px" height="18px" :class="['template-container-control', { 'disabled': !undoHub.canUndo }]" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="template-container-control-item" d="M12.245,5.66 L4.93,5.66 L4.93,3.45710678 C4.93,3.18096441 4.70614237,2.95710678 4.43,2.95710678 C4.29739176,2.95710678 4.1702148,3.0097852 4.07644661,3.10355339 L1.10355339,6.07644661 C0.908291245,6.27170876 0.908291245,6.58829124 1.10355339,6.78355339 L4.07644661,9.75644661 C4.27170876,9.95170876 4.58829124,9.95170876 4.78355339,9.75644661 C4.87732158,9.66267842 4.93,9.53550146 4.93,9.40289322 L4.93,7.2 L4.93,7.2 L12.245,7.2 C14.1586666,7.20000004 15.7099999,8.75133337 15.7099999,10.665 C15.7099999,12.5786666 14.1586666,14.13 12.245,14.13 L5.7,14.13 C5.27474074,14.13 4.93,14.4747407 4.93,14.9 C4.93,15.3252593 5.27474074,15.67 5.7,15.67 L12.245,15.67 L12.245,15.67 C15.0091852,15.67 17.25,13.4291852 17.25,10.665 C17.25,7.90081483 15.0091852,5.66 12.245,5.66 Z"></path></svg>
      </tool-tip>
      <tool-tip content="前进">
        <svg @click="unUndo" width="18px" height="18px" :class="['template-container-control', { 'disabled': !undoHub.canUnundo }]" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="template-container-control-item" d="M12.245,5.66 L4.93,5.66 L4.93,3.45710678 C4.93,3.18096441 4.70614237,2.95710678 4.43,2.95710678 C4.29739176,2.95710678 4.1702148,3.0097852 4.07644661,3.10355339 L1.10355339,6.07644661 C0.908291245,6.27170876 0.908291245,6.58829124 1.10355339,6.78355339 L4.07644661,9.75644661 C4.27170876,9.95170876 4.58829124,9.95170876 4.78355339,9.75644661 C4.87732158,9.66267842 4.93,9.53550146 4.93,9.40289322 L4.93,7.2 L4.93,7.2 L12.245,7.2 C14.1586666,7.20000004 15.7099999,8.75133337 15.7099999,10.665 C15.7099999,12.5786666 14.1586666,14.13 12.245,14.13 L5.7,14.13 C5.27474074,14.13 4.93,14.4747407 4.93,14.9 C4.93,15.3252593 5.27474074,15.67 5.7,15.67 L12.245,15.67 L12.245,15.67 C15.0091852,15.67 17.25,13.4291852 17.25,10.665 C17.25,7.90081483 15.0091852,5.66 12.245,5.66 Z" transform="translate(9.000000, 8.960000) scale(-1, 1) translate(-9.000000, -8.960000) "></path></svg>
      </tool-tip>
      <span style="background-color: #EEEEEE; width: 1px; height: 15px;"></span>
      <tool-tip content="复制">
        <svg width="18px" height="18px" viewBox="0 0 18 18" @click="cloneControl" :class="['template-container-control', { 'disabled': currentNode.type === 'bg' }]" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="template-container-control-item" d="M11.25,5.25 C12.0784271,5.25 12.75,5.92157288 12.75,6.75 L12.75,15.75 C12.75,16.5784271 12.0784271,17.25 11.25,17.25 L2.25,17.25 C1.42157288,17.25 0.75,16.5784271 0.75,15.75 L0.75,6.75 C0.75,5.92157288 1.42157288,5.25 2.25,5.25 L11.25,5.25 Z M11.25,6.75 L2.25,6.75 L2.25,15.75 L11.25,15.75 L11.25,6.75 Z M15.75,0.75 C16.5784271,0.75 17.25,1.42157288 17.25,2.25 L17.25,11.25 C17.25,12.0784271 16.5784271,12.75 15.75,12.75 L13.5,12.75 L13.5,11.25 L15.75,11.25 L15.75,2.25 L6.75,2.25 L6.75,4.499 L5.25,4.499 L5.25,2.25 C5.25,1.42157288 5.92157288,0.75 6.75,0.75 L15.75,0.75 Z"></path></svg>
      </tool-tip>
      <tool-tip content="粘贴">
        <svg width="18px" height="18px" viewBox="0 0 18 18" @click="pasteControl" :class="['template-container-control', { 'disabled': cloneControlCache === null }]" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g class="template-container-control-item"><path d="M11.25,0.75 C12.0784271,0.75 12.75,1.42157288 12.75,2.25 L12.75,11.25 C12.75,12.0784271 12.0784271,12.75 11.25,12.75 L2.25,12.75 C1.42157288,12.75 0.75,12.0784271 0.75,11.25 L0.75,2.25 C0.75,1.42157288 1.42157288,0.75 2.25,0.75 L11.25,0.75 Z M11.25,2.25 L2.25,2.25 L2.25,11.25 L11.25,11.25 L11.25,2.25 Z"></path><path d="M5.25,14.25 L6.75,14.25 L6.75,15.75 L8.25,15.75 L8.25,17.25 L6.75,17.25 C5.92157288,17.25 5.25,16.5784271 5.25,15.75 L5.25,14.25 Z M12.75,15.75 L12.75,17.25 L9.75,17.25 L9.75,15.75 L12.75,15.75 Z M17.24925,14.24925 L17.25,15.75 C17.25,16.5784271 16.5784271,17.25 15.75,17.25 L14.25,17.25 L14.25,15.75 L15.75,15.75 L15.74925,14.24925 L17.24925,14.24925 Z M17.24925,9.74925 L17.24925,12.74925 L15.74925,12.74925 L15.74925,9.74925 L17.24925,9.74925 Z M15.75,5.25 C16.5784271,5.25 17.25,5.92157288 17.25,6.75 L17.25,8.24925 L15.75,8.24925 L15.75,6.75 L14.25,6.75 L14.25,5.25 L15.75,5.25 Z"></path></g></svg>
      </tool-tip>
      <tool-tip content="最佳视图">
        <svg @click="fitScale" class="template-container-control" width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="template-container-control-item" d="M16.5,1.5 C17.3284271,1.5 18,2.17157288 18,3 L18,15 C18,15.8284271 17.3284271,16.5 16.5,16.5 L1.5,16.5 C0.671572875,16.5 0,15.8284271 0,15 L0,3 C0,2.17157288 0.671572875,1.5 1.5,1.5 L16.5,1.5 Z M16.5,3 L1.5,3 L1.5,15 L16.5,15 L16.5,3 Z M5.25,5.25 L5.25,12.75 L3.75,12.75 L3.75,5.25 L5.25,5.25 Z M14.25,5.25 L14.25,12.75 L12.75,12.75 L12.75,5.25 L14.25,5.25 Z M9,9.75 C9.62132034,9.75 10.125,10.2536797 10.125,10.875 C10.125,11.4963203 9.62132034,12 9,12 C8.37867966,12 7.875,11.4963203 7.875,10.875 C7.875,10.2536797 8.37867966,9.75 9,9.75 Z M9,6 C9.62132034,6 10.125,6.50367966 10.125,7.125 C10.125,7.74632034 9.62132034,8.25 9,8.25 C8.37867966,8.25 7.875,7.74632034 7.875,7.125 C7.875,6.50367966 8.37867966,6 9,6 Z"></path></svg>
      </tool-tip>
      <span style="background-color: #EEEEEE; width: 1px; height: 15px;"></span>
      <tool-tip content="缩小画布">
        <svg @click="modifyScale(-10)" class="template-container-control" width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="template-container-control-item" d="M7.5,2.13162821e-14 C11.6421356,2.13162821e-14 15,3.35786438 15,7.5 C15,9.30088771 14.3652718,10.9535267 13.3073234,12.246409 L16.2803301,15.2196699 C16.5732233,15.5125631 16.5732233,15.9874369 16.2803301,16.2803301 C16.0099671,16.5506931 15.5845438,16.5714902 15.2903254,16.3427215 L15.2196699,16.2803301 L12.246409,13.3073234 C10.9535267,14.3652718 9.30088771,15 7.5,15 C3.35786438,15 0,11.6421356 0,7.5 C0,3.35786438 3.35786438,2.13162821e-14 7.5,2.13162821e-14 Z M7.5,1.5 C4.1862915,1.5 1.5,4.1862915 1.5,7.5 C1.5,10.8137085 4.1862915,13.5 7.5,13.5 C10.8137085,13.5 13.5,10.8137085 13.5,7.5 C13.5,4.1862915 10.8137085,1.5 7.5,1.5 Z M10.5,6.75 C10.9142136,6.75 11.25,7.08578644 11.25,7.5 C11.25,7.91421356 10.9142136,8.25 10.5,8.25 L4.5,8.25 C4.08578644,8.25 3.75,7.91421356 3.75,7.5 C3.75,7.08578644 4.08578644,6.75 4.5,6.75 L10.5,6.75 Z"></path></svg>
      </tool-tip>
      <span class="text-xs text-[#646A73]">{{ `${scale}%` }}</span>
      <tool-tip content="放大画布">
        <svg @click="modifyScale(10)" class="template-container-control" width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path class="template-container-control-item" d="M7.5,2.13162821e-14 C11.6421356,2.13162821e-14 15,3.35786438 15,7.5 C15,9.30088771 14.3652718,10.9535267 13.3073234,12.246409 L16.2803301,15.2196699 C16.5732233,15.5125631 16.5732233,15.9874369 16.2803301,16.2803301 C16.0099671,16.5506931 15.5845438,16.5714902 15.2903254,16.3427215 L15.2196699,16.2803301 L12.246409,13.3073234 C10.9535267,14.3652718 9.30088771,15 7.5,15 C3.35786438,15 0,11.6421356 0,7.5 C0,3.35786438 3.35786438,2.13162821e-14 7.5,2.13162821e-14 Z M7.5,1.5 C4.1862915,1.5 1.5,4.1862915 1.5,7.5 C1.5,10.8137085 4.1862915,13.5 7.5,13.5 C10.8137085,13.5 13.5,10.8137085 13.5,7.5 C13.5,4.1862915 10.8137085,1.5 7.5,1.5 Z M7.5,3.75 C7.91421356,3.75 8.25,4.08578644 8.25,4.5 L8.25,6.749 L10.5,6.75 C10.9142136,6.75 11.25,7.08578644 11.25,7.5 C11.25,7.91421356 10.9142136,8.25 10.5,8.25 L8.25,8.249 L8.25,10.5 C8.25,10.9142136 7.91421356,11.25 7.5,11.25 C7.08578644,11.25 6.75,10.9142136 6.75,10.5 L6.75,8.249 L4.5,8.25 C4.08578644,8.25 3.75,7.91421356 3.75,7.5 C3.75,7.08578644 4.08578644,6.75 4.5,6.75 L6.75,6.749 L6.75,4.5 C6.75,4.08578644 7.08578644,3.75 7.5,3.75 Z"></path></svg>
      </tool-tip>
    </div>

    <div class="template-editor-main-wrapper">
      <div class="template-editor-control-lib" v-show="showControlLib">
        <span class="template-editor-control-lib-title">控件库</span>
        <div v-for="(c, i) of nativeControls" :key="i" class="template-editor-control-lib-item" @dragstart.stop="handleDrag(c, $event)" draggable="true">
          <div v-html="c.svg"></div>
          <span>{{ c.text }}</span>
        </div>
      </div>
      <div class="template-editor-template-wrapper" @mousedown.self="setDefaultNode" @mousemove="handleMouseMove" ref="container">
        <div :style="{ 'height': `${tplInfo.height * 3 * scale / 100}px`, width: `${tplInfo.width * 3 * scale / 100}px`, }" 
             style="box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.1);z-index: 10;background-color:white;flex:none;">
          <svg
            width="100%" height="100%"
            version="1.1" :viewBox="`0 0 ${tplInfo.width * 3} ${tplInfo.height * 3}`"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            ref="tpl"
          >
            <rect x="0" y="0" data-type="bg" :fill="tplInfo.bgColor" width="100%" height="100%" @click.self="setDefaultNode"></rect>
            <g ref="wrapper"></g>
          </svg>

          <event-tsf-mask v-show="maskVisible" :currentNode="currentNode" ref="mask"></event-tsf-mask>
        </div>
        <div v-for="p of placeholds" :id="p.id" :key="p.id" class="tpl-control-placeholder" @mousedown.stop="handleMouseDown"></div>
      </div>
      <div class="template-editor-control-attribute-wrapper" v-show="showAttrsBoard">
        <div class="template-editor-control-attribute-title">
          <template v-if="currentNode.type === 'bg'">
            <span style="font-weight:500;">模板编辑</span>
          </template>
          <template v-else>
            <template v-for="(c, i) of nativeControls">
              <div :key="i" v-show="c.ctx.type === currentNode.type" style="display: flex; align-items: center;">
                <div v-html="c.svg" style="margin-right: 10px;"></div>
                <span style="font-weight:500;">{{ c.text }}</span>
              </div>
            </template>
          </template>
        </div>
        <div class="template-editor-control-attribute-level" v-if="currentNode.type !== 'bg'">
          <div @click="toEdge('top')" :class="['template-editor-control-attribute-level-item', { 'edged': currentNodeLevel === controls.length - 1 }]">
            <tool-tip content="置顶">
              <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-68.000000, -576.000000)" fill="#646A73"><g transform="translate(41.000000, 463.000000)"><g transform="translate(0.000000, 102.000000)"><g transform="translate(27.000000, 11.000000)"><path d="M14.25,13.5 C15.4926407,13.5 16.5,14.5073593 16.5,15.75 C16.5,16.9926407 15.4926407,18 14.25,18 L3.75,18 C2.50735931,18 1.5,16.9926407 1.5,15.75 C1.5,14.5073593 2.50735931,13.5 3.75,13.5 L14.25,13.5 Z M14.25,15 L3.75,15 C3.33578644,15 3,15.3357864 3,15.75 C3,16.1346269 3.28953014,16.4516304 3.66253416,16.4949542 L3.75,16.5 L14.25,16.5 C14.6642136,16.5 15,16.1642136 15,15.75 C15,15.3653731 14.7104699,15.0483696 14.3374658,15.0050458 L14.25,15 Z" fill-rule="nonzero"></path><path d="M14.25,7.5 C15.4926407,7.5 16.5,8.50735931 16.5,9.75 C16.5,10.9926407 15.4926407,12 14.25,12 L3.75,12 C2.50735931,12 1.5,10.9926407 1.5,9.75 C1.5,8.50735931 2.50735931,7.5 3.75,7.5 L14.25,7.5 Z M14.25,9 L3.75,9 C3.33578644,9 3,9.33578644 3,9.75 C3,10.1346269 3.28953014,10.4516304 3.66253416,10.4949542 L3.75,10.5 L14.25,10.5 C14.6642136,10.5 15,10.1642136 15,9.75 C15,9.36537312 14.7104699,9.04836963 14.3374658,9.0050458 L14.25,9 Z" fill-rule="nonzero"></path><path d="M9.53033009,0.969669914 L13.0229708,4.4623106 C13.315864,4.75520382 13.315864,5.23007755 13.0229708,5.52297077 C12.7300776,5.81586399 12.2552038,5.81586399 11.9623106,5.52297077 L9.74935931,3.3105 L9.75,7.99264069 C9.75,8.40685425 9.41421356,8.74264069 9,8.74264069 C8.58578644,8.74264069 8.25,8.40685425 8.25,7.99264069 L8.24935931,3.3105 L6.0376894,5.52297077 C5.74479618,5.81586399 5.26992245,5.81586399 4.97702923,5.52297077 C4.68413601,5.23007755 4.68413601,4.75520382 4.97702923,4.4623106 L8.46966991,0.969669914 C8.76256313,0.676776695 9.23743687,0.676776695 9.53033009,0.969669914 Z" transform="translate(9.000000, 4.746320) scale(-1, 1) translate(-9.000000, -4.746320) "></path><rect x="8.25" y="11.25" width="1.5" height="3.75" rx="0.75"></rect></g></g></g></g></g></svg>
            </tool-tip>
          </div>
          <div :class="['template-editor-control-attribute-level-item', { 'edged': currentNodeLevel === controls.length - 1 }]" @click="moveLevel('up')">
            <tool-tip content="上移">
              <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-124.000000, -576.000000)" fill="#646A73"><g transform="translate(41.000000, 463.000000)"><g transform="translate(0.000000, 102.000000)"><g transform="translate(83.000000, 11.000000)"><path d="M14.25,12.75 C15.4926407,12.75 16.5,13.7573593 16.5,15 C16.5,16.2426407 15.4926407,17.25 14.25,17.25 L3.75,17.25 C2.50735931,17.25 1.5,16.2426407 1.5,15 C1.5,13.7573593 2.50735931,12.75 3.75,12.75 L14.25,12.75 Z M14.25,14.25 L3.75,14.25 C3.33578644,14.25 3,14.5857864 3,15 C3,15.3846269 3.28953014,15.7016304 3.66253416,15.7449542 L3.75,15.75 L14.25,15.75 C14.6642136,15.75 15,15.4142136 15,15 C15,14.6153731 14.7104699,14.2983696 14.3374658,14.2550458 L14.25,14.25 Z" fill-rule="nonzero"></path><path d="M9.53033009,0.969669914 L13.0229708,4.4623106 C13.315864,4.75520382 13.315864,5.23007755 13.0229708,5.52297077 C12.7300776,5.81586399 12.2552038,5.81586399 11.9623106,5.52297077 L9.74935931,3.3105 L9.75,7.99264069 C9.75,8.40685425 9.41421356,8.74264069 9,8.74264069 C8.58578644,8.74264069 8.25,8.40685425 8.25,7.99264069 L8.24935931,3.3105 L6.0376894,5.52297077 C5.74479618,5.81586399 5.26992245,5.81586399 4.97702923,5.52297077 C4.68413601,5.23007755 4.68413601,4.75520382 4.97702923,4.4623106 L8.46966991,0.969669914 C8.76256313,0.676776695 9.23743687,0.676776695 9.53033009,0.969669914 Z" transform="translate(9.000000, 4.746320) scale(-1, 1) translate(-9.000000, -4.746320) "></path><rect x="8.25" y="7.5" width="1.5" height="6.75" rx="0.75"></rect><rect x="2.25" y="8.25" width="13.5" height="1.5" rx="0.75"></rect></g></g></g></g></g></svg>
            </tool-tip>
          </div>
          <div :class="['template-editor-control-attribute-level-item', { 'edged': currentNodeLevel === 0 }]" @click="moveLevel('dowm')">
            <tool-tip content="下移">
              <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-180.000000, -576.000000)" fill="#646A73"><g transform="translate(41.000000, 463.000000)"><g transform="translate(0.000000, 102.000000)"><g transform="translate(139.000000, 11.000000)"><path d="M14.25,0.75 C15.4926407,0.75 16.5,1.75735931 16.5,3 C16.5,4.24264069 15.4926407,5.25 14.25,5.25 L3.75,5.25 C2.50735931,5.25 1.5,4.24264069 1.5,3 C1.5,1.75735931 2.50735931,0.75 3.75,0.75 L14.25,0.75 Z M14.25,2.25 L3.75,2.25 C3.33578644,2.25 3,2.58578644 3,3 C3,3.38462688 3.28953014,3.70163037 3.66253416,3.7449542 L3.75,3.75 L14.25,3.75 C14.6642136,3.75 15,3.41421356 15,3 C15,2.61537312 14.7104699,2.29836963 14.3374658,2.2550458 L14.25,2.25 Z" fill-rule="nonzero" transform="translate(9.000000, 3.000000) rotate(-180.000000) translate(-9.000000, -3.000000) "></path><path d="M9.53033009,9.47702923 L13.0229708,12.9696699 C13.315864,13.2625631 13.315864,13.7374369 13.0229708,14.0303301 C12.7300776,14.3232233 12.2552038,14.3232233 11.9623106,14.0303301 L9.74935931,11.8178593 L9.75,16.5 C9.75,16.9142136 9.41421356,17.25 9,17.25 C8.58578644,17.25 8.25,16.9142136 8.25,16.5 L8.24935931,11.8178593 L6.0376894,14.0303301 C5.74479618,14.3232233 5.26992245,14.3232233 4.97702923,14.0303301 C4.68413601,13.7374369 4.68413601,13.2625631 4.97702923,12.9696699 L8.46966991,9.47702923 C8.76256313,9.18413601 9.23743687,9.18413601 9.53033009,9.47702923 Z" transform="translate(9.000000, 13.253680) scale(-1, 1) rotate(-180.000000) translate(-9.000000, -13.253680) "></path><rect transform="translate(9.000000, 7.125000) rotate(-180.000000) translate(-9.000000, -7.125000) " x="8.25" y="3.75" width="1.5" height="6.75" rx="0.75"></rect><rect transform="translate(9.000000, 9.000000) rotate(-180.000000) translate(-9.000000, -9.000000) " x="2.25" y="8.25" width="13.5" height="1.5" rx="0.75"></rect></g></g></g></g></g></svg>
            </tool-tip>
          </div>
          <div @click="toEdge('bottom')" :class="['template-editor-control-attribute-level-item', { 'edged': currentNodeLevel === 0 }]">
            <tool-tip content="置底">
              <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-236.000000, -576.000000)" fill="#646A73"><g transform="translate(41.000000, 463.000000)"><g transform="translate(0.000000, 102.000000)"><g transform="translate(195.000000, 11.000000)"><path d="M14.25,0.75 C15.4926407,0.75 16.5,1.75735931 16.5,3 C16.5,4.24264069 15.4926407,5.25 14.25,5.25 L3.75,5.25 C2.50735931,5.25 1.5,4.24264069 1.5,3 C1.5,1.75735931 2.50735931,0.75 3.75,0.75 L14.25,0.75 Z M14.25,2.25 L3.75,2.25 C3.33578644,2.25 3,2.58578644 3,3 C3,3.38462688 3.28953014,3.70163037 3.66253416,3.7449542 L3.75,3.75 L14.25,3.75 C14.6642136,3.75 15,3.41421356 15,3 C15,2.61537312 14.7104699,2.29836963 14.3374658,2.2550458 L14.25,2.25 Z" fill-rule="nonzero" transform="translate(9.000000, 3.000000) rotate(-180.000000) translate(-9.000000, -3.000000) "></path><path d="M14.25,6.75 C15.4926407,6.75 16.5,7.75735931 16.5,9 C16.5,10.2426407 15.4926407,11.25 14.25,11.25 L3.75,11.25 C2.50735931,11.25 1.5,10.2426407 1.5,9 C1.5,7.75735931 2.50735931,6.75 3.75,6.75 L14.25,6.75 Z M14.25,8.25 L3.75,8.25 C3.33578644,8.25 3,8.58578644 3,9 C3,9.38462688 3.28953014,9.70163037 3.66253416,9.7449542 L3.75,9.75 L14.25,9.75 C14.6642136,9.75 15,9.41421356 15,9 C15,8.61537312 14.7104699,8.29836963 14.3374658,8.2550458 L14.25,8.25 Z" fill-rule="nonzero" transform="translate(9.000000, 9.000000) rotate(-180.000000) translate(-9.000000, -9.000000) "></path><path d="M9.53033009,10.2270292 L13.0229708,13.7196699 C13.315864,14.0125631 13.315864,14.4874369 13.0229708,14.7803301 C12.7300776,15.0732233 12.2552038,15.0732233 11.9623106,14.7803301 L9.74935931,12.5678593 L9.75,17.25 C9.75,17.6642136 9.41421356,18 9,18 C8.58578644,18 8.25,17.6642136 8.25,17.25 L8.24935931,12.5678593 L6.0376894,14.7803301 C5.74479618,15.0732233 5.26992245,15.0732233 4.97702923,14.7803301 C4.68413601,14.4874369 4.68413601,14.0125631 4.97702923,13.7196699 L8.46966991,10.2270292 C8.76256313,9.93413601 9.23743687,9.93413601 9.53033009,10.2270292 Z" transform="translate(9.000000, 14.003680) scale(-1, 1) rotate(-180.000000) translate(-9.000000, -14.003680) "></path><rect transform="translate(9.000000, 5.625000) rotate(-180.000000) translate(-9.000000, -5.625000) " x="8.25" y="3.75" width="1.5" height="3.75" rx="0.75"></rect></g></g></g></g></g></svg>
            </tool-tip>
          </div>
          <tool-tip content="删除">
            <svg @click="removeControl" class="template-editor-control-attribute-level-del" width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M15,5.25 C15.3846269,5.25 15.7016304,5.53953014 15.7449542,5.91253416 L15.75,6 L15.75,15 C15.75,16.1982607 14.81331,17.1777457 13.6322046,17.2461805 L13.5,17.25 L4.5,17.25 C3.30173934,17.25 2.32225434,16.31331 2.25381952,15.1322046 L2.25,15 L2.25,6 C2.25,5.58578644 2.58578644,5.25 3,5.25 C3.38462688,5.25 3.70163037,5.53953014 3.7449542,5.91253416 L3.75,6 L3.75,15 C3.75,15.3846269 4.03953014,15.7016304 4.41253416,15.7449542 L4.5,15.75 L13.5,15.75 C13.8846269,15.75 14.2016304,15.4604699 14.2449542,15.0874658 L14.25,15 L14.25,6 C14.25,5.58578644 14.5857864,5.25 15,5.25 Z M6.75,6 C7.16421356,6 7.5,6.33578644 7.5,6.75 L7.5,13.5 C7.5,13.9142136 7.16421356,14.25 6.75,14.25 C6.33578644,14.25 6,13.9142136 6,13.5 L6,6.75 C6,6.33578644 6.33578644,6 6.75,6 Z M11.25,6 C11.6642136,6 12,6.33578644 12,6.75 L12,13.5 C12,13.9142136 11.6642136,14.25 11.25,14.25 C10.8357864,14.25 10.5,13.9142136 10.5,13.5 L10.5,6.75 C10.5,6.33578644 10.8357864,6 11.25,6 Z M10.4472244,0.75 C11.1493661,0.75 11.8081489,1.07751823 12.2321447,1.63010542 L12.3193375,1.75192456 L12.9287379,2.66602515 C13.0504498,2.84859302 13.2449529,2.96736661 13.4596698,2.99420739 L13.5527756,3 L16.5,3 C16.9142136,3 17.25,3.33578644 17.25,3.75 C17.25,4.13462688 16.9604699,4.45163037 16.5874658,4.4949542 L16.5,4.5 L13.5527756,4.5 C12.8506339,4.5 12.1918511,4.17248177 11.7678553,3.61989458 L11.6806625,3.49807544 L11.0712621,2.58397485 C10.9495502,2.40140698 10.7550471,2.28263339 10.5403302,2.25579261 L10.4472244,2.25 L7.55277564,2.25 C7.33335636,2.25 7.12663987,2.34595261 6.98520348,2.50971929 L6.92873792,2.58397485 L6.31933752,3.49807544 C5.92985939,4.08229265 5.29192078,4.44875868 4.59694988,4.4950243 L4.44722436,4.5 L1.5,4.5 C1.08578644,4.5 0.75,4.16421356 0.75,3.75 C0.75,3.36537312 1.03953014,3.04836963 1.41253416,3.0050458 L1.5,3 L4.44722436,3 C4.66664364,3 4.87336013,2.90404739 5.01479652,2.74028071 L5.07126208,2.66602515 L5.68066248,1.75192456 C6.07014061,1.16770735 6.70807922,0.801241316 7.40305012,0.754975698 L7.55277564,0.75 L10.4472244,0.75 Z" fill="#646A73"></path></svg>
          </tool-tip>
        </div>
        <template v-if="currentNode.type !== 'qr'">
          <template v-if="currentNode.type === 'bg'">
            <div class="template-editor-control-attribute-item">
              <span>标签名称<span style="display: inline-block; margin-left: 4px; color: #F65752;">*</span>：</span>
              <input class="template-editor-input" v-model.trim="tplName" placeholder="请输入标签名称">
            </div>
            <div class="template-editor-control-attribute-item">
              <span>标签尺寸：</span>
              <div style="display: flex;">
                <span style="margin-right: 10px;">{{ `${tplInfo.width}×${tplInfo.height}&nbsp;mm` }}</span>
                <size-picker @select="changeSize" :activeSize="[tplInfo.width, tplInfo.height]"></size-picker>
              </div>

              <div :class="['tpl-size-dialog', { 'show-dialog': tplReadySize.v}]">
                <div class="tpl-size-dialog-body" style="padding: 20px 26px;display: flex;flex-direction: column;color:#000c25;">
                  <span style="font-size: 14px;font-weight:500;">请输入标签尺寸</span>
                  <div class="flex items-center text-normal gap-12px mt-19px" style="display:flex;align-items:center;gap:12px;margin-top:18px;">
                    <span>宽</span>
                    <input class="template-editor-input" v-model.number="tplReadySize.width" @blur="checkReadySize" style="width:92px;">
                    <span>高</span>
                    <input class="template-editor-input" v-model.number="tplReadySize.height" @blur="checkReadySize" style="width:92px;">
                    <span>mm</span>
                  </div>
                  <div style="display:flex;justify-content:flex-end;align-items:center;margin-top:18px;">
                    <button class="template-editor-button" @click="tplReadySize.v = false" style="margin-right:10px;">取消</button>
                    <button class="template-editor-button template-editor-button--primary" @click="reTplSize">确定</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="template-editor-control-attribute-item">
              <span>标签背景：</span>
              <div style="display: flex;align-items:center;">
                <span style="width: 32px;height: 32px;border: #e5e7eb 1px solid;border-radius: 4px;margin-right: 10px;padding: 3px;">
                  <span style="display: inline-block;width: 100%;height: 100%;border-radius: 4px;" :style="{ 'border': tplInfo.bgColor === '#FFFFFF' ? 'solid 1px rgba(156, 163, 175, .4)' : 'none', 'background-color': tplInfo.bgColor }"></span>
                </span>
                <color-picker :colors="nanoColors" :activeColor="tplInfo.bgColor" @select="changeColor"></color-picker>
              </div>
            </div>
          </template>
          <template v-if="currentNode.type === 'rect'">
            <div class="template-editor-control-attribute-item">
              <span>矩形颜色</span>
              <div style="display: flex;align-items:center;">
                <span style="width: 32px;height: 32px;border: #e5e7eb 1px solid;border-radius: 4px;margin-right: 10px;padding: 3px;">
                  <span style="display: inline-block;width: 100%;height: 100%;border-radius: 4px;" :style="{ 'border': currentNode.dynamic.fill === '#FFFFFF' ? 'solid 1px rgba(156, 163, 175, .4)' : 'none', 'background-color': currentNode.dynamic.fill }"></span>
                </span>
                <color-picker :colors="nanoColors" :activeColor="currentNode.dynamic.fill" @select="changeColor"></color-picker>
              </div>
            </div>
            <div class="template-editor-control-attribute-item">
              <span>圆角大小：{{ currentNode.dynamic.rx }}</span>
              <div style="border-radius:4px;border:1px solid #DFE3E9;padding:10px 15px;">
                <Slider :val.sync="currentNode.dynamic.rx" :max="50" @change="setRecord" />
              </div>
            </div>
          </template>
          <template v-if="['title', 'subTitle', 'field'].includes(currentNode.type)">
            <div class="template-editor-control-attribute-item">
              <span>字体设置</span>
              <c-select :val.sync="currentNode.children[1].dynamic['font-family']" :options="nanoFonts" @change="setRecord"></c-select>
              <c-select :val.sync="currentNode.dynamic.size" :options="[12, 14, 18, 24, 30, 36, 48, 60, 72]" @change="setRecord"></c-select>

              <div style="display:flex;align-items:center;gap:14px">
                <tool-tip content="左对齐">
                  <div @click="setTextAlign('left')" style="cursor: pointer;" :class="['text-control-attribute', { 'active': currentNode.dynamic.align === 'left' }]"><svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(5,6)" fill="#646A73"><rect x="0" y="0" width="12" height="1.6"></rect><rect x="0" y="4" width="6" height="1.6"></rect><rect x="0" y="8" width="9" height="1.6"></rect></g></svg></div>
                </tool-tip>
                <tool-tip content="居中对齐">
                  <div @click="setTextAlign('center')" style="cursor: pointer;" :class="['text-control-attribute', { 'active': currentNode.dynamic.align === 'center' }]"><svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(5,6)" fill="#646A73"><rect x="0" y="0" width="12" height="1.6"></rect><rect x="3" y="4" width="6" height="1.6"></rect><rect x="2" y="8" width="8" height="1.6"></rect></g></svg></div>
                </tool-tip>
                <tool-tip content="右对齐">
                  <div @click="setTextAlign('right')" style="cursor: pointer;" :class="['text-control-attribute ', { 'active': currentNode.dynamic.align === 'right' }]"><svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(5,6)" fill="#646A73"><rect x="0" y="0" width="12" height="1.6"></rect><rect x="0" y="4" width="6" height="1.6"></rect><rect x="0" y="8" width="9" height="1.6"></rect></g></svg></div>
                </tool-tip>
              </div>

              <div style="display:flex;align-items:center;gap:14px">
                <tool-tip content="粗体">
                  <div @click="toggleBold" style="cursor: pointer;" :class="['text-control-attribute', { 'active': currentNode.children[1].dynamic['font-weight'] === 'bold' }]"><svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path transform="translate(-1,-1)" d="M12.512605,18 C13.789916,18 14.7983193,17.7647059 15.5042017,17.2941176 C16.3277311,16.7226891 16.7478992,15.8319328 16.7478992,14.6218487 C16.7478992,13.8151261 16.5462185,13.1596639 16.1596639,12.6890756 C15.7563025,12.2016807 15.1680672,11.8823529 14.3781513,11.7310924 C14.9831933,11.4957983 15.4369748,11.1764706 15.7563025,10.7394958 C16.0756303,10.2689076 16.2436975,9.69747899 16.2436975,9.02521008 C16.2436975,8.11764706 15.9243697,7.39495798 15.302521,6.85714286 C14.6302521,6.28571429 13.6890756,6 12.4957983,6 L7,6 L7,18 L12.512605,18 Z M11.9747899,11.0420168 L8.96638655,11.0420168 L8.96638655,7.61344538 L12.0084034,7.61344538 C12.8151261,7.61344538 13.3865546,7.74789916 13.7563025,8.01680672 C14.092437,8.26890756 14.2773109,8.68907563 14.2773109,9.2605042 C14.2773109,9.88235294 14.092437,10.3361345 13.7563025,10.6218487 C13.4033613,10.8907563 12.8151261,11.0420168 11.9747899,11.0420168 Z M12.2268908,16.3865546 L8.96638655,16.3865546 L8.96638655,12.6554622 L12.2773109,12.6554622 C13.1512605,12.6554622 13.789916,12.8067227 14.1932773,13.1092437 C14.5798319,13.4117647 14.7815126,13.8991597 14.7815126,14.5882353 C14.7815126,15.2605042 14.512605,15.7310924 13.9747899,16.0336134 C13.5546218,16.2689076 12.9663866,16.3865546 12.2268908,16.3865546 Z" fill="#646A73"></path></svg></div>
                </tool-tip>
                <tool-tip content="斜体">
                  <div @click="toggleItalic" style="cursor: pointer;" :class="['text-control-attribute', { 'active': currentNode.children[1].dynamic['font-style'] === 'italic' }]"><svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path transform="translate(4,4)" d="M5.67792969,0.873632812 L5.55078125,1.49980469 C6.74433594,1.45332031 7.21601562,1.82382812 6.96445312,2.61269531 L5.18710937,11.309375 C5.09824219,12.1912109 4.47207031,12.5849609 3.30449219,12.4919922 L3.17734375,13.1181641 L8.30429687,13.1181641 L8.43144531,12.4919922 C7.18183594,12.5849609 6.715625,12.1912109 7.0328125,11.309375 L8.81015625,2.61269531 C8.83476562,1.82382812 9.45683594,1.45332031 10.6777344,1.49980469 L10.8048828,0.873632812 L5.67792969,0.873632812 Z" fill="#646A73"></path></svg></div>
                </tool-tip>
              </div>
            </div>

            <div class="template-editor-control-attribute-item">
              <span>字体颜色</span>
              <div style="display: flex;align-items:center;">
                <span style="width: 32px;height: 32px;border: #e5e7eb 1px solid;border-radius: 4px;margin-right: 10px;padding: 3px;">
                  <span style="display: inline-block;width: 100%;height: 100%;border-radius: 4px;" :style="{ 'border': currentNode.children[1].dynamic.fill === '#FFFFFF' ? 'solid 1px rgba(156, 163, 175, .4)' : 'none', 'background-color': currentNode.children[1].dynamic.fill }"></span>
                </span>
                <color-picker :colors="nanoColors" :activeColor="currentNode.children[1].dynamic.fill" @select="changeColor"></color-picker>
              </div>
            </div>
          </template>
          <template v-if="currentNode.type === 'line'">
            <div class="template-editor-control-attribute-item">
              <span>线条颜色</span>
              <div style="display: flex;align-items:center;">
                <span style="width: 32px;height: 32px;border: #e5e7eb 1px solid;border-radius: 4px;margin-right: 10px;padding: 3px;">
                  <span style="display: inline-block;width: 100%;height: 100%;border-radius: 4px;" :style="{ 'border': currentNode.children[1].dynamic.stroke === '#FFFFFF' ? 'solid 1px rgba(156, 163, 175, .4)' : 'none', 'background-color': currentNode.children[1].dynamic.stroke }"></span>
                </span>
                <color-picker :colors="nanoColors" :activeColor="currentNode.children[1].dynamic.stroke" @select="changeColor"></color-picker>
              </div>
            </div>
            <div class="template-editor-control-attribute-item">
              <span>线条样式</span>
              <div class="line-style-select" :style="{ 'border-color': showLineDashSelect ? 'var(--template-editor-primary-color)' : '#e5e7eb' }" @click="showLineDashSelect = !showLineDashSelect">
                <template v-for="(t, i) of ['0', '1 1', '2 1', '15 3 4 3', '15 3 4 3 4 3', '20 3 10 3']">
                  <svg
                    width="80px" height="4px" version="1.1" :key="i" v-show="currentNode.children[1].dynamic['stroke-dasharray'] === t.split(' ').map((d) => d * currentNode.children[1].dynamic['stroke-width']).join(' ')"
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <line x1="0" y1="0" x2="80" y2="0" stroke-width="4px" stroke="#000000" :stroke-dasharray="t.split(' ').map((i) => i * 4).join(' ')"></line>
                  </svg>
                </template>

                <svg style="width:10px;height:10px;" :class="[{ 'show-dash-select': showLineDashSelect }]" t="1651805230614" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1894" width="16" height="16"><path d="M512 378.24l-418.88 418.88L0 704l512-512 512 512-93.12 93.12z" fill="#262626" p-id="1895"></path></svg>

                <div class="line-style-select-wrapper" v-show="showLineDashSelect">
                  <div :class="['line-style-select-item', { 'active': currentNode.children[1].dynamic['stroke-dasharray'] === t.split(' ').map((d) => d * currentNode.children[1].dynamic['stroke-width']).join(' ') }]"
                      v-for="(t, i) of ['0', '1 1', '2 1', '15 3 4 3', '15 3 4 3 4 3', '20 3 10 3']" :key="i" @click="setLineDash(t)">
                    <svg
                      width="260px" height="4px" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                      <line x1="0" y1="0" x2="260" y2="0" stroke-width="4px" stroke="#000000" :stroke-dasharray="t.split(' ').map((i) => i * 4).join(' ')"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="currentNode.type === 'logo'">
            <div class="template-editor-control-attribute-item">
              <span>尺寸</span>
              <div>
                <span>宽</span>
                <input class="template-editor-input" v-model.number="logoWidth" style="width:100px;margin-left:10px;">
              </div>
              <div>
                <span>高</span>
                <input class="template-editor-input" v-model.number="logoHeight" style="width:100px;margin-left:10px;">
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.template-editor {
  input {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
    padding: 0;
    line-height: inherit;
    color: inherit;
    
    &::placeholder {
      opacity: 1;
      color: #9ca3af;
    }
    &::webkit-input-placeholder {
      opacity: 1;
      color: #9ca3af;
    }
    &::-moz-placeholder {
      opacity: 1;
      color: #9ca3af;
    }
    &:-ms-input-placeholder {
      opacity: 1;
      color: #9ca3af;
    }
    &::-ms-input-placeholder {
      opacity: 1;
      color: #9ca3af;
    }
  }

  &-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #eef1f5;
    color: #000c25;
    min-width: 790px;
    min-height: 510px;
    overflow: hidden;
  }

  &-header {
    flex: none;
    width: 100%;
    height: 56px;
    display: flex;
    gap: 32px;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    background-color: white;
    position: relative;
    box-shadow: 0px 4px 4px 0px rgba(34, 51, 97, 0.05);

    .template-container {
      &-control:not(.disabled) {
        cursor: pointer;
        &:hover {
          .template-container-control-item {
            fill: var(--template-editor-primary-color);
          }
        }
      }

      &-control-item {
        fill: #70767E;
      }

      &-control.disabled {
        cursor: not-allowed;
        opacity: .4;
      }

    }

  }

  &-main-wrapper {
    flex: 1;
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    .tpl-control-placeholder {
      position: fixed;
      border: 1px #B4B8C5 dashed;
      border-radius: 4px;
      z-index: 5;
    }
  }

  &-control-lib {
    flex: none;
    width: 168px;
    background-color: white;
    border-top: solid #DFE3E9 1px;
    padding: 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-title {
      font-size: 14px;
      font-weight: 500;
    }

    &-item {
      width: 128px;
      height: 36px;
      border: #e5e7eb solid 1px;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #646A73;
      font-size: 14px;

      &:hover {
        color: var(--template-editor-primary-color);
      
        path[fill], rect[fill], circle[fill] {
          fill: var(--template-editor-primary-color);
        }
      
        path[stroke], rect[stroke], circle[stroke] {
          stroke: var(--template-editor-primary-color);
        }
      }
    }
  }

  &-template-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    position: relative;
  }

  &-control-attribute {
    &-wrapper {
      flex: none;
      width: 168px;
      border-top: solid 1px #e5e7eb;
      background-color: white;
      display: flex;
      flex-direction: column;
      font-size: 14px;

      > * {
        padding: 0 20px;
      }
    }

    &-title {
      padding: 14px 20px;
      font-weight: 500;
      border-bottom: #e5e7eb 1px solid;
    }

    &-level {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      align-items: center;
      padding: 16px;
      margin: 20px 20px 0;
      border-radius: 4px;
      gap: 20px;
      background-color: #f6f6f6;

      &-del:hover {
        cursor: pointer;
        path {
          fill: #F54A45;
        }
      }

      &-item:not(.edged):hover {
        cursor: pointer;
        color: var(--template-editor-primary-color);
      
        path, g, rect, circle {
          fill: var(--template-editor-primary-color);
        }
      }
      .edged {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    &-item {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .line-style-select {
        width: 100%;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 0 10px;
        position: relative;
        transition: border-color .3s ease-in-out;

        .show-dash-select {
          transform: rotate(180deg);
        }

        &-wrapper {
          position: absolute;
          width: 280px;
          height: 210px;
          top: 38px;
          right: 0;
          border: 1px solid #DFE3E9;
          border-radius: 4px;
          background-color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        &-item {
          width: 278px;
          height: 34px;
          display: flex;
          justify-content: center;
          align-items: center;
          &.active {
            background-color: #EEF1F5;
          }
          &:hover {
            background-color: #f6f6f6;
            cursor: pointer;
          }
        }
      }
    }
  }

  &-input {
    color: #000c25;
    height: 34px;
    padding: 6px 8px;
    border-width: 1px;
    border-style: solid;
    border-color: #DFE3E9;
    border-radius: 4px;
    transition: border-color .3s ease-in-out;

    &:hover {
      border-color: #B4B8C5;
    }
    &:focus {
      border-color: var(--template-editor-primary-color);
    }
  }

  &-option {
    &.selected {
      color: var(--template-editor-primary-color) !important;
    }
  }

  &-button {
    font-size: 14px;
    height: 32px;
    line-height: 12px;
    padding: 0 14px;
    border-radius: 4px;
    cursor: pointer;

    background-color: white;
    color: #606266;
    border-width: 1px;
    border-style: solid;
    border-color: #dcdfe6;
    transition: all .3s ease-in-out;

    &:hover {
      color: var(--template-editor-primary-color);
      border-color: var(--template-editor-primary-color);
    }

    &--primary {
      color: white;
      background-color: var(--template-editor-primary-color);
      border-color: var(--template-editor-primary-color);

      &:hover {
        opacity: .8;
        color: white;
      }
    }
  }
}

text, tspan {
  user-select: none;
}

.text-control-attribute {
  width: 26px;
  height: 26px;
  border: solid 2px #DFE3E9;
  border-radius: 4px;

  &.active {
    border-color: var(--template-editor-primary-color);

    g, path {
      fill: var(--template-editor-primary-color);
    }
  }
}

.tpl-size-dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  background-color: rgba(0, 0, 0, .4);
  opacity: 0;
  transition: all .2s linear;

  &.show-dialog {
    opacity: 1;
    z-index: 999;

    .tpl-size-dialog-body {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-body {
    width: 340px;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    transition: all .1s ease-in-out;
    transform: translateY(-30%);
    opacity: 0;
  }
}
</style>
