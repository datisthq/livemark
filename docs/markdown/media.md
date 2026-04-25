---
title: Media
path: /markdown/media/
icon: image
order: 4
---

# Media

## Internal Images

Reference images from your docs directory:

```md
![Example image](./images/example.jpg)
```

Renders as:

![Example image](./images/example.jpg)

## External Images

Reference images from external URLs:

```md
![Placeholder](https://picsum.photos/seed/livemark/800/300)
```

Renders as:

![Placeholder](https://picsum.photos/seed/livemark/800/300)

## Base64 Images

Embed small images directly using data URIs:

```md
![banner](data:image/png;base64,iVBORw0KGgo...)
```

Renders as:

![banner](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABQCAIAAADTD63nAAABU0lEQVR4nO3csU3DUBRAUUCIGVJlHLcwAVV2YIbsQJUJUmccJCRmoKKgthOR3IDNOe138WxdveZLvn0c3m/g0u5+ewCWSVgkhEVCWCSERUJYJIRFQlgkhEXifvr47eP1OnMwR+vVZuzIxiJxZGN9e3p+qedgXva77fQDNhYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGROOkSeswwPFxqjr/jcPgcO1rk+06b+BrTbCwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIicdZvjH78j5uZ+m/vew4bi4SwSAiLhLBICIuEsEgIi4SwSAiLhLBICIuEsEicdAm9323rOVgYG4vEkY21Xm2uMwcLY2OREBYJYZEQFglhkRAWCWGREBaJL1tnFXf+b+eSAAAAAElFTkSuQmCC)

## Themed Images

Show different images for light and dark mode using `#light` and `#dark` hash suffixes:

```md
![Light theme](https://picsum.photos/seed/sunshine/800/200#light)
![Dark theme](https://picsum.photos/seed/dark/800/200#dark)
```

Renders as (toggle theme to see the switch):

![Light theme](https://picsum.photos/seed/sunshine/800/200#light)
![Dark theme](https://picsum.photos/seed/dark/800/200#dark)

The `#light` image is hidden in dark mode, and the `#dark` image is hidden in light mode. Use both together for seamless theme switching.

## Image Zooming

All images in articles are zoomable — click any image to expand it to full size. This works with internal, external, and base64 images.

## Video Blocks

Embed videos using the `::video` directive with a `type` attribute:

```md
::video{type="youtube" id="dQw4w9WgXcQ"}
```

Renders as:

::video{type="youtube" id="dQw4w9WgXcQ"}

## Audio Blocks

Embed audio using the `::audio` directive with a `type` attribute:

```md
::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}
```

Renders as:

::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}
