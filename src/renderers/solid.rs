use crate::core::layer::Renderer;
use serde::{Deserialize, Serialize};
use serde_with::{hex::Hex, serde_as};

#[serde_as]
#[derive(Debug, Serialize, Deserialize)]
struct Solid {
    // packed 0xRRGGBB
    #[serde_as(as = "Hex")]
    rgb: [u8; 3],
}

#[typetag::serde]
impl Renderer for Solid {
    fn render(&self, _src: &[u32], dst: &mut [u32], _size: (usize, usize), _t: f32) {
        let [r, g, b] = self.rgb;
        let packed = ((r as u32) << 16) | ((g as u32) << 8) | (b as u32); // 0xRRGGBB
        dst.fill(packed);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;

    #[test]
    fn solid_deser_and_render() {
        let json = r#"
{
    "type": "Solid",
    "rgb": "00FF00"
}"#;

        let r: Box<dyn Renderer> = serde_json::from_str(json).unwrap();
        let mut dst = vec![0u32; 4];
        r.render(&[], &mut dst, (2, 2), 0.0);

        assert_eq!(dst, vec![0x00FF00; 4]);
    }
}
