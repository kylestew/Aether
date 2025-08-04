use serde::{Deserialize, Serialize};

/// Core layer plumbing for “Desktop‑Aether”
///
/// - A `Renderer` draws into a scratch buffer into it from the compositor.
/// ─ A `Layer` wraps that renderer plus blend/opacity settings.
#[typetag::serde(tag = "type")]
pub trait Renderer {
    /// Fill `dst` with this frame’s pixels (0xRRGGBB, 8‑bit per channel).
    fn render(&self, src: &[u32], dst: &mut [u32], size: (usize, usize), t: f32);
}

/// Porter‑Duff‑ish blend modes
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Blend {
    Normal,
    Multiply,
    Screen,
}

/// A layer = renderer + compositing parameters.
#[derive(Serialize, Deserialize)]
pub struct Layer {
    pub blend: Blend,
    pub opacity: f32, // 0.0 - 1.0
    pub renderer: Box<dyn Renderer>,
}

impl Layer {
    pub fn new(blend: Blend, opacity: f32, renderer: Box<dyn Renderer>) -> Self {
        Self {
            blend,
            opacity,
            renderer,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;

    // helper: almost-zero float comparison
    fn feq(a: f32, b: f32) -> bool {
        (a - b).abs() < f32::EPSILON
    }

    #[test]
    fn layer_deserialize() {
        let json = r#"
{
    "blend": "screen",
    "opacity": 0.8,
    "renderer": {
        "type": "Solid",
        "rgb": "00FF00"
    }
}"#;

        let layer: Layer = serde_json::from_str(json).unwrap();
        assert_eq!(layer.blend, Blend::Screen);
    }

    #[test]
    fn layer_round_trip_and_render() {
        // --- 1. initial JSON ---
        let json_in = r#"
        {
            "blend":   "screen",
            "opacity": 0.8,
            "renderer": {
                "type": "Solid",
                "rgb":  "00FF00"
            }
        }"#;

        // deserialise once
        let layer: Layer = serde_json::from_str(json_in).unwrap();

        // --- 2. round-trip through JSON ---
        let json_out = serde_json::to_string_pretty(&layer).unwrap();
        let layer2: Layer = serde_json::from_str(&json_out).unwrap();

        assert_eq!(layer.blend, layer2.blend);
        assert!(feq(layer.opacity, layer2.opacity));

        // --- 3. functional test of renderer ---
        let mut dst = vec![0u32; 4]; // 2 × 2 pixels
        layer.renderer.render(&[], &mut dst, (2, 2), 0.0);

        // screen-blend layer with a Solid { rgb: 0x00FF00 } should give pure green
        assert_eq!(dst, vec![0x00FF00; 4]);

        // (optional) do the same for the second copy to prove it's independent
        let mut dst2 = vec![0u32; 4];
        layer2.renderer.render(&[], &mut dst2, (2, 2), 0.0);
        assert_eq!(dst2, dst);
    }
}
