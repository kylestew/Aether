use crate::core::{pack_rgb, renderer::Renderer, split_rgb};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Invert;

#[typetag::serde]
impl Renderer for Invert {
    fn render(&self, src: &[u32], dst: &mut [u32], _size: (u32, u32), _t: std::time::Duration) {
        for (s, d) in src.iter().zip(dst.iter_mut()) {
            let (r, g, b) = invert(split_rgb(*s));
            *d = pack_rgb(r, g, b);
        }
    }
}

fn invert((r, g, b): (u8, u8, u8)) -> (u8, u8, u8) {
    (255 - r, 255 - g, 255 - b)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;

    #[test]
    fn invert_deser_and_render() {
        let json = r#"
{
    "type": "Invert"
}"#;

        let r: Box<dyn Renderer> = serde_json::from_str(json).unwrap();

        let src = vec![pack_rgb(255, 128, 64); 4];
        let mut dst = vec![0u32; 4];
        r.render(&src, &mut dst, (2, 2), std::time::Duration::from_secs(0));

        let expected = vec![pack_rgb(0, 127, 191); 4];
        assert_eq!(dst, expected);
    }
}
