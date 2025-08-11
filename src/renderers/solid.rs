use crate::core::{pack_rgb, renderer::Renderer};
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
    fn render(&self, _src: &[u32], dst: &mut [u32], _size: (u32, u32), _t: std::time::Duration) {
        let [r, g, b] = self.rgb;
        let packed = pack_rgb(r, g, b);
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
    "rgb": "66AAFF"
}"#;

        let r: Box<dyn Renderer> = serde_json::from_str(json).unwrap();
        let mut dst = vec![0u32; 4];
        r.render(&[], &mut dst, (2, 2), std::time::Duration::from_secs(0));

        assert_eq!(dst, vec![0x0066AAFF; 4]);
    }
}
