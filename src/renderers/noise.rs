use crate::layer::Renderer;
use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};

/// Greyscale noise; new frame every call (animated).
pub struct Noise {
    rng: SmallRng,
}

impl Noise {
    pub fn new(seed: u64) -> Self {
        Self {
            rng: SmallRng::seed_from_u64(seed),
        }
    }
}

// impl Renderer for Noise {
//     fn render(&mut self, buf: &mut [u32], _size: (usize, usize), _t: f32) {
//         for px in buf {
//             let g = self.rng.r#gen::<u8>() as u32;
//             *px = (g << 16) | (g << 8) | g;
//         }
//     }
// }
