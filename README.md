# 亦云二维码组件

[doc](https://peppermint-fairy-a84.notion.site/d520127ac6174d13b4aafa7a8e420089)

[example](https://qrcode-playground.vercel.app/)

[git](http://gitlab.wingoht.com/TSESCloud/Front/yiyun-qrcode/-/tree/dev_zh)

```bash
npm install yiyun-qrcode
```

```jsx
import YiYunQrCode from 'yiyun-qrcode'
// import 'yiyun-qrcode/style.css' /** 使用TemplateEditor组件需要引入的css文件 **/

Vue.use(YiYunQrCode)

// 单独使用某个组件如QrCodeBinder
import { QrCodeBinder } from 'yiyun-qrcode'

Vue.use(QrCodeBinder)
```

## `QrCodeContainer`

展示一个使用了模版的二维码

> 宽高直接在组件上设置样式即可,必须与模版默认宽高同比例,不然可能出现显示异常
> 

### 例

```jsx
const qrInfo = {
  "id": "4XyE7bjFLUq", // 二维码ID
  "model": {
    "config": {
      "id": "color5",
      "svg": "<svg...", // 模版字符串
      "defaultColor": "#254569", // 模版默认背景色值
      "defaultWidth": 120, // 模版默认宽
      "defaultHeight": 80, // 模版默认高
      "hasLogo": true, // 模版是否有logo
      "hasTitle": true, // 模版是否有标题
      "hasSubTitle": true, // 模版是否有副标题
      "tagCount": 4, // 模版字段数量
      "type": 2, // 0 黑白模版    1 彩色模版    2 自定义模版
    },
    "width": 120,
    "height": 80,
    "backgroudColor": "#254569",
    "logo": "https://pinia.vuejs.org/logo.svg",
    "title": "🥸🥸🥸🥸",
    "subTitle": "",
    "tagFields": [
      "🥸🥶🫠🥲🥸🥶🫠🥲🥸🥶",
      "🥱🥱🥱🥱",
      "🥱",
      "卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡卡",
    ],
  },
}

<QrCodeContainer
  :qrInfo="qrInfo"
  style="{ 'width': `${qrInfo.model.width}mm`, 'height': `${qrInfo.model.height}mm` }"
/>
```

### 参数

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| qrInfo | - | 是 | 通过二维码详情接口获取到的数据 |

## `QrCodeTemplate`

展示模版缩略图

### 例

```jsx
const tplInfo = {
  "id": "4XxixG511AP",
  "name": "标签981011",
  "svg": "<svg...",
  "svgDemo": "https://dl-edisk.effio.cn/ptest/1522378481458163712.svg",
  "defaultColor": "#FFFFFF",
  "defaultWidth": 150,
  "defaultHeight": 100,
  "hasLogo": true,
  "hasTitle": true,
  "hasSubTitle": true,
  "tagCount": 4,
  "type": 2,
}

<QrCodeTemplate :tplInfo="tplInfo" style="height:250px;" />
```

### 参数

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| tplInfo | - | 是 | 模版详情 |

## `QrCodeBinder`

根据给的模版信息与模版数据实时展示带有模版的二维码

> 宽高直接在组件上设置样式即可,必须与模版默认宽高同比例,不然可能出现显示异常
> 

### 例

```jsx
const tplInfo = {
  "id": "4XxixG511AP",
  "svg": "<svg...",
  "defaultColor": "#FFFFFF",
  "defaultWidth": 150,
  "defaultHeight": 100,
  "hasLogo": true,
  "hasTitle": true,
  "hasSubTitle": true,
  "tagCount": 4,
	"type": 2,
}

const tplData = {
  "id": "4XvmuiUeC2b", // 二维码ID
  "width": 150, // 模版宽(自定义模版无效)
  "height": 100, // 模版高(自定义模版无效)
  "backgroudColor": "#FFFFFF", // 模版背景色
  "logo": "https://pinia.vuejs.org/logo.svg",
  "title": "KKAOKAO",
  "subTitle": "北包包包包包包包包包包包包包包包包包包包包包包包包",
  "tagFields": [ // 字段集合
    "🥶🫠🥲🥸🥶🫠🥲🥲",
    "🫠🥲🥸🥶🫠🥲🥸🥶",
    "🫠🥲🥸🥶🫠🥲🥸🥶",
    "🥲🥸🥶🫠🥲🥸🥶🫠",
  ],
}

<QrCodeBinder
	:style="{ 'width': `${tplData.width}mm`, 'height': `${tplData.height}mm` }"
	:tplInfo="tplInfo" :tplData="tplData" ref="QrCodeBinder"
	focusColor="rgba(251, 113, 133, 1)"
/>
```

### 参数

| 名称 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| tplInfo | - | 是 | - | 模版详情 |
| tplData | - | 是 | - | 绑定到模版的数据 |
| focusColor | 色值 | 否 | #fbbf24 | 聚焦框颜色 |

### 方法

| 名称 | 描述 | 参数 |
| --- | --- | --- |
| showFocus | 显示聚焦框 | type: title/subTitle/field, index: 字段索引, text?: 提示文字 |
| hiddenFocus | 隐藏聚焦框 | - |

## `QrCodeTemplateEditor`

创建新的自定义模版或者编辑已有自定义模版,组件推荐最小尺寸(宽:`1090px`, 高:`810px`)

### 例

```jsx
const preTplInfo = {
	id: '',
  name: '',
  defaultColor: '#FFFFFF',
  defaultWidth: 150,
  defaultHeight: 100,
}
const preControls = [{"type":"rect","tag":"rect": "..."}]
const templateName = '标签123'

<QrCodeTemplateEditor ref="templateEditor" style="width:100%;height:100%;" primaryColor="#fb7185"
  :fonts="[{ name: 'Fira Code', value: 'Fira Code' }, { name: 'JetBrains Mono', value: 'JetBrains Mono' }]"
  :colors="['#eea2a4', '#ee3f4d', '#12aa9c', '#57c3c2', '#ef6f48', '#9b1e64']" :hotKey="true"
	:fieldMaxCount="5" :rectMaxCount="5"
  :preControls="preControls" :showHotKeyBoard="true" :templateName.sync="templateName" :preTplInfo="preTplInfo"
/>
```

### 参数

| 名称 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| primaryColor | 色值 | 否 | #0B58D2 | 组件主题色 |
| fonts | []{ name: String, value: String } | 否 | 四种字体 | 通过参数添加自己的字体 |
| colors | []String | 否 | 16种颜色 | 通过参数添加自己的颜色 |
| preTplInfo | - | 否 | { id: '', name: '', defaultColor: ‘#FFFFFF, defaultWidth: 150, defaultHeight: 100 } | 模版详情,用于编辑已有模版,不传则为新建模版 |
| preControls | []Control | 否 | [] | 通过获取模版控件信息接口得到的数据(反序列化再使用) |
| showHotKeyBoard | Boolean | 否 | true | 显示快捷键面板 |
| showControlLib | Boolean | 否 | true | 显示控件库 |
| showAttrsBoard | Boolean | 否 | true | 显示控件属性面板 |
| hotKey | Boolean | 否 | true | 使用内置快捷键 |
| fieldMaxCount | Number | 否 | 8 | 字段控件最大数量 |
| rectMaxCount | Number | 否 | 10 | 矩形控件最大数量 |
| lineMaxCount | Number | 否 | 3 | 直线控件最大数量 |

### 方法

| 名称 | 参数 | 返回值 | 描述 |
| --- | --- | --- | --- |
| undo | - | - | 撤销 |
| unUndo | - | - | 反撤销 |
| cloneControl | - | - | 复制当前控件 |
| pasteControl | - | - | 粘贴复制的控件 |
| incrementScale | Number | - | 画布缩放 |
| fitScale | - | - | 画布缩放至一个合适的大小 |
| addControl | type(控件类型):‘title’/‘subTitle’/‘field’/‘qr’/‘logo’/‘rect’/‘line’, position?(相对于画布左上角的偏移量): [x:Number, y:Nnmber] | - | 添加一个控件 |
| toEdge | type: ‘top’/‘bottom’ | - | 将当前控件移至画布顶部或底部 |
| moveLevel | type: ‘up’/‘dowm’ | - | 将当前控件下或上移 |
| removeControl | - | - | 删除当前控件 |
| setTemplateSize | [width: 20 ≤ Number ≤ 250, height: 20 ≤ Number ≤ 250] | - | 设置模版大小 |
| setControlColor | Color(色值) | - | 设置当前控件的颜色 |
| toggleBold | - | - | 切换文字是否粗体 |
| toggleItalic | - | - | 切换文字是否斜体 |
| setTextAlign | type: ‘left’/‘center’/‘right’ | - | 设置当前文字控件的对齐方式 |
| setFontFamily | font: String | - | 设置当前文字控件的字体 |
| setFontSize | size: 12 ≤ Number ≤ 72  |  | 设置当前文字控件的字体大小 |
| setRectRx | rx: 0 ≤ Number ≤ 50 | - | 设置当前矩形控件的圆角 |
| getTplDemoBlob | - | false/Blob | 获取模版缩略图的Blob对象,模版不符合要求时返回false(未添加二维码控件) |
| generateUsefulData | - | - | 生成完整的二维码模版信息,模版不符合要求时返回false(未添加二维码控件或二维码名称为空),数据格式见下方 |

```tsx
interface IQrCodeTemplate {
  id?: String, // 二维码ID,如未传则返回的数据不含有这项
  name: String,
  svg: String, // 模版字符串
  width: Number,
  height: Number,
  defaultColor: String,
  hasLogo: Boolean,
  hasTitle: Boolean,
  hasSubTitle: Boolean,
  tagCount: Number,
  controls: JSON.stringify([]Control), // 二维码控件信息
}
```

### 事件

| 名称 | 触发 |
| --- | --- |
| addControlFail | 控件添加失败 |
| noQr | 生成二维码模版信息时未添加二维码控件 |
| noName | 生成二维码模版信息时二维码名称为空 |