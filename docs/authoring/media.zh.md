---
title: 媒体
path: /authoring/media/
icon: image
order: 4
---

# 媒体

## 内部图片 [#internal-images]

引用文档目录中的图片：

```md
![Example image](./images/example.jpg)
```

渲染效果：

![示例图片](./images/example.jpg)

## 外部图片 [#external-images]

引用外部 URL 中的图片：

```md
![Placeholder](https://picsum.photos/seed/livemark/800/300)
```

渲染效果：

![占位图](https://picsum.photos/seed/livemark/800/300)

## Base64 图片 [#base64-images]

使用 data URI 直接嵌入小尺寸图片：

```md
![banner](data:image/png;base64,iVBORw0KGgo...)
```

渲染效果：

![banner](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABQCAIAAADTD63nAAABU0lEQVR4nO3csU3DUBRAUUCIGVJlHLcwAVV2YIbsQJUJUmccJCRmoKKgthOR3IDNOe138WxdveZLvn0c3m/g0u5+ewCWSVgkhEVCWCSERUJYJIRFQlgkhEXifvr47eP1OnMwR+vVZuzIxiJxZGN9e3p+qedgXva77fQDNhYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGROOkSeswwPFxqjr/jcPgcO1rk+06b+BrTbCwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIicdZvjH78j5uZ+m/vew4bi4SwSAiLhLBICIuEsEgIi4SwSAiLhLBICIuEsEicdAm9323rOVgYG4vEkY21Xm2uMwcLY2OREBYJYZEQFglhkRAWCWGREBaJL1tnFXf+b+eSAAAAAElFTkSuQmCC)

## 随主题切换的图片 [#themed-images]

使用 `#light` 和 `#dark` 哈希后缀，为浅色模式和深色模式显示不同的图片：

```md
![Light theme](https://picsum.photos/seed/sunshine/800/200#light)
![Dark theme](https://picsum.photos/seed/dark/800/200#dark)
```

渲染效果（切换主题即可看到变化）：

![浅色主题](https://picsum.photos/seed/sunshine/800/200#light)
![深色主题](https://picsum.photos/seed/dark/800/200#dark)

`#light` 图片在深色模式下隐藏，`#dark` 图片在浅色模式下隐藏。两者搭配使用，即可实现无缝的主题切换。

## 图片缩放 [#image-zooming]

文章中的所有图片都可以缩放：点击任意图片即可将其放大到完整尺寸。内部图片、外部图片和 Base64 图片均适用。

## 视频块 [#video-blocks]

使用带 `type` 属性的 `::video` 指令嵌入视频：

```md
::video{type="youtube" id="dQw4w9WgXcQ"}
```

渲染效果：

::video{type="youtube" id="dQw4w9WgXcQ"}

## 音频块 [#audio-blocks]

使用带 `type` 属性的 `::audio` 指令嵌入音频：

```md
::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}
```

渲染效果：

::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}
