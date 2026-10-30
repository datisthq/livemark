---
title: Multimedia
path: /authoring/media/
icon: image
order: 4
---

# Multimedia

## Imágenes internas {#internal-images}

Referencia imágenes de tu directorio de documentación:

```md
![Example image](./images/example.jpg)
```

Se renderiza así:

![Imagen de ejemplo](./images/example.jpg)

## Imágenes externas {#external-images}

Referencia imágenes desde URL externas:

```md
![Placeholder](https://picsum.photos/seed/livemark/800/300)
```

Se renderiza así:

![Imagen de relleno](https://picsum.photos/seed/livemark/800/300)

## Imágenes en Base64 {#base64-images}

Inserta imágenes pequeñas directamente con data URI:

```md
![banner](data:image/png;base64,iVBORw0KGgo...)
```

Se renderiza así:

![banner](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABQCAIAAADTD63nAAABU0lEQVR4nO3csU3DUBRAUUCIGVJlHLcwAVV2YIbsQJUJUmccJCRmoKKgthOR3IDNOe138WxdveZLvn0c3m/g0u5+ewCWSVgkhEVCWCSERUJYJIRFQlgkhEXifvr47eP1OnMwR+vVZuzIxiJxZGN9e3p+qedgXva77fQDNhYJYZEQFglhkRAWCWGREBYJYZEQFglhkRAWCWGROOkSeswwPFxqjr/jcPgcO1rk+06b+BrTbCwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIiISwSwiIhLBLCIiEsEsIicdZvjH78j5uZ+m/vew4bi4SwSAiLhLBICIuEsEgIi4SwSAiLhLBICIuEsEicdAm9323rOVgYG4vEkY21Xm2uMwcLY2OREBYJYZEQFglhkRAWCWGREBaJL1tnFXf+b+eSAAAAAElFTkSuQmCC)

## Imágenes según el tema {#themed-images}

Muestra imágenes distintas para el modo claro y el oscuro con los sufijos de hash `#light` y `#dark`:

```md
![Light theme](https://picsum.photos/seed/sunshine/800/200#light)
![Dark theme](https://picsum.photos/seed/dark/800/200#dark)
```

Se renderiza así (cambia el tema para ver el cambio):

![Tema claro](https://picsum.photos/seed/sunshine/800/200#light)
![Tema oscuro](https://picsum.photos/seed/dark/800/200#dark)

La imagen `#light` se oculta en modo oscuro y la imagen `#dark` se oculta en modo claro. Usa ambas juntas para un cambio de tema sin cortes.

## Ampliación de imágenes {#image-zooming}

Todas las imágenes de los artículos se pueden ampliar: haz clic en cualquier imagen para verla a tamaño completo. Funciona con imágenes internas, externas y en Base64.

## Bloques de vídeo {#video-blocks}

Inserta vídeos con la directiva `::video` y un atributo `type`:

```md
::video{type="youtube" id="dQw4w9WgXcQ"}
```

Se renderiza así:

::video{type="youtube" id="dQw4w9WgXcQ"}

## Bloques de audio {#audio-blocks}

Inserta audio con la directiva `::audio` y un atributo `type`:

```md
::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}
```

Se renderiza así:

::audio{type="soundcloud" url="https://soundcloud.com/flume/never-be-like-you-feat-kai"}
