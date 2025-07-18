# Aether

> After Effects, but layers are code

Aether is a creative coding playground that lets you build visual compositions using JavaScript. Think of it as After Effects where every layer is programmable code. Create animations, effects, and visual experiments by stacking and blending different types of layers.

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Aether

# Install dependencies
npm install

# Start development server
npm run dev
```

### Your First Composition

Create a new file in the `examples/` directory:

```javascript
import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'
import { gradient } from '../layers/generators/gradient.js'
import { rgbOffset } from '../layers/pixel/rgbOffset.js'

const layers = [
    new Layer({ size: [320, 240] }, gradient, {
        startColor: '#ff6b6b',
        endColor: '#4ecdc4',
        direction: 'horizontal'
    }),
    new Layer({ size: [320, 240] }, rgbOffset, {
        offset: 0.02,
        mode: 0
    })
]

const player = createPlayer({
    size: [320, 240],
    animated: true,
    duration: 5,
    targetFPS: 30,
    layers
})

await player.loadAndStart()
```

## 📚 Core Concepts

### Player
The main orchestrator that manages your composition:
- **size**: Final output dimensions `[width, height]`
- **animated**: Whether the composition should animate
- **duration**: Length in seconds
- **targetFPS**: Target frame rate
- **layers**: Array of Layer objects

### Layers
Each layer has:
- **size**: Layer dimensions `[width, height]`
- **blendMode**: How it blends with layers below
- **opacity**: Layer transparency (0-1)
- **renderer**: The actual rendering logic
- **params**: Configuration for the renderer

### Blend Modes
Available blend modes: `normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`

## 🎨 Layer Types

### Generators
Create content from scratch:
- **Fragment Shader** - Loadable GLSL pixel shaders
- **Gradient** - Linear and radial gradients
- **Particles** - Particle system with physics
- **Pixel Pattern** - Array-defined repeating patterns
- **Perlin Noise** - Random noise field (greyscale)
- **Simple 3D Layer** - Three.js procedural meshes
- **Text** - Text rendering with custom fonts

### Media
Load external content:
- **Image Layer** - Load and display static images

### Pixel Effects
Modify pixel data:
- **Adjustments** - Brightness, contrast, saturation
- **Blur** - Canvas API-based blur
- **Invert** - Color inversion
- **Pixelate** - Pixelation effect
- **Posterize** - Uniform quantization with bucketing
- **RGB Offset** - Channel separation effects
- **Threshold** - Chroma-based black/white snapping
- **Vignette** - Edge darkening

### Post Processing
Final output effects:
- **CGA Dither** - 4-color palette Bayer dithering
- **Feedback** - Frame blending for trails
- **Receipt** - Simplified low-resolution output
- **Waves** - Rutt-Etra style wave rendering

## 🎬 Examples

Browse the `examples/` directory for working compositions:

- **RGB Offset** - Basic image with RGB channel separation
- **Blob Animation** - Animated blob with WebGL shaders
- **CGA Sphere** - 3D sphere with CGA-style dithering
- **Plato Solids** - 3D geometric shapes with rotation
- **Dot Matrix** - Dot matrix pattern generation
- **Spherical Particles** - Particles moving on sphere surface
- **Maths Texture** - Mathematical texture generation

### Running Examples

1. Start the development server: `npm run dev`
2. Open `http://localhost:5173`
3. Click on any example to view it
4. Use the viewer controls to play/pause and export

## 🔧 API Reference

### Creating a Layer

```javascript
new Layer(controls, renderer, params)
```

**controls:**
- `size: [width, height]` - Layer dimensions
- `blendMode: string` - Blend mode (optional, defaults to 'normal')
- `opacity: number` - Layer opacity (optional, defaults to 1.0)

**renderer:** Object with a `render(ctx, params)` method

**params:** Configuration object passed to the renderer

### Time-Based Parameters

Parameters can be functions that receive animation progress:

```javascript
{
    offset: (pct) => 0.01 + 0.1 * Math.sin(pct * Math.PI * 2),
    rotation: (pct) => pct * Math.PI * 2
}
```

- `pct`: Animation progress [0, 1]
- `t`: Current time in seconds

### Renderer Interface

```javascript
{
    // Required: Main rendering function
    render(ctx, params) {
        // ctx: Canvas 2D context
        // params: Evaluated parameters + {width, height, inputCtx, t, pct, frame}
    },
    
    // Optional: Default parameters
    defaultParams: {
        // Default values
    },
    
    // Optional: Initialization
    async init(params) {
        // Called once before rendering starts
    },
    
    // Optional: Reset function
    reset(params) {
        // Called when animation loops
    }
}
```

## 🎥 Export

The viewer includes export functionality:

- **Individual Frames (PNG)** - Export each frame as PNG
- **WebM VP9 (Lossless)** - High-quality video export
- **WebM VP8 (High Quality)** - Compressed video export

Click the 📹 button in the viewer to export your composition.

## 🛠️ Development

### Project Structure

```
Aether/
├── src/           # Core library
│   ├── player.js  # Main player logic
│   ├── layer.js   # Layer management
│   └── webgl/     # WebGL utilities
├── layers/        # Layer implementations
│   ├── generators/ # Content generators
│   ├── media/     # Media loaders
│   ├── pixel/     # Pixel effects
│   └── postproc/  # Post-processing
├── examples/      # Example compositions
├── assets/        # Images, models, shaders
└── index.html     # Main viewer
```

### Adding New Layers

1. Create a new file in the appropriate `layers/` subdirectory
2. Export an object with a `render` method
3. Optionally include `defaultParams`, `init`, and `reset` methods
4. Import and use in your compositions

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Use Cases

- **Creative Coding** - Visual experiments and generative art
- **Prototyping** - Quick visual effect prototypes
- **Education** - Learning graphics programming concepts
- **Art Projects** - Digital art and installations
- **Video Effects** - Custom video processing pipelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your layer or improvement
4. Include an example if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the creative coding community
