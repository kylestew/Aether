use crate::core::{pack_rgb, renderer::Renderer, unpack_rgb};
use serde::{Deserialize, Serialize};
use serde_with::{hex::Hex, serde_as};

#[serde_as]
#[derive(Debug, Serialize, Deserialize)]
pub struct Threshold {
    threshold: f64,

    #[serde_as(as = "Hex")]
    background: [u8; 3],
    #[serde_as(as = "Hex")]
    foreground: [u8; 3],
}

#[typetag::serde]
impl Renderer for Threshold {
    fn render(&self, src: &[u32], dst: &mut [u32], _size: (u32, u32), _t: std::time::Duration) {
        // Scale threshold in [0.0, 1.0] to 0..=255
        let th_255 = (self.threshold.clamp(0.0, 1.0) * 255.0) as u32;

        let [fr, fg, fb] = self.foreground;
        let fg = pack_rgb(fr, fg, fb);
        let [br, bg, bb] = self.background;
        let bg = pack_rgb(br, bg, bb);

        for (out, &px) in dst.iter_mut().zip(src.iter()) {
            let (r, g, b) = unpack_rgb(px); // (u8,u8,u8)

            // Approx luma: (77*r + 150*g + 29*b) >> 8  ≈ 0..255
            let y = (77u32 * r as u32 + 150u32 * g as u32 + 29u32 * b as u32) >> 8;

            *out = if y > th_255 { fg } else { bg };
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::core::pack_rgb;
    use serde_json;

    #[test]
    fn threshold_deser_and_render() {
        let json = r#"
{
    "type": "Threshold",
    "threshold": 0.5,
    "background": "FF0000",
    "foreground": "00FF00"
}"#;

        let r: Box<dyn Renderer> = serde_json::from_str(json).unwrap();
        let src = vec![
            pack_rgb(0, 0, 0),
            pack_rgb(92, 92, 92),
            pack_rgb(128, 128, 128),
            pack_rgb(255, 255, 255),
        ];
        let mut dst = vec![0u32; 4];
        r.render(&src, &mut dst, (2, 2), std::time::Duration::from_secs(0));

        let bg = pack_rgb(255, 0, 0);
        let fg = pack_rgb(0, 255, 0);
        assert_eq!(dst, vec![bg, bg, fg, fg])
    }
}
