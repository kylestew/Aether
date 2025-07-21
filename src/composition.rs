use serde::Deserialize;

use crate::{
    layer::{Blend, Layer},
    renderers::gradient::VerticalGradient,
};

/// Root node of the JSON file
#[derive(Deserialize)]
pub struct Composition {
    pub layers: Vec<LayerSpec>,
}

#[derive(Deserialize)]
#[serde(tag = "type")] // <‑‑ enum dispatch on "type"
pub enum LayerSpec {
    #[serde(rename = "gradient")]
    Gradient {
        top: u32,
        bottom: u32,
        #[serde(default = "default_blend")]
        blend: BlendSpec,
        #[serde(default = "default_opacity")]
        opacity: f32,
    },
    // add Noise { … }, Image { … } here later
}

/* ---------- helpers ---------- */

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

fn default_blend() -> BlendSpec {
    BlendSpec::Normal
}
fn default_opacity() -> f32 {
    1.0
}

/* ---------- conversion ---------- */

impl Composition {
    /// Turn the parsed JSON into real `Layer`s ready for the engine.
    pub fn into_layers(self) -> Vec<Layer> {
        self.layers
            .into_iter()
            .map(|spec| match spec {
                LayerSpec::Gradient {
                    top,
                    bottom,
                    blend,
                    opacity,
                } => Layer::new(
                    blend.into(),
                    opacity,
                    Box::new(VerticalGradient::new(top, bottom)),
                ),
            })
            .collect()
    }
}
