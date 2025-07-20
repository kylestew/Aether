mod utils;

use aether_core::{Comp, PixelBuf};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Renderer {
    comp: Comp,
    frame: PixelBuf,
}

#[wasm_bindgen]
impl Renderer {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Renderer {
        utils::set_panic_hook();

        let comp = Comp {
            width,
            height,
            background: [0, 0, 0, 0], // Transparent background
            layers: Vec::new(),
        };

        let frame = vec![0; (width * height * 4) as usize];

        Renderer { comp, frame }
    }

    /// Replace the current comp with JSON description produced in JS.
    pub fn load_comp(&mut self, json: &str) -> Result<(), JsValue> {
        self.comp = serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&format!("comp parse error: {}", e)))?;

        // Resize buffer if needed
        let needed = (self.comp.width * self.comp.height * 4) as usize;
        if self.frame.len() != needed {
            self.frame = vec![0; needed];
        }

        Ok(())
    }

    /// Update just the layer params (fast path; JSON delta)
    pub fn update_layers(&mut self, json: &str) -> Result<(), JsValue> {
        // Parse Vec<Layer> and patch by id
        let layers: Vec<aether_core::Layer> = serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&format!("layers parse error: {}", e)))?;

        // Update existing layers by ID
        for new_layer in layers {
            if let Some(existing_layer) = self.comp.layers.iter_mut().find(|l| l.id == new_layer.id)
            {
                *existing_layer = new_layer;
            }
        }

        Ok(())
    }

    /// Render one frame at time t_ms; returns pointer to RGBA buffer.
    pub fn render(&mut self, t_ms: f32) -> *const u8 {
        self.comp.render(t_ms, &mut self.frame);
        self.frame.as_ptr()
    }

    pub fn frame_len(&self) -> usize {
        self.frame.len()
    }

    /// Safe copy (slower but safer for debugging)
    pub fn get_frame(&self) -> js_sys::Uint8Array {
        unsafe { js_sys::Uint8Array::view(&self.frame) }
    }

    /// Get composition dimensions
    pub fn width(&self) -> u32 {
        self.comp.width
    }

    pub fn height(&self) -> u32 {
        self.comp.height
    }
}
