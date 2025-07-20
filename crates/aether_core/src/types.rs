use serde::{Deserialize, Serialize};

pub type PixelBuf = Vec<u8>; // RGBA8

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub enum BlendMode {
    Normal,
    // TODO(P2): Add, Multiply, Screen, etc.
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct Transform2D {
    pub m00: f32,
    pub m01: f32,
    pub m02: f32,
    pub m10: f32,
    pub m11: f32,
    pub m12: f32,
    // last row implicit [0 0 1]
}

impl Transform2D {
    pub fn identity() -> Self {
        Self {
            m00: 1.0,
            m01: 0.0,
            m02: 0.0,
            m10: 0.0,
            m11: 1.0,
            m12: 0.0,
        }
    }

    pub fn apply(&self, x: f32, y: f32) -> (f32, f32) {
        let tx = x * self.m00 + y * self.m01 + self.m02;
        let ty = x * self.m10 + y * self.m11 + self.m12;
        (tx, ty)
    }

    pub fn inverse(&self) -> Option<Transform2D> {
        let det = self.m00 * self.m11 - self.m01 * self.m10;
        if det.abs() < 1e-10 {
            return None; // Not invertible
        }

        let inv_det = 1.0 / det;
        Some(Transform2D {
            m00: self.m11 * inv_det,
            m01: -self.m01 * inv_det,
            m02: (self.m01 * self.m12 - self.m11 * self.m02) * inv_det,
            m10: -self.m10 * inv_det,
            m11: self.m00 * inv_det,
            m12: (self.m10 * self.m02 - self.m00 * self.m12) * inv_det,
        })
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BaseProps {
    pub transform: Transform2D, // local->comp
    pub opacity: f32,           // 0..1
    pub blend: BlendMode,
    pub enabled: bool,
    pub name: Option<String>,
}

impl Default for BaseProps {
    fn default() -> Self {
        Self {
            transform: Transform2D::identity(),
            opacity: 1.0,
            blend: BlendMode::Normal,
            enabled: true,
            name: None,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GradientParams {
    pub c0: [u8; 4],
    pub c1: [u8; 4],
    pub angle_deg: f32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ImageParams {
    pub width: u32,
    pub height: u32,
    /// Raw RGBA8 pixel data; length = w*h*4
    #[serde(with = "serde_bytes")]
    pub pixels: Vec<u8>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum LayerKind {
    Gradient(GradientParams),
    Image(ImageParams),
    // TODO(P2): Invert(AdjustInvertParams),
    // TODO(P2): Blur(BlurParams),
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Layer {
    pub id: u32,
    #[serde(flatten)]
    pub base: BaseProps,
    pub kind: LayerKind,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Comp {
    pub width: u32,
    pub height: u32,
    pub background: [u8; 4], // RGBA background color
    pub layers: Vec<Layer>,
}
