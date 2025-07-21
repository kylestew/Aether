# Adding New Renderers to Aether WASM

With the new generic `WasmRenderer` wrapper system, adding WASM support for new renderers is **trivial**. Here's how:

## 🎯 **The Problem We Solved**

**Before:** Each renderer needed separate WASM bindings and ImageData conversion code
**After:** One generic wrapper automatically handles any `Renderer` implementation

## 🚀 **Adding a New Renderer (Example: Checkerboard)**

### Step 1: Create the Regular Renderer

```rust
// src/renderers/checkerboard.rs
use crate::layer::Renderer;

pub struct Checkerboard {
    color1: u32,
    color2: u32,
    size: usize,
}

impl Checkerboard {
    pub fn new(color1: u32, color2: u32, size: usize) -> Self {
        Self { color1, color2, size }
    }
}

impl Renderer for Checkerboard {
    fn render(&mut self, buf: &mut [u32], (w, h): (usize, usize), _t: f32) {
        for y in 0..h {
            for x in 0..w {
                let checker = ((x / self.size) + (y / self.size)) % 2;
                let color = if checker == 0 { self.color1 } else { self.color2 };
                buf[y * w + x] = color;
            }
        }
    }
}
```

### Step 2: Add WASM Support (5 lines of code!)

```rust
// In src/wasm.rs - add to WasmRenderer impl
use crate::renderers::checkerboard::Checkerboard;

#[wasm_bindgen]
impl WasmRenderer {
    // Add this single method
    #[wasm_bindgen]
    pub fn checkerboard(color1: u32, color2: u32, size: u32) -> WasmRenderer {
        WasmRenderer {
            renderer: Box::new(Checkerboard::new(color1, color2, size as usize)),
            width: 800,
            height: 600,
        }
    }
}
```

### Step 3: Use it in JavaScript

```javascript
// Automatic WASM support - no additional code needed!
const renderer = new RendererEngine();
await renderer.createCheckerboard(0xFF0000, 0x00FF00, 32); // red/green, 32px squares
renderer.render(canvas);
```

**That's it!** 🎉

## 🏗️ **Architecture Benefits**

### **For Rust Developers**
- Write renderer once, works everywhere (desktop + web)
- No WASM-specific code in renderer logic
- Automatic ImageData conversion
- Consistent API across all renderers

### **For JavaScript Developers**
- Same interface for all renderers
- Automatic WASM module loading
- Type-safe bindings
- Easy animation support

## 📋 **Complete Example: Adding Color Bars**

Let's add the existing `colorbars` renderer to WASM:

```rust
// In src/wasm.rs
use crate::renderers::colorbars::{ColorBars, BarsDir};

#[wasm_bindgen]
impl WasmRenderer {
    #[wasm_bindgen]
    pub fn colorbars(horizontal: bool) -> WasmRenderer {
        let direction = if horizontal { BarsDir::Horizontal } else { BarsDir::Vertical };
        WasmRenderer {
            renderer: Box::new(ColorBars::new(direction)),
            width: 800,
            height: 600,
        }
    }
}
```

JavaScript usage:
```javascript
const renderer = new RendererEngine();
await renderer.createColorbars(true); // horizontal bars
renderer.startAnimation(canvas);
```

## 🎨 **Adding to Compositions**

To use new renderers in JSON compositions, update the composition parser:

```rust
// In src/composition.rs
LayerSpec::Checkerboard {
    color1,
    color2, 
    size,
    blend,
    opacity,
} => Layer::new(
    blend.into(),
    opacity,
    Box::new(Checkerboard::new(color1, color2, size)),
),
```

JSON usage:
```json
{
  "layers": [
    {
      "type": "checkerboard",
      "color1": 16711680,
      "color2": 65280,
      "size": 32,
      "blend": "normal",
      "opacity": 1.0
    }
  ]
}
```

## 🔧 **Pattern Summary**

For any new renderer:

1. **Create renderer** implementing `Renderer` trait
2. **Add factory method** to `WasmRenderer`
3. **Optionally add** to JavaScript `RendererEngine`
4. **Optionally add** to composition JSON parser

**Zero ImageData conversion code needed!** ✨

## 🚀 **Performance Benefits**

- **Single ImageData conversion** function (reused by all renderers)
- **No code duplication** between desktop and web
- **Optimal WASM compilation** (unused renderers are tree-shaken)
- **Consistent performance** across all renderer types

The generic wrapper system makes Aether infinitely extensible! 🎯 