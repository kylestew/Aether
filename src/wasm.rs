use crate::core::{composition::Composition, renderer::CompRenderer};
use js_sys::Uint8Array;
use std::time::Duration;
use wasm_bindgen::prelude::*;

// fix for serde typetag constructors failing to build in wasm
#[cfg(target_family = "wasm")]
unsafe extern "C" {
    fn __wasm_call_ctors();
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
    unsafe {
        __wasm_call_ctors();
    }
}

macro_rules! console_log {
    ($($t:tt)*) => {
        web_sys::console::log_1(
            &format!("RUST:: {}", format_args!($($t)*)).into()
        )
    }
}

/// Main WASM interface for the Aether composition engine
// Note: we are intentionally limiting exposure to Rust code
#[wasm_bindgen]
pub struct WasmAether {
    size: (u32, u32),
    renderer: CompRenderer,
    /// RGBA8 conversion buffer for JavaScript
    rgba_buffer: Vec<u8>,
}

#[wasm_bindgen]
impl WasmAether {
    /// Create a new Aether instance from JSON
    #[wasm_bindgen(constructor)]
    pub fn new(json: &str, width: u32, height: u32) -> Result<WasmAether, JsValue> {
        console_log!("Creating WasmAether {}x{}", width, height);

        let comp: Composition = serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&format!("JSON parse error: {}", e)))?;

        let size = (width, height);
        let renderer = CompRenderer::new(comp, size); // comp now owned by renderer
        let rgba_buffer = vec![0u8; (width * height * 4) as usize]; // RGBA8

        Ok(WasmAether {
            size,
            renderer,
            rgba_buffer,
        })
    }

    #[wasm_bindgen(getter)]
    pub fn width(&self) -> u32 {
        self.size.0
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> u32 {
        self.size.1
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.size = (width, height);
        self.renderer.resize((width, height));
        self.rgba_buffer.resize((width * height * 4) as usize, 0);
    }

    pub fn render(&mut self, t_seconds: f64) {
        // Guard against NaN/∞/negative and avoid panics.
        let t_seconds = if t_seconds.is_finite() && t_seconds >= 0.0 {
            t_seconds
        } else {
            0.0
        };
        let t = Duration::from_secs_f64(t_seconds.min(Duration::MAX.as_secs_f64()));
        self.renderer.render(t);
    }

    /// RGBA8 view of the current frame (zero-copy)
    #[wasm_bindgen(js_name = frame)]
    pub fn frame_view(&self) -> Uint8Array {
        // Cast &[u32] -> &[u8] (no copy). bytemuck is nice, or do it manually.
        let bytes: &[u8] = bytemuck::cast_slice(&self.renderer.accumulator);
        // SAFETY: the slice lives as long as `self`; caller must not hold the view
        // across `render`/`resize` that could reallocate `accumulator`.
        unsafe { Uint8Array::view(bytes) }
    }
}
