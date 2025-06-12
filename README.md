# Aether

## Layers

Each layer takes a `size`, `blendMode`, and `opacity`.

- Generators
  - Gradient
  - Pixel Pattern (array defined repeating pixel pattern)
  - Simple 3D Layer (three.js procedural mesh from API)
  - Static Noise (random noise field - greyscale)
- Media
  - Image Layer (load and display static image)
- Pixel
  - Blur (Canvas API based blur)
  - Posterize (uniform quantization with bucketing)
  - Threshold (chroma based, snap colors to black/white)
  - TODO: highlights/midtones/contrast adjustment
- Post Processing
  - TODO: Shape Dither (custom rendered shapes instead of pixels)

TODO: tint to map B/W to colors

## TODO

- Shape dither (custom shape designs)
- Abuse pattern dithers
- Blue Noise Dithering

- Animate and don't clear buffer
- Combine with some AfterEffects effects

## Later

- More Raymarching (links in browser)

https://www.shadertoy.com/view/MtV3W1

- UPSCALE in pipeline to apply more subtle effects while still keeping large pixels from origin
- https://www.instagram.com/p/DKeMfbMOlp7/

- Posterizer (maybe already covered by quantization effect)
- Sobel edge detection (do a study on this too for website)
- Kernels?
- Pixelate effect seems to have an error when used in the wrong order
- Bayer Dither: why is it in color, should it be B/W, should a toggle be aloud?
- Bayer Dither: Predownscale bayer dither then rescale?
- Bayer Dither: Can it be animated
- Bayer Dither: Zones of dither strength or type
- Ascii Dither: Threshold? Different character sets?
- More advanced dithering algo
- Load more advanced 3D scenes from Blender (etc, GLDB?) (can animations be played?)
- Video frame loader / playback
- Dither: other types
- JPEG destruction Algo
- Debug animation layer for parameter viz
- Bloom filter
- Final high resolution grain layer?

- How do flood fills work? https://x.com/hahajohnx

https://offscreencanvas.com/issues/advanced-ascii-rendering/
https://offscreencanvas.com/issues/webgl-ascii/
https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#:~:text=their%20sequential%20nature.-,Color%20Quantization,-So%20far%2C%20all
