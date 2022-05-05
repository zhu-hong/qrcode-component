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

