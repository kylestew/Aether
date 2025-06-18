# Aether

> AfterEffects - but layers are code

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
  - RGB Offset
  - Threshold (chroma based, snap colors to black/white)
  - Vignette
- Post Processing
  - CGA Dither (4-color palette Bayer dither)
  - Feedback (holds and blends with last frame)
  - Receipt (simplified low-resolution output)
  - Shape Dither (custom rendered shapes instead of pixels)
  - Waves (rutt-etra style wave rendering from sampled canvas)


- Low resolution canvas - render shape - upscale - apply dithering

RGB Shift
https://github.com/pixiteapps/Spool/blob/develop/Source/Filters/Metal%20Kernels/RGBShift.metal

Examples dictionary - list all in main index


| **Effect**                | **Description**                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Tint**                  | Maps black and white to two custom colors—useful for duotone or stylistic remapping.                    |
| **Motion Tile**           | Repeats and mirrors the image—used in kaleidoscopic effects or for seamless pattern tiling.             |
| **Transform**             | Allows scale, rotation, translation, and anchor-point manipulation separate from base layer transforms. |
| **Fractal Noise**         | Generates procedural grayscale noise—great for texture generation, clouds, or displacement sources.     |
| **Pixel Glow**            | Adds bloom or glow around bright areas, often using a threshold and blur pass.                          |
| **Displacement**          | Warps the image using another layer or map—commonly used for heat ripples, water, or glitch effects.    |
| **Sobel Edge Detection**  | Highlights edges by calculating luminance contrast—used for stylization, outlines, or masks.            |
| **LUT Applier**           | Applies Look-Up Tables (LUTs) to recolor footage for film looks, grading, or stylization.               |
| **Chromatic Zoom Shader** | Simulates zoom with chromatic aberration—used for impact effects, transitions, or stylized movement.    |

## Later

  More Dithering:
- Blue Noise Dithering patterns (make more pattenrs!)
- https://www.shadertoy.com/view/MtV3W1


Solarize: https://editor.isf.video/shaders/5e7a7fc97c113618206de44f

https://public.work/mythical%20creatures

Mirror

ON SCREEN UI TO EDIT ANIMATION PARAMETERS for LAYERS

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


Break out ether examples into own repo and treat this repo as the library