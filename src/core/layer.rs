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
#[derive(Clone, Copy, Serialize, Deserialize)]
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
