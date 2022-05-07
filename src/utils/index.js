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
