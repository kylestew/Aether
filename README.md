# Aether

> After Effects, but layers are code - currently desktop only (soon to be a web app)

Aether is a creative coding framework that lets you build visual compositions using programmable layers. Think of it as After Effects where every layer is code that can generate content, apply effects, and create animations.

## 🚀 Quick Start

```bash
# Clone and run the desktop version
git clone <repository-url>
cd Aether

# Run the native desktop application
cargo run
```

**Current Features:**
- Basic layer composition system
- Normal and multiply blend modes  
- Vertical gradient renderer
- Real-time 30fps rendering at 1280x720
- Resizable window with ESC to quit

**Controls:**
- `ESC` - Quit application
- Window is resizable

---

## 🏗️ Architecture

```rust
// Basic layer creation
use layer::{Blend, Layer};
use renderers::gradient::VerticalGradient;

let layers = vec![Layer::new(
    Blend::Normal,
    1.0,
    Box::new(VerticalGradient::new(0x1E90FF, 0xFF1493)),
)];
```

**Core Components:**
- **`Layer`** - Wraps renderer with blend mode and opacity
- **`Renderer` trait** - Implement `render()` for custom effects
- **Blend modes** - Normal, Multiply (more coming)
- **`minifb`** - Cross-platform framebuffer for display

**Current Renderers:**
- `VerticalGradient` - Linear color gradients

---

## 🛠️ Development

**Project Structure:**
```
src/
├── main.rs           # Application entry point
├── layer.rs          # Core layer and blending system
└── renderers/        # Layer renderer implementations
    ├── mod.rs
    └── gradient.rs   # Gradient renderer
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
        // t = time in seconds
    }
}
```

3. Add to `renderers/mod.rs` and use in `main.rs`

**Buffer Format:**
- Pixels are `u32` in 0xRRGGBB format (8-bit per channel)
- Buffer is row-major: `index = y * width + x`

### Requirements

- **Rust**: 1.88.0 or later
- **Dependencies**: `minifb` (framebuffer), `rand` (utilities)

---

## 🎨 Roadmap

- [ ] **Core Renderers**
  - [x] Vertical gradient
  - [ ] Horizontal gradient  
  - [ ] Radial gradient
  - [ ] Perlin noise
  - [ ] Simple shapes (circle, rectangle)
  - [ ] Image loading and display

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

The main application demonstrates a basic blue-to-pink vertical gradient that fills the window and animates over time.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your layer renderer or improvement
4. Include examples if applicable
5. Submit a pull request

**Current Focus**: New renderers, effects, and core system improvements are especially welcome.

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
