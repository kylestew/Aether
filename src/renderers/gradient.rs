use crate::core::renderer::Renderer;
use serde::{Deserialize, Serialize};
use serde_with::{hex::Hex, serde_as};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, Default)]
#[serde(rename_all = "lowercase")]
pub enum Direction {
    #[default]
    Vertical,
    Horizontal,
}

/// Generic 2‑colour gradient
#[serde_as]
#[derive(Debug, Serialize, Deserialize)]
pub struct Gradient {
    #[serde_as(as = "Hex")]
    rgb_a: [u8; 3],
    #[serde_as(as = "Hex")]
    rgb_b: [u8; 3],

    #[serde(default)]
    direction: Direction,
}

#[typetag::serde]
impl Renderer for Gradient {
    fn render(&self, _src: &[u32], dst: &mut [u32], (w, h): (u32, u32), _t: std::time::Duration) {
        let color_a = pack_color(self.rgb_a);
        let color_b = pack_color(self.rgb_b);

        match self.direction {
            Direction::Vertical => fill_vertical(dst, w as usize, h as usize, color_a, color_b),
            Direction::Horizontal => fill_horizontal(dst, w as usize, h as usize, color_a, color_b),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;

    #[test]
    fn gradient_deser_and_render() {
        let json = r#"
{
    "type": "Gradient",
    "rgb_a": "FF0000",
    "rgb_b": "00FF00",
    "direction": "horizontal"
}"#;

        let r: Box<dyn Renderer> = serde_json::from_str(json).unwrap();
        let mut dst = vec![0u32; 3]; // horizontal strip - 3 pixels
        r.render(&[], &mut dst, (3, 1), std::time::Duration::from_secs(0));

        assert_eq!(
            dst,
            vec![
                pack_color([255, 0, 0]),
                pack_color([128, 128, 0]),
                pack_color([0, 255, 0]),
            ]
        );
    }
}

/* ---------- helpers ---------- */
#[inline]
fn pack_color(c: [u8; 3]) -> u32 {
    let [r, g, b] = c;
    // Equivalent to u32::from_be_bytes([0, r, g, b])
    ((r as u32) << 16) | ((g as u32) << 8) | (b as u32)
}

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
    let (ar, ag, ab) = split_rgb(a);
    let (br, bg, bb) = split_rgb(b);

    let lerp = |x: u8, y: u8| -> u8 {
        ((x as f32) + (y as f32 - x as f32) * t)
            .round()
            .clamp(0.0, 255.0) as u8
    };

    pack_color([lerp(ar, br), lerp(ag, bg), lerp(ab, bb)])
}

#[inline]
fn split_rgb(c: u32) -> (u8, u8, u8) {
    (
        ((c >> 16) & 0xFF) as u8,
        ((c >> 8) & 0xFF) as u8,
        (c & 0xFF) as u8,
    )
}
