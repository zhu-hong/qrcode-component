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

提供二维码成品的组件,具有数据的模版

<div style="width: 450px; height: 300px;"><div style="width: 100%; height: 100%;"><svg width="100%" height="100%" version="1.1" viewBox="0 0 450 300" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" xmlns:xlink="[http://www.w3.org/1999/xlink](http://www.w3.org/1999/xlink)"><rect x="0" y="0" data-type="bg" fill="#FFFFFF" width="100%" height="100%"></rect><g><rect data-type="rect" x="0" y="0" width="452" height="178" fill="#2B2A6F" rx="0" id="NrvFNMSHQIXrZQwRZyzFp" transform="translate(-1,123)"></rect><g x="0" y="0" id="pYlJvtikXjmDcjxKAFJMF" transform="translate(18,25)"><image href="[https://pinia.vuejs.org/logo.svg](https://pinia.vuejs.org/logo.svg)" data-type="logo" width="73" height="74"></image></g><g id="bKtpZTaiHqLXOwKYFyiAL" transform="translate(105,25)"><text x="0" y="0" fill="#000000" font-weight="bold" font-style="normal" font-family="-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif" font-size="30" dominant-baseline="" text-anchor="" transform="translate(7,0)"><tspan data-type="title" dy="30" x="0" data-max="37" data-len="6" y="0">CCCCCCCCCCCCC</tspan><tspan data-type="title-placeholder" data-max="37" fill="transparent" x="0" y="0" dy="30">十</tspan></text></g><g id="oNsvnrWngMOuaMUDUFxKA" transform="translate(103,76)"><text x="0" y="0" fill="#67717C" font-weight="normal" font-style="normal" font-family="-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif" font-size="20" dominant-baseline="" text-anchor="" transform="translate(7,0)"><tspan data-type="subTitle" dy="20" x="0" data-max="54" data-len="12" y="0">北包包包包包包包包包包...</tspan><tspan data-type="subTitle-placeholder" data-max="54" fill="transparent" x="0" y="0" dy="20">十</tspan></text></g><g id="FbMUWqKWKmWLEhxBGQOCQ" transform="translate(17,139)"><text x="0" y="0" fill="#FFFFFF" font-weight="normal" font-style="normal" font-family="-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif" font-size="22" dominant-baseline="" text-anchor="" transform="translate(7,0)"><tspan data-type="field" dy="22" x="0" data-count="4" data-max="53" data-len="11" y="0">🥶🥶🥶🥶🥶🥶🥶🥶🥶🥶</tspan><tspan data-type="field-placeholder4" data-max="53" fill="transparent" x="0" y="0" dy="22">十</tspan></text></g><g id="dBBqgYhTfTJfdmPRncOQy" transform="translate(16,180)"><text x="0" y="0" fill="#FFFFFF" font-weight="normal" font-style="normal" font-family="-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif" font-size="22" dominant-baseline="" text-anchor="" transform="translate(7,0)"><tspan data-type="field" dy="22" x="0" data-count="4" data-max="53" data-len="11" y="0">🫠🫠🫠🫠🫠🫠🫠🫠🫠🫠</tspan><tspan data-type="field-placeholder4" data-max="53" fill="transparent" x="0" y="0" dy="22">十</tspan></text></g><g id="FeRKXNEKxvGYtseDMzupj" transform="translate(17,220)"><text x="0" y="0" fill="#FFFFFF" font-weight="normal" font-style="normal" font-family="-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif" font-size="22" dominant-baseline="" text-anchor="" transform="translate(7,0)"><tspan data-type="field" dy="22" x="0" data-count="4" data-max="53" data-len="11" y="0">🥲🥲🥲🥲🥲🥲🥲🥲🥲🥲</tspan><tspan data-type="field-placeholder4" data-max="53" fill="transparent" x="0" y="0" dy="22">十</tspan></text></g><g id="VtozJtFoYMzEhlzZyanMG" transform="translate(17,260)"><text x="0" y="0" fill="#FFFFFF" font-weight="normal" font-style="normal" font-family="-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif" font-size="22" dominant-baseline="" text-anchor="" transform="translate(7,0)"><tspan data-type="field" dy="22" x="0" data-count="4" data-max="53" data-len="11" y="0">🥸🥸🥸🥸🥸🥸🥸🥸🥸🥸</tspan><tspan data-type="field-placeholder4" data-max="53" fill="transparent" x="0" y="0" dy="22">十</tspan></text></g><rect data-type="rect" x="0" y="0" width="139" height="139" fill="#FFFFFF" rx="6.95" id="AjLWOHQWBaqwLiicqwRRc" transform="translate(289,145)"></rect><image x="0" y="0" data-type="qr" href="data:image/png;base64,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" width="129" height="129" id="yCOtjgjeFktovarkPtdhn" transform="translate(294,150)"></image></g></svg></div><div value="[https://dl-mobileres.effio.cn/yiyunapp/?qrid=4XvmuiUeC2b](https://dl-mobileres.effio.cn/yiyunapp/?qrid=4XvmuiUeC2b)" level="L" background="#fff" foreground="#000" class="" style="display: none;"><canvas height="200" width="200" style="width: 200px; height: 200px;"></canvas></div></div>

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