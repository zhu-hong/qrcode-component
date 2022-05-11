<script>
export default {
  data() {
    return {
      preControls: [{"type":"rect","tag":"rect","static":{"data-type":"rect","x":0,"y":0},"dynamic":{"width":450,"height":450,"fill":"#2D65B7","rx":50},"id":"rKUeReeuItuQfMLjQAACA","transform":{"x":0,"y":-1}},{"type":"rect","tag":"rect","static":{"data-type":"rect","x":0,"y":0},"dynamic":{"width":406,"height":406,"fill":"#FFFFFF","rx":50},"id":"pNjstJMTRUDXWfOtSNjYf","transform":{"x":21,"y":22}},{"type":"rect","tag":"rect","static":{"data-type":"rect","x":0,"y":0},"dynamic":{"width":347,"height":347,"fill":"#148B64","rx":50},"id":"cfskBEqmDFXrMizFmaOMj","transform":{"x":49,"y":49}},{"type":"rect","tag":"rect","static":{"data-type":"rect","x":0,"y":0},"dynamic":{"width":291,"height":291,"fill":"#FFFFFF","rx":50},"id":"sHOOQtKBFfCEUySrpdLRO","transform":{"x":77,"y":76}},{"type":"qr","tag":"image","static":{"x":0,"y":0,"data-type":"qr","href":"data:image/svg+xml;utf8,%3Csvg width='100' height='100' shape-rendering='crispEdges' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21' class='qrcode'%3E%3Cpath fill='%23ffffff' d='M0,0 h21v21H0z'%3E%3C/path%3E%3Cpath fill='%23000000' d='M0 0h7v1H0zM8 0h5v1H8zM14,0 h7v1H14zM0 1h1v1H0zM6 1h1v1H6zM8 1h2v1H8zM11 1h2v1H11zM14 1h1v1H14zM20,1 h1v1H20zM0 2h1v1H0zM2 2h3v1H2zM6 2h1v1H6zM9 2h3v1H9zM14 2h1v1H14zM16 2h3v1H16zM20,2 h1v1H20zM0 3h1v1H0zM2 3h3v1H2zM6 3h1v1H6zM9 3h1v1H9zM11 3h2v1H11zM14 3h1v1H14zM16 3h3v1H16zM20,3 h1v1H20zM0 4h1v1H0zM2 4h3v1H2zM6 4h1v1H6zM8 4h1v1H8zM12 4h1v1H12zM14 4h1v1H14zM16 4h3v1H16zM20,4 h1v1H20zM0 5h1v1H0zM6 5h1v1H6zM8 5h1v1H8zM10 5h1v1H10zM14 5h1v1H14zM20,5 h1v1H20zM0 6h7v1H0zM8 6h1v1H8zM10 6h1v1H10zM12 6h1v1H12zM14,6 h7v1H14zM8 7h4v1H8zM0 8h3v1H0zM5 8h2v1H5zM8 8h9v1H8zM19,8 h2v1H19zM0 9h1v1H0zM8 9h2v1H8zM15 9h5v1H15zM0 10h2v1H0zM3 10h2v1H3zM6 10h2v1H6zM9 10h2v1H9zM15 10h1v1H15zM19 10h1v1H19zM2 11h3v1H2zM7 11h2v1H7zM12 11h1v1H12zM15 11h2v1H15zM18 11h1v1H18zM0 12h2v1H0zM6 12h5v1H6zM13 12h2v1H13zM16,12 h5v1H16zM8 13h2v1H8zM11 13h1v1H11zM13 13h2v1H13zM17 13h1v1H17zM19,13 h2v1H19zM0 14h7v1H0zM11 14h3v1H11zM15 14h1v1H15zM0 15h1v1H0zM6 15h1v1H6zM8 15h2v1H8zM11 15h1v1H11zM13 15h4v1H13zM18 15h1v1H18zM0 16h1v1H0zM2 16h3v1H2zM6 16h1v1H6zM9 16h6v1H9zM17 16h1v1H17zM19 16h1v1H19zM0 17h1v1H0zM2 17h3v1H2zM6 17h1v1H6zM15 17h1v1H15zM18 17h1v1H18zM0 18h1v1H0zM2 18h3v1H2zM6 18h1v1H6zM8 18h3v1H8zM14 18h2v1H14zM17,18 h4v1H17zM0 19h1v1H0zM6 19h1v1H6zM8 19h1v1H8zM12 19h1v1H12zM17 19h2v1H17zM0 20h7v1H0zM8 20h3v1H8zM14 20h3v1H14zM20,20 h1v1H20z'%3E%3C/path%3E%3C/svg%3E"},"dynamic":{"width":198,"height":198},"id":"EEpISKKoECJxzWMaLAoPD","transform":{"x":124,"y":122}}],
      templateName: '',
    }
  },
  mounted() {
    // const templateEditor = this.$refs.templateEditor
    // const eventStack = [
    //   [templateEditor.setTemplateSize, [350, 200]],
    //   [templateEditor.changeColor, '#12aa9c'],
    //   [templateEditor.undo],
    //   [templateEditor.unUndo],
    //   [templateEditor.fitScale],
    //   [templateEditor.modifyScale, -10],
    //   [templateEditor.modifyScale, 20],
    //   [templateEditor.modifyScale, -10],
    //   [templateEditor.fitScale],
    //   [templateEditor.addControl, 'qr'],
    //   [templateEditor.addControl, 'title', [50,50]],
    //   [templateEditor.changeColor, '#fb7185'],
    // ]

    // eventStack.forEach((e, index) => {
    //   const [func, ...rest] = e
    //   setTimeout(func, (index + 1) * 1000, ...rest)
    // })
  },
}
</script>

<template>
  <QrCodeTemplateEditor ref="templateEditor"
    :fonts="[{ name: 'Fira Code', value: 'Fira Code' }, { name: 'JetBrains Mono', value: 'JetBrains Mono' }]"
    :colors="['#eea2a4', '#ee3f4d', '#12aa9c', '#57c3c2', '#ef6f48']"
    :preControls="preControls"
  />
</template>
