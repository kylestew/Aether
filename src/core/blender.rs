use crate::core::layer::Blend;
use crate::core::{pack_rgb, split_rgb};

pub fn blend_into(dst: &mut [u32], src: &[u32], mode: Blend, opacity: f32) {
    debug_assert_eq!(dst.len(), src.len());
    let alpha = (opacity.clamp(0.0, 1.0) * 255.0).round() as u32;

    for (d, &s) in dst.iter_mut().zip(src.iter()) {
        let (dr, dg, db) = split_rgb(*d);
        let (sr, sg, sb) = split_rgb(s);

        let (mr, mg, mb) = match mode {
            Blend::Normal => (sr, sg, sb),
            Blend::Multiply => (sr * dr / 255, sg * dg / 255, sb * db / 255),
            Blend::Screen => (
                255 - ((255 - sr) * (255 - dr) / 255),
                255 - ((255 - sg) * (255 - dg) / 255),
                255 - ((255 - sb) * (255 - db) / 255),
            ),
        };

        *d = pack_rgb(
            lerp8_clamped(dr, mr, alpha),
            lerp8_clamped(dg, mg, alpha),
            lerp8_clamped(db, mb, alpha),
        );
    }
}

/// Exact integer lerp with alpha in 0..=255
#[inline]
fn lerp8_clamped(a: u32, b: u32, alpha: u32) -> u8 {
    let a = a.min(255) as u16;
    let b = b.min(255) as u16;
    let alpha = alpha.min(255) as u16;
    let num = a * (255 - alpha) + b * alpha;
    ((num + 127) / 255) as u8
}
