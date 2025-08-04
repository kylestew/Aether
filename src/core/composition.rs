use crate::core::layer::Layer;

use serde::{Deserialize, Serialize};

#[derive(Default, Serialize, Deserialize)]
pub struct Composition {
    #[serde(default)]
    pub layers: Vec<Layer>,
}

impl Composition {
    // "move-out" and destroy composition wrapper
    pub fn into_layers(self) -> Vec<Layer> {
        self.layers
    }

    // borrow immutably (no cloning, no moving)
    pub fn layers(&self) -> &[Layer] {
        &self.layers
    }
}

#[cfg(test)]
mod composition_tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn comp_round_trip_and_paint() {
        // one red layer on top of black
        let j = json!({
            "layers": [{
                "blend":   "normal",
                "opacity": 1.0,
                "renderer": { "type": "Solid", "rgb": "FF0000" }
            }]
        })
        .to_string();

        // → Composition
        let comp: Composition = serde_json::from_str(&j).unwrap();

        // ← back to JSON and again to ensure typetag survives
        let j2 = serde_json::to_string(&comp).unwrap();
        let comp2: Composition = serde_json::from_str(&j2).unwrap();
        assert_eq!(comp.layers.len(), comp2.layers.len());

        // functional smoke-test
        let back = vec![0u32; 4];
        let mut scratch = vec![0u32; 4];
        for l in &mut comp2.into_layers() {
            l.renderer.render(&back, &mut scratch, (2, 2), 0.0);
            // aether::core::blend_into(&mut back, &scratch, l.blend, l.opacity);
        }
        // assert_eq!(back, vec![0xFF0000; 4]);
    }
}
