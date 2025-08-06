use crate::core::{pack_rgb, renderer::Renderer};
use rand::rngs::SmallRng;
use rand::{Rng, SeedableRng};
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct Noise {
    /// Seed for random number generation (defaults to 0)
    #[serde(default)]
    seed: u64,
}

#[typetag::serde]
impl Renderer for Noise {
    fn render(&self, _src: &[u32], dst: &mut [u32], _size: (u32, u32), t: Duration) {
        // Create a new RNG for this frame using seed + time for variation
        // This approach matches the JavaScript version's Math.random() per frame
        let frame_seed = self.seed.wrapping_add(t.as_millis() as u64);
        let mut rng = SmallRng::seed_from_u64(frame_seed);

        // Generate random grayscale noise for each pixel
        for px in dst.iter_mut() {
            let gray = rng.gen_range(0..=255u8);
            *px = pack_rgb(gray, gray, gray);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;

    #[test]
    fn noise_deser_and_render() {
        let json = r#"
{
    "type": "Noise",
    "seed": 12345
}"#;

        let r: Box<dyn Renderer> = serde_json::from_str(json).unwrap();
        let mut dst = vec![0u32; 4];
        r.render(&[], &mut dst, (2, 2), Duration::from_millis(0));

        // Check that all pixels have been set (not zero)
        // and that they're grayscale (R == G == B)
        for &pixel in &dst {
            assert_ne!(pixel, 0, "Pixel should not be black/zero");
            let r = (pixel >> 16) & 0xFF;
            let g = (pixel >> 8) & 0xFF;
            let b = pixel & 0xFF;
            assert_eq!(r, g, "Red and Green channels should be equal for grayscale");
            assert_eq!(
                g, b,
                "Green and Blue channels should be equal for grayscale"
            );
        }
    }

    #[test]
    fn noise_different_seeds_produce_different_output() {
        let noise1 = Noise { seed: 123 };
        let noise2 = Noise { seed: 456 };

        let mut dst1 = vec![0u32; 4];
        let mut dst2 = vec![0u32; 4];

        let t = Duration::from_millis(0);
        noise1.render(&[], &mut dst1, (2, 2), t);
        noise2.render(&[], &mut dst2, (2, 2), t);

        // Different seeds should produce different results
        assert_ne!(
            dst1, dst2,
            "Different seeds should produce different noise patterns"
        );
    }

    #[test]
    fn noise_optional_seed_deserialization() {
        // Test with explicit seed
        let json_with_seed = r#"
{
    "type": "Noise",
    "seed": 42
}"#;
        let r1: Box<dyn Renderer> = serde_json::from_str(json_with_seed).unwrap();

        // Test without seed (should default to 0)
        let json_without_seed = r#"
{
    "type": "Noise"
}"#;
        let r2: Box<dyn Renderer> = serde_json::from_str(json_without_seed).unwrap();

        // Both should deserialize successfully
        let mut dst1 = vec![0u32; 4];
        let mut dst2 = vec![0u32; 4];

        let t = Duration::from_millis(0);
        r1.render(&[], &mut dst1, (2, 2), t);
        r2.render(&[], &mut dst2, (2, 2), t);

        // Both should produce valid noise (non-zero pixels)
        for &pixel in &dst1 {
            assert_ne!(
                pixel, 0,
                "Pixel with explicit seed should not be black/zero"
            );
        }
        for &pixel in &dst2 {
            assert_ne!(pixel, 0, "Pixel with default seed should not be black/zero");
        }

        // Different seeds should produce different results
        assert_ne!(
            dst1, dst2,
            "Explicit seed vs default seed should produce different patterns"
        );
    }
}
