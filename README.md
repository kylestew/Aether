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
