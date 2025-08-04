// use crate::core::layer::Renderer;
//
// /// Direction of the bars.
// #[derive(Clone, Copy)]
// pub enum BarsDir {
//     Vertical,
//     Horizontal,
// }
//
// /// SMPTE‑style color bars: R‑Y‑G‑C‑B‑M repeated.
// pub struct ColorBars {
//     dir: BarsDir,
// }
//
// impl ColorBars {
//     pub fn new(dir: BarsDir) -> Self {
//         Self { dir }
//     }
// }
//
// const COLORS: [u32; 6] = [
//     0xFF0000, // Red
//     0xFFFF00, // Yellow
//     0x00FF00, // Green
//     0x00FFFF, // Cyan
//     0x0000FF, // Blue
//     0xFF00FF, // Magenta
// ];

/*
impl Renderer for ColorBars {
    fn render(&mut self, buf: &mut [u32], (w, h): (usize, usize), _t: f32) {
        match self.dir {
            BarsDir::Vertical => {
                let bar_w = w / COLORS.len().max(1);
                for (i, &c) in COLORS.iter().enumerate() {
                    let x0 = i * bar_w;
                    let x1 = if i == COLORS.len() - 1 {
                        w
                    } else {
                        (i + 1) * bar_w
                    };
                    for y in 0..h {
                        buf[y * w + x0..y * w + x1].fill(c);
                    }
                }
            }
            BarsDir::Horizontal => {
                let bar_h = h / COLORS.len().max(1);
                for (i, &c) in COLORS.iter().enumerate() {
                    let y0 = i * bar_h;
                    let y1 = if i == COLORS.len() - 1 {
                        h
                    } else {
                        (i + 1) * bar_h
                    };
                    for y in y0..y1 {
                        buf[y * w..(y + 1) * w].fill(c);
                    }
                }
            }
        }
    }
}
*/
