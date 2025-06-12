# Aether

## Layers

Each layer takes a `size`, `blendMode`, and `opacity`.

- Generators
  - Gradient
  - Pixel Pattern (array defined repeating pixel pattern)
  - Popcorn Noise (random noise field - greyscale)
  - Simple 3D Layer (three.js procedural mesh from API)
- Media
  - Image Layer (load and display static image)
- Pixel
  - Blur (Canvas API based blur)
  - Pixelate
  - Posterize (uniform quantization with bucketing)
  - Threshold (chroma based, snap colors to black/white)
  - TODO: highlights/midtones/contrast adjustment
- Post Processing
  - TODO: Shape Dither (custom rendered shapes instead of pixels)

More Dithering:

- Blue Noise Dithering patterns (make more pattenrs!)
- Shape dither (custom shape designs)
- https://www.shadertoy.com/view/MtV3W1
- UPSCALE in pipeline to apply more subtle effects while still keeping large pixels from origin
 . - https://www.instagram.com/p/DKeMfbMOlp7/

- Sobel edge detection (do a study on this too for website)
- Basic Particle Systems

## Later

https://public.work/mythical%20creatures

TODO: tint to map B/W to colors
- More Raymarching (links in browser)
- Kernels?
- Bayer Dither: Can it be animated
- Bayer Dither: Zones of dither strength or type
- Ascii Dither: Threshold? Different character sets?
- More advanced dithering algo
- Load more advanced 3D scenes from Blender (etc, GLDB?) (can animations be played?)
- Video frame loader / playback
- JPEG destruction Algo
- Debug animation layer for parameter viz
- Bloom filter
- Final high resolution grain layer?

- How do flood fills work? https://x.com/hahajohnx

https://offscreencanvas.com/issues/advanced-ascii-rendering/
https://offscreencanvas.com/issues/webgl-ascii/
https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#:~:text=their%20sequential%20nature.-,Color%20Quantization,-So%20far%2C%20all
