# Aether

## Layers

Each layer takes a `size`, `blendMode`, and `opacity`.

- Generators
  - Fragment Shader (loadable GLSL pixel shader)
  - Gradient
  - Particles (particle system)
  - Pixel Pattern (array defined repeating pixel pattern)
  - Popcorn Noise (random noise field - greyscale)
  - Simple 3D Layer (three.js procedural mesh from API)
  - Text
- Media
  - Image Layer (load and display static image)
- Pixel
  - Adjustments (brightness, contrast, saturation)
  - Blur (Canvas API based blur)
  - Invert
  - Pixelate
  - Posterize (uniform quantization with bucketing)
  - Threshold (chroma based, snap colors to black/white)
  - Vignette
- Post Processing
  - CGA Dither (4-color palette Bayer dither)
  - Receipt (simplified low-resolution output)
  - Shape Dither (custom rendered shapes instead of pixels)
  - Waves (rutt-etra style wave rendering from sampled canvas)

Chromatic Zoom Shader

RGB Shift
https://github.com/pixiteapps/Spool/blob/develop/Source/Filters/Metal%20Kernels/RGBShift.metal

- UPSCALE in pipeline to apply more subtle effects while still keeping large pixels from origin
 . - https://www.instagram.com/p/DKeMfbMOlp7/

Feedback!

## Later

  More Dithering:
- Blue Noise Dithering patterns (make more pattenrs!)
- https://www.shadertoy.com/view/MtV3W1

LUT applyer

- Sobel edge detection (do a study on this too for website)
Solarize: https://editor.isf.video/shaders/5e7a7fc97c113618206de44f

https://public.work/mythical%20creatures

Mirror

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
