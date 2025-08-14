use crate::core::layer::Blend;
use crate::core::{pack_rgb, unpack_rgb};

pub fn blend_into(dst: &mut [u32], src: &[u32], mode: Blend, opacity: f32) {
    debug_assert_eq!(dst.len(), src.len());
    let alpha = (opacity.clamp(0.0, 1.0) * 255.0).round() as u32;

    for (d, &s) in dst.iter_mut().zip(src.iter()) {
        let (dr, dg, db) = unpack_rgb(*d);
        let (sr, sg, sb) = unpack_rgb(s);

        let (mr, mg, mb) = match mode {
            Blend::Normal => (sr, sg, sb),
            Blend::Multiply => (sr * dr / 255, sg * dg / 255, sb * db / 255),
            Blend::Screen => (
                255 - ((255 - sr) * (255 - dr) / 255),
                255 - ((255 - sg) * (255 - dg) / 255),
                255 - ((255 - sb) * (255 - db) / 255),
            ),
            Blend::Overlay => (
                overlay_channel(dr, sr),
                overlay_channel(dg, sg),
                overlay_channel(db, sb),
            ),
        };

        *d = pack_rgb(
            lerp8_clamped(dr, mr, alpha),
            lerp8_clamped(dg, mg, alpha),
            lerp8_clamped(db, mb, alpha),
        );
    }
}

/// Overlay blend mode for a single channel (0..=255)
#[inline]
fn overlay_channel(base: u8, blend: u8) -> u8 {
    let b = base as u16;
    let s = blend as u16;

    if base < 128 {
        // 2 * b * s / 255  (multiply branch)
        ((2 * b * s + 127) / 255) as u8
    } else {
        // 255 - 2 * (255 - b) * (255 - s) / 255  (screen branch)
        let ib = 255u16 - b;
        let is_ = 255u16 - s;
        (255u16 - ((2 * ib * is_ + 127) / 255)) as u8
    }
}

/// Exact integer lerp with alpha in 0..=255
#[inline]
fn lerp8_clamped(a: u8, b: u8, alpha: u32) -> u8 {
    let a = a.min(255) as u16;
    let b = b.min(255) as u16;
    let alpha = alpha.min(255) as u16;
    let num = a * (255 - alpha) + b * alpha;
    ((num + 127) / 255) as u8
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::core::layer::Blend;

    #[test]
    fn overlay_channel_dark_base() {
        // Test dark base colors (< 128) - should multiply behavior
        assert_eq!(overlay_channel(64, 128), 64); // 2 * 64 * 128 / 255 ≈ 64
        assert_eq!(overlay_channel(0, 255), 0); // Black base stays black
        assert_eq!(overlay_channel(127, 255), 254); // Just under 128, full blend
    }

    #[test]
    fn overlay_channel_light_base() {
        // Test light base colors (>= 128) - should screen behavior
        assert_eq!(overlay_channel(128, 0), 1); // Overlay 128 with black
        assert_eq!(overlay_channel(255, 128), 255); // White base stays white
        assert_eq!(overlay_channel(192, 128), 192); // Light gray overlaid with mid gray
    }

    #[test]
    fn overlay_channel_midpoint() {
        // Test at the 128 boundary
        assert_eq!(overlay_channel(128, 128), 128); // Mid-gray should stay mid-gray
    }

    #[test]
    fn overlay_blend_integration() {
        let mut dst = vec![pack_rgb(64, 128, 192)]; // Dark, mid, light
        let src = vec![pack_rgb(128, 128, 128)]; // Mid-gray blend

        blend_into(&mut dst, &src, Blend::Overlay, 1.0);

        let (r, g, b) = unpack_rgb(dst[0]);

        // Dark base (64) with mid blend (128) should get darker
        assert!(r <= 64);
        // Mid base (128) with mid blend (128) should stay approximately the same (may be 128 or 129 due to rounding)
        assert!(g >= 128 && g <= 129);
        // Light base (192) with mid blend (128) should get lighter
        assert!(b >= 192);
    }

    #[test]
    fn overlay_blend_with_opacity() {
        let mut dst = vec![pack_rgb(100, 100, 100)]; // Gray base
        let src = vec![pack_rgb(200, 200, 200)]; // Light blend

        blend_into(&mut dst, &src, Blend::Overlay, 0.5);

        let (r, g, b) = unpack_rgb(dst[0]);

        // With 50% opacity, should be halfway between original and overlay result
        assert!(r > 100 && r < 200);
        assert!(g > 100 && g < 200);
        assert!(b > 100 && b < 200);
    }
}
