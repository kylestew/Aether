// use crate::core::layer::Renderer;

#[derive(Clone, Copy)]
pub enum Direction {
    Vertical,
    Horizontal,
}

/// Generic 2‑colour gradient
pub struct Gradient {
    // a: u32,
    // b: u32,
    // dir: Direction,
}

// impl Gradient {
//     pub fn new(a: u32, b: u32, dir: Direction) -> Self {
//         Self { a, b, dir }
//     }
// }

/*
impl Renderer for Gradient {
    fn render(&self, buf: &mut [u32], (w, h): (usize, usize), _t: f32) {
        match self.dir {
            Direction::Vertical => fill_vertical(buf, w, h, self.a, self.b),
            Direction::Horizontal => fill_horizontal(buf, w, h, self.a, self.b),
        }
    }
}

/* ---------- helpers ---------- */

fn fill_vertical(buf: &mut [u32], w: usize, h: usize, a: u32, b: u32) {
    for y in 0..h {
        let t = y as f32 / (h - 1) as f32;
        let c = lerp_color(a, b, t);
        buf[y * w..(y + 1) * w].fill(c);
    }
}

fn fill_horizontal(buf: &mut [u32], w: usize, h: usize, a: u32, b: u32) {
    // compute one row then copy
    let mut row = Vec::with_capacity(w);
    for x in 0..w {
        let t = x as f32 / (w - 1) as f32;
        row.push(lerp_color(a, b, t));
    }
    for y in 0..h {
        buf[y * w..(y + 1) * w].copy_from_slice(&row);
    }
}

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
*/
