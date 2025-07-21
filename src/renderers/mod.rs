pub mod colorbars;
pub mod gradient;
pub mod noise;

// WASM-compatible renderers
#[cfg(target_arch = "wasm32")]
pub mod wasm_noise;
