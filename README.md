# Aether (Rust+WASM Port)

This is the first Rust+WASM version of Aether. Rendering is CPU-based in Rust compiled to WebAssembly; the browser UI and animation system remain in JavaScript. WebGPU/GPU acceleration, video, and advanced effects will land in later phases.

## Architecture

- **`crates/aether_core`**: Pure Rust rendering engine with pixel manipulation
- **`crates/aether_wasm`**: WASM bindings that expose the Rust renderer to JavaScript  
- **`web/`**: JavaScript integration layer and demo
- **`layers/`**: Original JavaScript layer implementations (preserved for reference)

## Currently Implemented

- **Layers**: Gradient, Image (with basic transform support)
- **Blending**: Normal alpha-over only
- **Rendering**: CPU-based pixel loops with affine transforms
- **Integration**: JSON-based composition loading, real-time rendering

## Prerequisites

1. **Rust** with `wasm32-unknown-unknown` target:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```

2. **wasm-pack**:
   ```bash
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

3. **Node.js** (for the dev server):
   ```bash
   # Already have Node.js? Check: node --version
   ```

## Build & Run

1. **Build WASM** (development):
   ```bash
   npm run build:wasm:dev
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Open browser** to `http://localhost:5173/web/` to see the demo

For production builds, use `npm run build` instead.

## Usage

The demo (`web/index.html`) shows a gradient rendered by the Rust core. You can modify `web/main.js` to:

- Change gradient colors and angles
- Add image layers (uncomment the image loading code)
- Experiment with transforms and opacity

## JSON Format

Compositions are defined as JSON and passed to the Rust renderer:

```json
{
  "width": 800,
  "height": 600,
  "background": [20, 20, 30, 255],
  "layers": [
    {
      "id": 0,
      "name": "Background Gradient",
      "enabled": true,
      "opacity": 1.0,
      "blend": "Normal",
      "transform": { "m00": 1, "m01": 0, "m02": 0, "m10": 0, "m11": 1, "m12": 0 },
      "Gradient": {
        "c0": [255, 100, 100, 255],
        "c1": [100, 100, 255, 255],
        "angle_deg": 45.0
      }
    }
  ]
}
```

## Migration Status

- ✅ **Workspace setup**: Rust crates compile
- ✅ **Core types**: Comp, Layer, Transform2D, etc.
- ✅ **Gradient rendering**: CPU implementation with angle support
- ✅ **Image rendering**: Nearest-neighbor sampling with transforms
- ✅ **WASM bindings**: Renderer exposed to JavaScript
- ✅ **JavaScript integration**: Canvas blit, animation loop
- ✅ **Demo page**: Working example

## Future Phases

- GPU acceleration (WebGPU)
- Additional blend modes (Multiply, Screen, etc.)
- Blur and adjustment layers
- Video layer support
- Desktop builds (winit + pixels)
- Advanced animation system in Rust

## Development

- **Test changes**: Modify gradient colors in `web/main.js` and refresh
- **Add layers**: Extend `LayerKind` enum in `crates/aether_core/src/types.rs`
- **Debug**: Use browser dev tools; Rust panics appear in console
- **Performance**: Check frame times in browser timeline

This architecture preserves the existing JavaScript UI while moving pixel-heavy work to optimized Rust code.
