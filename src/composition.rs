//! composition.rs
//!
//! Parse a JSON file describing the whole scene and turn it into a ready‑to‑render
//! `Vec<Layer>` for the engine.
//!
//! Supported layer specs so far:
//!   * `"gradient"`   – vertical or horizontal two‑colour blend
//!   * `"noise"`      – animated greyscale noise
//!
//! Example JSON:
//! ```json
//! {
//!   "layers": [
//!     { "type": "gradient", "a": 197379, "b": 16716947 },
//!     { "type": "gradient", "a": 65407, "b": 16753920,
//!       "direction": "horizontal", "blend": "multiply", "opacity": 0.6 },
//!     { "type": "noise", "seed": 42, "opacity": 0.25 }
//!   ]
//! }
//! ```

use serde::Deserialize;

use crate::{
    layer::{Blend, Layer},
    renderers::{
        gradient::{Direction, Gradient},
        noise::Noise,
    },
};

/* ------------------------------------------------------------------------- */
/*                           JSON‑facing structs                             */
/* ------------------------------------------------------------------------- */

#[derive(Deserialize)]
pub struct Composition {
    pub layers: Vec<LayerSpec>,
}

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum LayerSpec {
    /* ---------------- gradient (vertical / horizontal) ------------------ */
    #[serde(rename = "gradient")]
    Gradient {
        /// Start colour (0xRRGGBB, decimal in JSON).
        a: u32,
        /// End colour (0xRRGGBB, decimal).
        b: u32,

        #[serde(default = "default_direction")]
        direction: DirectionSpec,

        #[serde(default = "default_blend")]
        blend: BlendSpec,

        #[serde(default = "default_opacity")]
        opacity: f32,
    },

    /* ---------------------------- noise --------------------------------- */
    #[serde(rename = "noise")]
    Noise {
        seed: u64,

        #[serde(default = "default_blend")]
        blend: BlendSpec,

        #[serde(default = "default_opacity")]
        opacity: f32,
    },
}

/* ------------------------------------------------------------------------- */
/*                       Small enums + conversions                           */
/* ------------------------------------------------------------------------- */

#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum BlendSpec {
    Normal,
    Multiply,
}

impl From<BlendSpec> for Blend {
    fn from(b: BlendSpec) -> Self {
        match b {
            BlendSpec::Normal => Blend::Normal,
            BlendSpec::Multiply => Blend::Multiply,
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum DirectionSpec {
    Vertical,
    Horizontal,
}

impl From<DirectionSpec> for Direction {
    fn from(d: DirectionSpec) -> Self {
        match d {
            DirectionSpec::Vertical => Direction::Vertical,
            DirectionSpec::Horizontal => Direction::Horizontal,
        }
    }
}

/* ------------------------- default helpers ---------------------------- */

fn default_blend() -> BlendSpec {
    BlendSpec::Normal
}
fn default_opacity() -> f32 {
    1.0
}
fn default_direction() -> DirectionSpec {
    DirectionSpec::Vertical
}

/* ------------------------------------------------------------------------- */
/*                      Convert JSON → runtime layers                        */
/* ------------------------------------------------------------------------- */

impl Composition {
    /// Consume self and build a vector of engine `Layer`s.
    pub fn into_layers(self) -> Vec<Layer> {
        self.layers
            .into_iter()
            .map(|spec| match spec {
                /* ---- gradient ---- */
                LayerSpec::Gradient {
                    a,
                    b,
                    direction,
                    blend,
                    opacity,
                } => Layer::new(
                    blend.into(),
                    opacity,
                    Box::new(Gradient::new(a, b, direction.into())),
                ),

                /* ---- noise ---- */
                LayerSpec::Noise {
                    seed,
                    blend,
                    opacity,
                } => Layer::new(blend.into(), opacity, Box::new(Noise::new(seed))),
            })
            .collect()
    }
}
