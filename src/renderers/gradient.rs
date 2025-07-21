//! A simple vertical gradient layer.
//!
//! Fills the scratch buffer with a linear blend from `top` to `bottom` colour
//! (0xRRGGBB, 8‑bit per channel).
use crate::layer::Renderer;

pub struct VerticalGradient {
    top: u32,
    bottom: u32,
}

impl VerticalGradient {
    pub fn new(top: u32, bottom: u32) -> Self {
        Self { top, bottom }
    }
}

impl Renderer for VerticalGradient {
    fn render(&mut self, buf: &mut [u32], (w, h): (usize, usize), _t: f32) {
        for y in 0..h {
            let t = y as f32 / (h - 1) as f32;
            let c = lerp_color(self.top, self.bottom, t);
            buf[y * w..(y + 1) * w].fill(c);
        }
    }
}

/* ----------------------------- helpers ----------------------------- */

#[inline]
fn lerp_color(a: u32, b: u32, t: f32) -> u32 {
    let (ar, ag, ab) = split(a);
    let (br, bg, bb) = split(b);

    let r = (ar + (br - ar) * t) as u32;
    let g = (ag + (bg - ag) * t) as u32;
    let b = (ab + (bb - ab) * t) as u32;

    (r << 16) | (g << 8) | b
}

#[inline]
fn split(c: u32) -> (f32, f32, f32) {
    (
        ((c >> 16) & 0xFF) as f32,
        ((c >> 8) & 0xFF) as f32,
        (c & 0xFF) as f32,
    )
}
