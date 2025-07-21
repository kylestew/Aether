# Aether WASM Demo

This directory contains the WebAssembly bridge for the Aether visual effects engine, allowing Rust-powered rendering in the browser.

## Features

- **Full composition support** - Load JSON compositions with multiple layers
- **Real-time rendering** - 60fps animation with WASM performance
- **Layer controls** - Adjust opacity and blend modes in real-time
- **Standalone renderers** - Test individual effects (gradient, noise) 
- **Responsive canvas** - Resize rendering resolution on the fly

## Building

### Prerequisites

1. Install `wasm-pack`:
```bash
cargo install wasm-pack
```

2. Ensure you have a recent version of Rust (2024 edition support)

### Build Steps

1. **Build the WASM module** (from the project root):
```bash
wasm-pack build --target web --out-dir web/pkg
```

2. **Serve the demo**:
```bash
cd web
python3 -m http.server 8000
# or
npx http-server . -p 8000
```

3. **Open in browser**: Navigate to `http://localhost:8000`

## Usage

### Basic Engine Usage

```javascript
import { AetherEngine } from './aether-engine.js';

const engine = new AetherEngine();
const canvas = document.getElementById('myCanvas');

// Define composition
const composition = {
    layers: [
        {
            type: "gradient",
            a: 16777215, // white (0xFFFFFF)
            b: 255,      // blue (0x0000FF)  
            direction: "vertical"
        },
        {
            type: "noise",
            seed: 42,
            blend: "multiply",
            opacity: 0.3
        }
    ]
};

// Initialize and start
await engine.init(canvas, composition);
engine.play(); // Start animation loop

// Control layers
engine.setLayerOpacity(0, 0.5);
engine.resize(1920, 1080);
```

### Standalone Renderers

```javascript
import { WasmGradientRenderer, WasmNoiseRenderer } from './aether-engine.js';

// Gradient
const gradient = new WasmGradientRenderer();
await gradient.init(0xFF0000, 0x0000FF, true); // red to blue, horizontal
gradient.render(canvas);

// Animated noise
const noise = new WasmNoiseRenderer();
await noise.init(42); // seed
setInterval(() => {
    noise.render(canvas, Date.now() / 1000);
}, 16); // ~60fps
```

## Composition Format

The engine accepts JSON compositions with this structure:

```json
{
  "layers": [
    {
      "type": "gradient",
      "a": 16777215,
      "b": 0,
      "direction": "horizontal",
      "blend": "normal",
      "opacity": 1.0
    },
    {
      "type": "noise", 
      "seed": 42,
      "blend": "multiply",
      "opacity": 0.5
    },
    {
      "type": "colorbars",
      "direction": "vertical",
      "blend": "screen",
      "opacity": 1.0
    }
  ]
}
```

### Supported Layer Types

- **`gradient`** - Linear color gradients
  - `a`, `b`: Start/end colors (decimal RGB values)
  - `direction`: "vertical" or "horizontal"

- **`noise`** - Animated grayscale noise
  - `seed`: Random seed for reproducible noise

- **`colorbars`** - SMPTE-style color bars
  - `direction`: "vertical" or "horizontal"

### Blend Modes

- `normal` - Standard alpha blending
- `multiply` - Multiply blend mode
- `screen` - Screen blend mode

## Performance Notes

- **Memory efficiency**: WASM linear memory is managed automatically
- **Zero-copy rendering**: ImageData is created directly from Rust buffers
- **60fps target**: Optimized for real-time animation
- **Scalable resolution**: Tested up to 1920x1080 at 60fps

## Troubleshooting

### Build Issues

- Ensure `wasm-pack` is installed and up to date
- Check that Rust edition 2024 is supported
- Verify all dependencies in `Cargo.toml`

### Runtime Issues

- Use browser developer tools to check console for WASM loading errors
- Ensure you're serving over HTTP/HTTPS (not `file://`)
- Check that your browser supports WebAssembly (all modern browsers do)

### Performance Issues

- Try reducing canvas resolution
- Monitor browser task manager for memory usage
- Use `console.log()` in Rust with the `console_log!` macro for debugging

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support (WebAssembly and ES modules)
- **Mobile**: Supported on modern mobile browsers

## Next Steps

- Add more renderer types (3D, particles, etc.)
- Implement WebGL backend for GPU acceleration
- Add audio-reactive features
- Support for external image/video inputs 