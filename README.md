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

组件展示一个使用了模版的二维码

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

> 宽高直接在组件上设置样式即可,必须与模版默认宽高同比例,否则可能出现显示异常
> 

## QrCodeTemplate% 