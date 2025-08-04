//! composition.rs
//!
//! Parse a `.json` scene description into runtime `Layer`s.
//!
//! Supported layer types
//! ─────────────────────
//! * `gradient`      – two‑colour vertical / horizontal blend
//! * `noise`         – animated greyscale noise
//! * `colorbars`     – SMPTE‑style colour bars for blend‑mode testing
//!
//! Example JSON
//! ────────────
//! ```json
//! {
//!   "layers": [
//!     { "type": "gradient", "a": 2003199, "b": 16716947 },
//!     { "type": "colorbars", "direction": "horizontal",
//!       "blend": "multiply", "opacity": 0.75 },
//!     { "type": "noise", "seed": 42, "opacity": 0.2 }
//!   ]
//! }
//! ```

// use serde::Deserialize;
//
// use crate::{
//     layer::{Blend, Layer},
//     renderers::{
//         colorbars::{BarsDir, ColorBars},
//         gradient::{Direction, Gradient},
//         noise::Noise,
//     },
// };

/* ──────────────────────────────────────────────────────────────────────────
 * JSON‑side structs & enums
 * ─────────────────────────────────────────────────────────────────────── */

// #[derive(Deserialize)]
// pub struct Composition {
//     pub layers: Vec<LayerSpec>,
// }
//
// #[derive(Deserialize)]
// #[serde(tag = "type")]
// pub enum LayerSpec {
//     /* --------------------- linear gradient ---------------------------- */
//     #[serde(rename = "gradient")]
//     Gradient {
//         a: u32, // start colour (0xRRGGBB, decimal value)
//         b: u32, // end   colour (0xRRGGBB, decimal value)
//
//         #[serde(default = "default_direction")]
//         direction: DirectionSpec,
//
//         #[serde(default = "default_blend")]
//         blend: BlendSpec,
//
//         #[serde(default = "default_opacity")]
//         opacity: f32,
//     },
//
//     /* --------------------- animated noise ---------------------------- */
//     #[serde(rename = "noise")]
//     Noise {
//         seed: u64,
//
//         #[serde(default = "default_blend")]
//         blend: BlendSpec,
//
//         #[serde(default = "default_opacity")]
//         opacity: f32,
//     },
//
//     /* ---------------------- colour bars ------------------------------ */
//     #[serde(rename = "colorbars")]
//     ColorBars {
//         #[serde(default = "default_bars_dir")]
//         direction: BarsDirSpec,
//
//         #[serde(default = "default_blend")]
//         blend: BlendSpec,
//
//         #[serde(default = "default_opacity")]
//         opacity: f32,
//     },
// }
//
// /* -------- generic blend‑mode helper -------- */
//
// #[derive(Deserialize)]
// #[serde(rename_all = "lowercase")]
// pub enum BlendSpec {
//     Normal,
//     Multiply,
//     Screen,
// }
//
// impl From<BlendSpec> for Blend {
//     fn from(v: BlendSpec) -> Self {
//         match v {
//             BlendSpec::Normal => Blend::Normal,
//             BlendSpec::Multiply => Blend::Multiply,
//             BlendSpec::Screen => Blend::Screen,
//         }
//     }
// }
//
// /* -------- gradient direction helper -------- */
//
// #[derive(Deserialize)]
// #[serde(rename_all = "lowercase")]
// pub enum DirectionSpec {
//     Vertical,
//     Horizontal,
// }
//
// impl From<DirectionSpec> for Direction {
//     fn from(v: DirectionSpec) -> Self {
//         match v {
//             DirectionSpec::Vertical => Direction::Vertical,
//             DirectionSpec::Horizontal => Direction::Horizontal,
//         }
//     }
// }
//
// /* -------- colour‑bars direction helper ----- */
//
// #[derive(Deserialize)]
// #[serde(rename_all = "lowercase")]
// pub enum BarsDirSpec {
//     Vertical,
//     Horizontal,
// }
//
// impl From<BarsDirSpec> for BarsDir {
//     fn from(v: BarsDirSpec) -> Self {
//         match v {
//             BarsDirSpec::Vertical => BarsDir::Vertical,
//             BarsDirSpec::Horizontal => BarsDir::Horizontal,
//         }
//     }
// }
//
// /* ------------- default value fns ------------ */
//
// fn default_blend() -> BlendSpec {
//     BlendSpec::Normal
// }
// fn default_opacity() -> f32 {
//     1.0
// }
// fn default_direction() -> DirectionSpec {
//     DirectionSpec::Vertical
// }
// fn default_bars_dir() -> BarsDirSpec {
//     BarsDirSpec::Vertical
// }
//
// /* ──────────────────────────────────────────────────────────────────────────
//  *  Conversion into runtime layers
//  * ─────────────────────────────────────────────────────────────────────── */
//
// impl Composition {
//     /// Consume the parsed JSON tree and produce ready‑to‑render layers.
//     pub fn into_layers(self) -> Vec<Layer> {
//         self.layers
//             .into_iter()
//             .map(|spec| match spec {
//                 /* ----- gradient ----- */
//                 LayerSpec::Gradient {
//                     a,
//                     b,
//                     direction,
//                     blend,
//                     opacity,
//                 } => Layer::new(
//                     blend.into(),
//                     opacity,
//                     Box::new(Gradient::new(a, b, direction.into())),
//                 ),
//
//                 /* ----- noise ----- */
//                 LayerSpec::Noise {
//                     seed,
//                     blend,
//                     opacity,
//                 } => Layer::new(blend.into(), opacity, Box::new(Noise::new(seed))),
//
//                 /* ----- colour bars ----- */
//                 LayerSpec::ColorBars {
//                     direction,
//                     blend,
//                     opacity,
//                 } => Layer::new(
//                     blend.into(),
//                     opacity,
//                     Box::new(ColorBars::new(direction.into())),
//                 ),
//             })
//             .collect()
//     }
// }
