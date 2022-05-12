# 亦云二维码组件

## 使用

```bash
npm install yiyun-qrcode
```

```jsx
import YiYunQrCode from 'yiyun-qrcode'
// import 'yiyun-qrcode/style.css' /** 使用TemplateEditor组件需要引入css文件 **/

Vue.use(YiYunQrCode)

// 单独使用某个组件如QrCodeBinder
import { QrCodeBinder } from 'yiyun-qrcode'

Vue.use(QrCodeBinder)
```

## QrCodeContainer

### 事例

```js
const qrInfo = {
	"id": "4XyE7bjFLUq",
	"model": {
	  "config": {
	     "id": "color5",
	     "svg": "<svg...",
	     "defaultColor": "#254569",
	     "defaultWidth": 120,
	     "defaultHeight": 80,
	     "hasLogo": true,
	     "hasTitle": true,
	     "hasSubTitle": true,
	     "tagCount": 4,
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

| 名称 | 类型 | 是否必填 | 描述 |
| --- | --- | --- | --- |
| qrInfo | 通过二维码详情接口获取到的数据 | 是 | 生成二维码需要的所有数据 |% 