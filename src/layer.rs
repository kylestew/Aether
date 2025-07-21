//! Core layer plumbing for “Desktop‑Aether”
//!
//! ─ A `Renderer` draws into a scratch buffer passed from `main.rs`.
//! ─ A `Layer` wraps that renderer plus blend/opacity settings.
//! ─ `blend_into` composites the scratch pixels into the final backbuffer.

/// The trait every layer‑renderer must implement.
pub trait Renderer {
    /// Fill `dst` with this frame’s pixels (0xRRGGBB, 8‑bit per channel).
    fn render(&mut self, dst: &mut [u32], size: (usize, usize), t: f32);
}

/// Porter‑Duff‑ish blend modes (grow this list as needed).
#[derive(Clone, Copy)]
pub enum Blend {
    Normal,
    Multiply,
    Screen,
}

/// A layer = renderer + compositing parameters.
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

/* ------------------------------------------------------------------------- */
/*                        CPU‑side blending helpers                          */
/* ------------------------------------------------------------------------- */

/// Composite `src` over `dst` according to `mode` and `opacity`.
/// Both slices must be the same length (width × height).
pub fn blend_into(dst: &mut [u32], src: &[u32], mode: Blend, opacity: f32) {
    debug_assert_eq!(dst.len(), src.len());
    let alpha = (opacity.clamp(0.0, 1.0) * 255.0).round() as u32;

    for (d, &s) in dst.iter_mut().zip(src.iter()) {
        let (dr, dg, db) = split(*d);
        let (sr, sg, sb) = split(s);

        // --- blend mode math ---
        let (mr, mg, mb) = match mode {
            Blend::Normal => (sr, sg, sb),
            Blend::Multiply => (sr * dr / 255, sg * dg / 255, sb * db / 255),
            Blend::Screen => (
                255 - ((255 - sr) * (255 - dr) / 255),
                255 - ((255 - sg) * (255 - dg) / 255),
                255 - ((255 - sb) * (255 - db) / 255),
            ),
        };

        // --- alpha composite (src already has its own opacity) ---
        *d = pack(
            lerp(dr, mr, alpha),
            lerp(dg, mg, alpha),
            lerp(db, mb, alpha),
        );
    }
}

/* ----------------------------- tiny helpers ----------------------------- */

#[inline]
fn split(c: u32) -> (u32, u32, u32) {
    ((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF)
}

#[inline]
fn pack(r: u32, g: u32, b: u32) -> u32 {
    (r << 16) | (g << 8) | b
}

/// Integer lerp: alpha in 0‑255.  No overflow possible.
#[inline]
fn lerp(a: u32, b: u32, alpha: u32) -> u32 {
    //  (a * (255‑α) + b * α) / 255
    (a * (255 - alpha) + b * alpha) >> 8
}
