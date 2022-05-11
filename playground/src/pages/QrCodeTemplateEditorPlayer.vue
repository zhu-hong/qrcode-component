<script>
export default {
  mounted() {
    const templateEditor = this.$refs.templateEditor
    const eventStack = [
      [templateEditor.setTemplateSize, [350, 200]],
      [templateEditor.changeColor, '#12aa9c'],
      [templateEditor.undo],
      [templateEditor.unUndo],
      [templateEditor.fitScale],
      [templateEditor.modifyScale, -10],
      [templateEditor.modifyScale, 20],
      [templateEditor.modifyScale, -10],
      [templateEditor.fitScale],
      [templateEditor.addControl, 'qr'],
      [templateEditor.addControl, 'title', [50,50]],
      [templateEditor.changeColor, '#fb7185'],
    ]

    eventStack.forEach((e, index) => {
      const [func, ...rest] = e
      setTimeout(func, (index + 1) * 1000, ...rest)
    })
  },
}
</script>

<template>
  <QrCodeTemplateEditor ref="templateEditor"
    primaryColor="#fb7185"
    :fonts="[{ name: 'Fira Code', value: 'Fira Code' }, { name: 'JetBrains Mono', value: 'JetBrains Mono' }]"
    :colors="['#eea2a4', '#ee3f4d', '#12aa9c', '#57c3c2', '#ef6f48']"
  />
</template>
