use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};
use wasm_bindgen::prelude::*;
use web_sys::ImageData;

use crate::layer::Renderer;

/// WASM-compatible animated noise renderer
#[wasm_bindgen]
pub struct WasmNoise {
    seed: u64,
    rng: SmallRng,
}

#[wasm_bindgen]
impl WasmNoise {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u64) -> WasmNoise {
        WasmNoise {
            seed,
            rng: SmallRng::seed_from_u64(seed),
        }
    }

    /// Render noise directly to ImageData (for standalone use)
    #[wasm_bindgen]
    pub fn render_to_image_data(
        &mut self,
        width: u32,
        height: u32,
        time: f32,
    ) -> Result<ImageData, JsValue> {
        let mut buffer = vec![0u32; (width * height) as usize];
        self.render_to_buffer(&mut buffer, width as usize, height as usize, time);

        // Convert to ImageData
        let mut rgba_data = Vec::with_capacity(buffer.len() * 4);
        for &pixel in &buffer {
            let gray = (pixel & 0xFF) as u8; // noise is grayscale
            rgba_data.extend_from_slice(&[gray, gray, gray, 255]);
        }

        ImageData::new_with_u8_clamped_array_and_sh(
            wasm_bindgen::Clamped(&rgba_data),
            width,
            height,
        )
    }

    fn render_to_buffer(&mut self, buffer: &mut [u32], _width: usize, _height: usize, time: f32) {
        // Re-seed based on time to get animated noise
        let time_seed = self.seed.wrapping_add((time * 1000.0) as u64);
        self.rng = SmallRng::seed_from_u64(time_seed);

        for pixel in buffer.iter_mut() {
            let noise_val = self.rng.gen_range(0..=255);
            *pixel = noise_val as u32; // Grayscale noise
        }
    }
}

/// Internal noise renderer that implements the Renderer trait
pub struct NoiseRenderer {
    wasm_noise: WasmNoise,
}

impl NoiseRenderer {
    pub fn new(seed: u64) -> Self {
        Self {
            wasm_noise: WasmNoise::new(seed),
        }
    }
}

impl Renderer for NoiseRenderer {
    fn render(&mut self, dst: &mut [u32], (w, h): (usize, usize), t: f32) {
        self.wasm_noise.render_to_buffer(dst, w, h, t);
    }
}
