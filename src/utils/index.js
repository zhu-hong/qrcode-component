import { customAlphabet } from 'nanoid'
import { fontFamilys } from '../data'

export function renderText(node, text, containerWidth) {
  if(text) {
    node.textContent = text
  
    const max = Number(node.getAttribute('data-max'))
    const len = Number(node.getAttribute('data-len'))

    let selfWidth = node.getBoundingClientRect().width
  
    let length = text.length

    if ((selfWidth / containerWidth) * 100 > max && length > len) {
  
      while ((selfWidth / containerWidth) * 100 > max) {
        node.textContent = text.slice(0, --length)
        selfWidth = node.getBoundingClientRect().width
  
        if((selfWidth / containerWidth) * 100 <= max || length <= len) {
          break
        }
      }
      
      node.textContent = node.textContent.slice(0, -1)
      node.textContent += '...'
    }
  }
}

export function encodeSvg(svgString) {
  return svgString.replace('<svg', (~svgString.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
    //
    //   Encode (may need a few extra replacements)
    //
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')
    // 
    //    The maybe list (add on documented fail)
    // 
    //  .replace(/&/g, '%26')
    //  .replace('|', '%7C')
    //  .replace('[', '%5B')
    //  .replace(']', '%5D')
    //  .replace('^', '%5E')
    //  .replace('`', '%60')
    //  .replace(';', '%3B')
    //  .replace('?', '%3F')
    //  .replace(':', '%3A')
    //  .replace('@', '%40')
    //  .replace('=', '%3D')
    ;
}

export function generateQrCodeContent(id) {
  return `https://dl-mobileres.effio.cn/yiyunapp/?qrid=${id}`
}

export const generateControl = (ctx, wrapperWidth) => {
  const ctxCloned = JSON.parse(JSON.stringify(ctx))
  const el = document.createElementNS('http://www.w3.org/2000/svg', ctxCloned.tag)

  if(ctxCloned.static) {
    Object.keys(ctxCloned.static).forEach((k) => {
      if(k === 'textContent') {
        el.textContent = ctxCloned.static[k]
        return
      }
  
      el.setAttribute(k, ctxCloned.static[k])
    })
  }

  if(ctxCloned.dynamic) {
    if(ctxCloned.type === 'logo') {
      ctxCloned.children[0].dynamic.width = ctxCloned.dynamic.width
      ctxCloned.children[2].dynamic.width = ctxCloned.dynamic.width
      ctxCloned.children[0].dynamic.height = ctxCloned.dynamic.height
      ctxCloned.children[2].dynamic.height = ctxCloned.dynamic.height

      ctxCloned.children[1].dynamic.transform = `translate(${ctxCloned.dynamic.width / 2},${ctxCloned.dynamic.height / 2})`
      ctxCloned.children[1].dynamic['font-size'] = ctxCloned.dynamic.height / 2
      if(ctxCloned.children[1].dynamic['font-size'] * 5 > ctxCloned.dynamic.width) {
        ctxCloned.children[1].dynamic['font-size'] = ctxCloned.dynamic.width / 5
      }

      delete ctxCloned.dynamic.width
      delete ctxCloned.dynamic.height
    }

    if(['title', 'subTitle', 'field'].includes(ctxCloned.type)) {
      const size = ctxCloned.dynamic.size
      const len = ctxCloned.children[1].children[0].static.textContent.length

      const fontFamily = ctxCloned.children[1].dynamic['font-family']
      if(!fontFamilys.find(({ value }) => value === fontFamily)) {
        console.log(1)
        ctx.children[1].dynamic['font-family'] = fontFamilys[0].value
        ctxCloned.children[1].dynamic['font-family'] = fontFamilys[0].value
      }

      if(ctx.children[0].dynamic.width === undefined) {
        ctx.children[0].dynamic.width = size * len + 14
      }

      ctx.children[0].dynamic.height = size + size / 3

      ctxCloned.children[0].dynamic.width = ctx.children[0].dynamic.width
      ctxCloned.children[0].dynamic.height = ctx.children[0].dynamic.height
      
      ctxCloned.children[1].dynamic['font-size'] = size
      
      const align = ctxCloned.dynamic.align
      if(align === 'center') {
        ctxCloned.children[1].dynamic['dominant-baseline'] = 'middle'
        ctxCloned.children[1].dynamic['text-anchor'] = 'middle'
        ctxCloned.children[1].dynamic.transform = `translate(${ctxCloned.children[0].dynamic.width / 2},${size / 2 + size / 4})`
        ctxCloned.children[1].children[0].dynamic.dy = ''
        ctxCloned.children[1].children[0].dynamic.x = ''
      } else if(align === 'left') {
        ctxCloned.children[1].dynamic['dominant-baseline'] = ''
        ctxCloned.children[1].dynamic['text-anchor'] = ''
        ctxCloned.children[1].dynamic.transform = `translate(7,0)`
        ctxCloned.children[1].children[0].dynamic.dy = size
        ctxCloned.children[1].children[0].dynamic.x = ''
      } else if(align === 'right') {
        ctxCloned.children[1].dynamic['dominant-baseline'] = ''
        ctxCloned.children[1].dynamic['text-anchor'] = 'end'
        ctxCloned.children[1].dynamic.transform = `translate(-7,0)`
        ctxCloned.children[1].children[0].dynamic.dy = size
        ctxCloned.children[1].children[0].dynamic.x = `${ctxCloned.children[0].dynamic.width / wrapperWidth * 100}%`
      }

      delete ctxCloned.dynamic.size
      delete ctxCloned.dynamic.align
    }

    Object.keys(ctxCloned.dynamic).forEach((k) => {
      if(k === 'rx') {
        let len = ctxCloned.dynamic.width > ctxCloned.dynamic.height ? ctxCloned.dynamic.width : ctxCloned.dynamic.height
        el.setAttribute(k, `${ctxCloned.dynamic[k] / 100 * len}`)
        return
      }
      el.setAttribute(k, ctxCloned.dynamic[k])
    })
  }

  if(ctxCloned.id) {
    el.setAttribute('id', ctxCloned.id)
  }

  if(ctxCloned.children) {
    ctxCloned.children.forEach((c) => {
      const cel = generateControl(c, wrapperWidth)
      el.append(cel)
    })
  }

  return el
}

export const reRenderDynamicAttrs = (control, node, wrapperWidth) => {
  const controlCloned = JSON.parse(JSON.stringify(control))
  if(controlCloned.dynamic) {
    if(controlCloned.type === 'logo') {
      controlCloned.children[0].dynamic.width = controlCloned.dynamic.width
      controlCloned.children[2].dynamic.width = controlCloned.dynamic.width
      controlCloned.children[0].dynamic.height = controlCloned.dynamic.height
      controlCloned.children[2].dynamic.height = controlCloned.dynamic.height

      controlCloned.children[1].dynamic.transform = `translate(${controlCloned.dynamic.width / 2},${controlCloned.dynamic.height / 2})`
      controlCloned.children[1].dynamic['font-size'] = controlCloned.dynamic.height / 2
      if(controlCloned.children[1].dynamic['font-size'] * 5 > controlCloned.dynamic.width) {
        controlCloned.children[1].dynamic['font-size'] = controlCloned.dynamic.width / 5
      }

      delete controlCloned.dynamic.width
      delete controlCloned.dynamic.height
    }

    if(['title', 'subTitle', 'field'].includes(controlCloned.type)) {
      const size = controlCloned.dynamic.size
      const len = controlCloned.children[1].children[0].static.textContent.length
      let minWidth = size * len + 14

      const fontFamily = controlCloned.children[1].dynamic['font-family']
      if(!fontFamilys.find(({ value }) => value === fontFamily)) {
        console.log(1)
        control.children[1].dynamic['font-family'] = fontFamilys[0].value
        controlCloned.children[1].dynamic['font-family'] = fontFamilys[0].value
      }

      if(control.children[0].dynamic.width < minWidth) {
        control.children[0].dynamic.width = minWidth
      }

      controlCloned.children[0].dynamic.height = size + size / 3
      
      controlCloned.children[1].dynamic['font-size'] = size
      
      const align = controlCloned.dynamic.align
      if(align === 'center') {
        controlCloned.children[1].dynamic['dominant-baseline'] = 'middle'
        controlCloned.children[1].dynamic['text-anchor'] = 'middle'
        controlCloned.children[1].dynamic.transform = `translate(${controlCloned.children[0].dynamic.width / 2},${size / 2 + size / 4})`
        controlCloned.children[1].children[0].dynamic.dy = ''
        controlCloned.children[1].children[0].dynamic.x = ''
      } else if(align === 'left') {
        controlCloned.children[1].dynamic['dominant-baseline'] = ''
        controlCloned.children[1].dynamic['text-anchor'] = ''
        controlCloned.children[1].dynamic.transform = `translate(7,0)`
        controlCloned.children[1].children[0].dynamic.dy = size
        controlCloned.children[1].children[0].dynamic.x = ''
      } else if(align === 'right') {
        controlCloned.children[1].dynamic['dominant-baseline'] = ''
        controlCloned.children[1].dynamic['text-anchor'] = 'end'
        controlCloned.children[1].dynamic.transform = `translate(-7,0)`
        controlCloned.children[1].children[0].dynamic.dy = size
        controlCloned.children[1].children[0].dynamic.x = `${controlCloned.children[0].dynamic.width / wrapperWidth * 100}%`
      }

      delete controlCloned.dynamic.size
      delete controlCloned.dynamic.align
    }

    Object.keys(controlCloned.dynamic).forEach((k) => {
      if(k === 'rx') {
        let len = controlCloned.dynamic.width > controlCloned.dynamic.height ? controlCloned.dynamic.width : controlCloned.dynamic.height
        node.setAttribute(k, `${controlCloned.dynamic[k] / 100 * len}`)
        return
      }
      node.setAttribute(k, controlCloned.dynamic[k])
    })
  }

  if(controlCloned.children) {
    controlCloned.children.forEach((c, i) => {
      reRenderDynamicAttrs(c, node.children[i], wrapperWidth)
    })
  }
}

export const getId = () => {
  const id = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFFGHIJKLMNOPQRSTUVWXYZ')
  return id()
}
