# Aether

> After Effects, but layers are code - currently desktop only (soon to be a web app)

Aether is a creative coding framework that lets you build visual compositions using programmable layers. Think of it as After Effects where every layer is code that can generate content, apply effects, and create animations.

## 🚀 Quick Start

```bash
# Clone and run the desktop version
git clone https://github.com/kylestew/Aether.git
cd Aether

# Run with the example composition
cargo run -- composition.json
```

**Current Features:**
- **JSON-based compositions** - Define layer stacks in declarative JSON
- **Multiple blend modes** - Normal, Multiply (more coming)
- **Multiple renderers** - Gradients and animated noise
- **Real-time rendering** - 30fps at 1280x720 with window resizing
- **Command-line interface** - Load any JSON composition file

**Controls:**
- `ESC` - Quit application
- Window is resizable and maintains aspect ratio

---

## 🎨 Creating Compositions

Aether uses **JSON files** to define layer compositions. Here's the basic structure:

```json
{
  "layers": [
    {
      "type": "gradient",
      "a": 2003199,
      "b": 16716947
    },
    {
      "type": "gradient", 
      "a": 65407,
      "b": 16753920,
      "direction": "horizontal",
      "blend": "multiply",
      "opacity": 0.6
    },
    {
      "type": "noise",
      "seed": 42,
      "opacity": 0.25
    }
  ]
}
```

### Available Layer Types

**Gradient Layers:**
```json
{
  "type": "gradient",
  "a": 2003199,          // Start color (RGB as decimal)
  "b": 16716947,         // End color (RGB as decimal)  
  "direction": "vertical", // "vertical" or "horizontal"
  "blend": "normal",     // "normal" or "multiply"
  "opacity": 1.0         // 0.0 to 1.0
}
```

**Noise Layers:**
```json
{
  "type": "noise",
  "seed": 42,            // Random seed for reproducible noise
  "blend": "normal",     // "normal" or "multiply"
  "opacity": 1.0         // 0.0 to 1.0
}
```

### Usage Examples

```bash
# Run with a specific composition
cargo run -- my_composition.json

# Try the included example
cargo run -- composition.json
```

---

## 🏗️ Architecture

### Core Components

```rust
// JSON composition loading
use composition::Composition;

// Load from file
let json = fs::read_to_string("composition.json")?;
let comp: Composition = serde_json::from_str(&json)?;
let layers: Vec<Layer> = comp.into_layers();
```

**System Overview:**
- **`Composition`** - JSON-deserializable layer specifications
- **`Layer`** - Runtime layer with renderer, blend mode, and opacity
- **`Renderer` trait** - Implement `render()` for custom effects
- **Blend modes** - Normal, Multiply (more coming)
- **`minifb`** - Cross-platform framebuffer for display

### Current Renderers

- **`Gradient`** - Linear gradients (vertical/horizontal, configurable colors)
- **`Noise`** - Animated greyscale noise (seeded random generation)

### Buffer Format
- Pixels are `u32` in 0xRRGGBB format (8-bit per channel)
- Buffer is row-major: `index = y * width + x`
- Colors in JSON are decimal RGB values (e.g., `16711680` = red)

---

## 🛠️ Development

**Project Structure:**
```
src/
├── main.rs              # Application entry point & main loop
├── composition.rs       # JSON composition system  
├── layer.rs             # Core layer and blending system
└── renderers/           # Layer renderer implementations
    ├── mod.rs
    ├── gradient.rs      # Gradient renderer
    └── noise.rs         # Noise renderer
```

**Adding New Renderers:**

1. Create a new file in `src/renderers/`
2. Implement the `Renderer` trait:

```rust
use crate::layer::Renderer;

pub struct MyRenderer {
    // renderer state
}

impl Renderer for MyRenderer {
    fn render(&mut self, buf: &mut [u32], size: (usize, usize), t: f32) {
        // Fill buffer with pixels (0xRRGGBB format)
        // t = time in seconds for animation
    }
}
```

3. Add to `renderers/mod.rs` and `composition.rs`
4. Define JSON schema in the `LayerSpec` enum

### Requirements

- **Rust**: 1.88.0 or later
- **Dependencies**: 
  - `minifb` - Cross-platform framebuffer
  - `serde` + `serde_json` - JSON composition loading  
  - `rand` - Random number generation for noise

---

## 🎨 Roadmap

- [ ] **Core Renderers**
  - [x] Vertical/horizontal gradients
  - [x] Animated noise
  - [ ] Radial gradients
  - [ ] Simple shapes (circle, rectangle)
  - [ ] Image loading and display
  - [ ] Perlin noise (coherent noise)

- [ ] **Effects & Filters**
  - [ ] Blur
  - [ ] RGB channel offset
  - [ ] Pixelation
  - [ ] Color adjustments

- [ ] **Advanced Features**
  - [ ] Animation timeline system
  - [ ] Parameter keyframing
  - [ ] More blend modes (screen, overlay, etc.)
  - [ ] Layer transforms (scale, rotate, translate)
  - [ ] Export to image/video

- [ ] **Performance**
  - [ ] Multi-threading for layer rendering
  - [ ] SIMD optimizations
  - [ ] GPU compute shaders (wgpu integration)

- [ ] **Future Platform Support**
  - [ ] Web version (WebAssembly + Canvas)
  - [ ] Cross-platform compatibility (Windows, macOS, Linux)
  - [ ] Plugin system for custom renderers
  - [ ] Hot-reloading for development

---

## 🎮 Current Example

The included `composition.json` demonstrates:
- **Blue-to-pink vertical gradient** as background
- **Green-to-yellow horizontal gradient** with multiply blend  
- **Animated noise overlay** at 25% opacity

Try modifying the colors, blend modes, or adding new layers!

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your layer renderer or improvement
4. Include example JSON compositions
5. Submit a pull request

**Current Focus**: New renderers, JSON composition features, and core system improvements are especially welcome.

---

## 🌟 Use Cases

- **Creative Coding**: Real-time visual experiments and generative art
- **Prototyping**: Quick visual effect development and testing
- **Education**: Learning graphics programming concepts
- **Performance**: Native desktop performance for complex compositions
- **Art Projects**: Digital installations and interactive media

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the creative coding community**

*High-performance native rendering with declarative JSON compositions*
