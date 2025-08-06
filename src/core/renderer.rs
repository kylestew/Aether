use crate::core::{blender, composition::Composition};
use std::time::Duration;

#[typetag::serde(tag = "type")]
pub trait Renderer {
    /// Fill `dst` with this frame’s pixels (0xRRGGBB, 8‑bit per channel).
    fn render(&self, src: &[u32], dst: &mut [u32], size: (u32, u32), t: Duration);
}

pub struct CompRenderer {
    composition: Composition,

    size: (u32, u32),

    /// Accumulates the composited result for the current frame.
    pub accumulator: Vec<u32>,
    /// Per-layer scratch buffer.
    scratch: Vec<u32>,
}

impl CompRenderer {
    pub fn new(composition: Composition, size: (u32, u32)) -> Self {
        let w = size.0 as usize;
        let h = size.1 as usize;
        Self {
            composition,
            size,
            accumulator: vec![0u32; w * h],
            scratch: vec![0u32; w * h],
        }
    }

    pub fn resize(&mut self, size: (u32, u32)) {
        self.size = size;
        let cap = size.0 as usize * size.1 as usize;
        self.accumulator.resize(cap, 0);
        self.scratch.resize(cap, 0);
    }

    pub fn render(&mut self, t: Duration) {
        let cap = self.size.0 as usize * self.size.1 as usize;
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
