# 亦云二维码组件

## 使用

```bash
npm install yiyun-qrcode
```

```js
import YiYunQrCode from 'yiyun-qrcode'
// import 'yiyun-qrcode/style.css' /** 使用TemplateEditor组件需要引入的css文件 **/

Vue.use(YiYunQrCode)

// 单独使用某个组件如QrCodeBinder
import { QrCodeBinder } from 'yiyun-qrcode'

Vue.use(QrCodeBinder)
```

## QrCodeContainer

展示一个使用了模版的二维码

> 宽高直接在组件上设置样式即可,必须与模版默认宽高同比例,不然可能出现显示异常
> 

### 例

```js
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
```

```html
<QrCodeContainer
  :qrInfo="qrInfo"
  style="{ 'width': `${qrInfo.model.width}mm`, 'height': `${qrInfo.model.height}mm` }"
/>
```

### 参数

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| qrInfo | - | 是 | 通过二维码详情接口获取到的数据 |

## QrCodeTemplate

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
```

```html
<QrCodeTemplate :tplInfo="tplInfo" style="height:250px;" />
```

### 参数

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| tplInfo | - | 是 | 通过模版详情接口获取到的数据 |

## QrCodeBinder

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
```

```html
<QrCodeBinder
	:style="{ 'width': `${tplData.width}mm`, 'height': `${tplData.height}mm` }"
	:tplInfo="tplInfo" :tplData="tplData" ref="QrCodeBinder"
	focusColor="rgba(251, 113, 133, 1)"
/>
```

### 参数

| 名称 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| tplInfo | - | 是 | - | 通过模版详情接口获取到的数据 |
| tplData | - | 是 | - | 绑定到模版的数据 |
| focusColor | 色值 | 否 | #fbbf24 | 聚焦框颜色 |

### 方法

| 名称 | 描述 | 参数 |
| --- | --- | --- |
| showFocus | 显示聚焦框 | type: title/subTitle/field, index: 字段索引, text?: 提示文字 |
| hiddenFocus | 隐藏聚焦框 | - |