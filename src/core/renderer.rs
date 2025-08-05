use crate::core::{blender, composition::Composition};
use std::time::Duration;

#[typetag::serde(tag = "type")]
pub trait Renderer {
    /// Fill `dst` with this frame’s pixels (0xRRGGBB, 8‑bit per channel).
    fn render(&self, src: &[u32], dst: &mut [u32], size: (usize, usize), t: Duration);
}

pub struct CompRenderer {
    composition: Composition,

    size: (usize, usize),

    /// Accumulates the composited result for the current frame.
    pub accumulator: Vec<u32>,
    /// Per-layer scratch buffer.
    scratch: Vec<u32>,
}

impl CompRenderer {
    pub fn new(composition: Composition, size: (usize, usize)) -> Self {
        let (w, h) = size;
        Self {
            composition,
            size,
            accumulator: vec![0u32; w * h],
            scratch: vec![0u32; w * h],
        }
    }

    pub fn resize(&mut self, size: (usize, usize)) {
        self.size = size;
        let cap = size.0 * size.1;
        self.accumulator.resize(cap, 0);
        self.scratch.resize(cap, 0);
    }

    pub fn render(&mut self, t: Duration) {
        let cap = self.size.0 * self.size.1;
        debug_assert_eq!(self.accumulator.len(), cap);
        debug_assert_eq!(self.scratch.len(), cap);

        self.accumulator.fill(0); // clear
        // render each layer into scratch, then blend -> backbuffer
        for layer in self.composition.layers() {
            layer
                .renderer
                .render(&self.accumulator, &mut self.scratch, self.size, t); // draw
            blender::blend_into(
                &mut self.accumulator,
                &self.scratch,
                layer.blend,
                layer.opacity,
            ); // composite
        }
    }
}
