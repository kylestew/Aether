use serde_json;
use wasm_bindgen::prelude::*;
use web_sys::ImageData;

use crate::composition::Composition;
use crate::layer::Layer;

// Set up console logging and panic hooks for debugging
#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

// Utility macro for console logging from Rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
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

            // Composite scratch into backbuffer
            crate::layer::blend_into(
                &mut self.backbuffer,
                &self.scratch,
                layer.blend,
                layer.opacity,
            );
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

/// Simple WASM-only gradient renderer for testing
#[wasm_bindgen]
pub struct WasmGradient {
    start_color: u32,
    end_color: u32,
    horizontal: bool,
}

#[wasm_bindgen]
impl WasmGradient {
    #[wasm_bindgen(constructor)]
    pub fn new(start_color: u32, end_color: u32, horizontal: bool) -> WasmGradient {
        WasmGradient {
            start_color,
            end_color,
            horizontal,
        }
    }

    /// Render gradient directly to ImageData (for standalone use)
    #[wasm_bindgen]
    pub fn render_to_image_data(&self, width: u32, height: u32) -> Result<ImageData, JsValue> {
        let mut buffer = vec![0u32; (width * height) as usize];
        self.render_to_buffer(&mut buffer, width as usize, height as usize);

        // Convert to ImageData
        let mut rgba_data = Vec::with_capacity(buffer.len() * 4);
        for &pixel in &buffer {
            let r = ((pixel >> 16) & 0xFF) as u8;
            let g = ((pixel >> 8) & 0xFF) as u8;
            let b = (pixel & 0xFF) as u8;
            let a = 255u8;
            rgba_data.extend_from_slice(&[r, g, b, a]);
        }

        ImageData::new_with_u8_clamped_array_and_sh(
            wasm_bindgen::Clamped(&rgba_data),
            width,
            height,
        )
    }

    fn render_to_buffer(&self, buffer: &mut [u32], width: usize, height: usize) {
        if self.horizontal {
            // Horizontal gradient
            let mut row = Vec::with_capacity(width);
            for x in 0..width {
                let t = x as f32 / (width - 1) as f32;
                row.push(lerp_color(self.start_color, self.end_color, t));
            }
            for y in 0..height {
                buffer[y * width..(y + 1) * width].copy_from_slice(&row);
            }
        } else {
            // Vertical gradient
            for y in 0..height {
                let t = y as f32 / (height - 1) as f32;
                let color = lerp_color(self.start_color, self.end_color, t);
                buffer[y * width..(y + 1) * width].fill(color);
            }
        }
    }
}

// Helper function for color interpolation
#[inline]
fn lerp_color(a: u32, b: u32, t: f32) -> u32 {
    let ar = ((a >> 16) & 0xFF) as f32;
    let ag = ((a >> 8) & 0xFF) as f32;
    let ab = (a & 0xFF) as f32;

    let br = ((b >> 16) & 0xFF) as f32;
    let bg = ((b >> 8) & 0xFF) as f32;
    let bb = (b & 0xFF) as f32;

    let r = (ar + (br - ar) * t) as u32;
    let g = (ag + (bg - ag) * t) as u32;
    let b = (ab + (bb - ab) * t) as u32;

    (r << 16) | (g << 8) | b
}
