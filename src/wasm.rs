// use serde_json;
// use wasm_bindgen::prelude::*;
// use web_sys::ImageData;

// use crate::composition::Composition;
// use crate::layer::{Layer, Renderer};

// Set up console logging and panic hooks for debugging
// #[wasm_bindgen(start)]
// pub fn main() {
//     console_error_panic_hook::set_once();
// }
//
// // Utility macro for console logging from Rust
// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace = console)]
//     fn log(s: &str);
// }
//
// macro_rules! console_log {
//     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
// }

/*
/// Generic WASM wrapper for any Renderer
/// This eliminates code duplication by wrapping existing renderers
#[wasm_bindgen]
pub struct WasmRenderer {
    renderer: Box<dyn Renderer>,
    width: u32,
    height: u32,
}

#[wasm_bindgen]
impl WasmRenderer {
    /// Render to ImageData (works with any wrapped renderer)
    #[wasm_bindgen]
    pub fn render_to_image_data(
        &mut self,
        width: u32,
        height: u32,
        time: f32,
    ) -> Result<ImageData, JsValue> {
        self.width = width;
        self.height = height;

        // Create buffer and render using existing renderer logic
        let mut buffer = vec![0u32; (width * height) as usize];
        self.renderer
            .render(&mut buffer, (width as usize, height as usize), time);

        // Convert to ImageData
        self.buffer_to_image_data(&buffer)
    }

    /// Convert RGB32 buffer to ImageData
    fn buffer_to_image_data(&self, buffer: &[u32]) -> Result<ImageData, JsValue> {
        let mut rgba_data = Vec::with_capacity(buffer.len() * 4);

        // Convert RGB32 to RGBA
        for &pixel in buffer {
            let r = ((pixel >> 16) & 0xFF) as u8;
            let g = ((pixel >> 8) & 0xFF) as u8;
            let b = (pixel & 0xFF) as u8;
            let a = 255u8; // Full opacity

            rgba_data.extend_from_slice(&[r, g, b, a]);
        }

        // Create ImageData using Clamped data
        ImageData::new_with_u8_clamped_array_and_sh(
            wasm_bindgen::Clamped(&rgba_data),
            self.width,
            self.height,
        )
    }
}

/// Main WASM interface for the Aether composition engine
#[wasm_bindgen]
pub struct WasmAether {
    layers: Vec<Layer>,
    width: u32,
    height: u32,
    backbuffer: Vec<u32>,
    scratch: Vec<u32>,
}

#[wasm_bindgen]
impl WasmAether {
    /// Create a new Aether instance from JSON composition
    #[wasm_bindgen(constructor)]
    pub fn new(json: &str, width: u32, height: u32) -> Result<WasmAether, JsValue> {
        console_log!("Creating WasmAether {}x{}", width, height);

        let comp: Composition = serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&format!("JSON parse error: {}", e)))?;

        let layers = comp.into_layers();
        let buffer_size = (width * height) as usize;

        Ok(WasmAether {
            layers,
            width,
            height,
            backbuffer: vec![0u32; buffer_size],
            scratch: vec![0u32; buffer_size],
        })
    }

    /// Render the composition at a specific time and return ImageData
    #[wasm_bindgen]
    pub fn render(&mut self, time: f32) -> Result<ImageData, JsValue> {
        let size = (self.width as usize, self.height as usize);

        // Clear backbuffer
        self.backbuffer.fill(0);

        // Render each layer and composite
        for layer in &mut self.layers {
            // Clear scratch buffer
            self.scratch.fill(0);

            // Render layer to scratch
            layer.renderer.render(&mut self.scratch, size, time);

            // // Composite scratch into backbuffer
            // crate::layer::blend_into(
            //     &mut self.backbuffer,
            //     &self.scratch,
            //     layer.blend,
            //     layer.opacity,
            // );
        }

        // Convert to ImageData
        self.buffer_to_image_data()
    }

    /// Update layer parameters (for future extensibility)
    #[wasm_bindgen]
    pub fn update_layer_opacity(&mut self, index: usize, opacity: f32) -> Result<(), JsValue> {
        if index >= self.layers.len() {
            return Err(JsValue::from_str("Layer index out of bounds"));
        }

        self.layers[index].opacity = opacity.clamp(0.0, 1.0);
        Ok(())
    }

    /// Get the number of layers
    #[wasm_bindgen]
    pub fn get_layer_count(&self) -> usize {
        self.layers.len()
    }

    /// Resize the composition
    #[wasm_bindgen]
    pub fn resize(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
        let buffer_size = (width * height) as usize;
        self.backbuffer.resize(buffer_size, 0);
        self.scratch.resize(buffer_size, 0);
        console_log!("Resized to {}x{}", width, height);
    }

    /// Convert internal buffer to web ImageData
    fn buffer_to_image_data(&self) -> Result<ImageData, JsValue> {
        let mut rgba_data = Vec::with_capacity(self.backbuffer.len() * 4);

        // Convert RGB32 to RGBA
        for &pixel in &self.backbuffer {
            let r = ((pixel >> 16) & 0xFF) as u8;
            let g = ((pixel >> 8) & 0xFF) as u8;
            let b = (pixel & 0xFF) as u8;
            let a = 255u8; // Full opacity

            rgba_data.extend_from_slice(&[r, g, b, a]);
        }

        // Create ImageData using Clamped data
        ImageData::new_with_u8_clamped_array_and_sh(
            wasm_bindgen::Clamped(&rgba_data),
            self.width,
            self.height,
        )
    }
}

// Note: Legacy WasmGradient and WasmNoise were eliminated - they were just
// redundant wrappers around WasmRenderer. Use WasmRenderer.gradient() and
// WasmRenderer.noise() directly instead.
*/
