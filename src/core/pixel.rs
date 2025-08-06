// core/pixel.rs
#[cfg(target_arch = "wasm32")]
#[inline]
pub fn pack_rgb(r: u8, g: u8, b: u8) -> u32 {
    u32::from_le_bytes([r, g, b, 255]) // bytes: R G B A  (Uint8Array zero-copy)
}
#[cfg(target_arch = "wasm32")]
#[inline]
pub fn split_rgb(c: u32) -> (u32, u32, u32) {
    (c & 0xFF, (c >> 8) & 0xFF, (c >> 16) & 0xFF)
}

#[cfg(not(target_arch = "wasm32"))]
#[inline]
pub fn pack_rgb(r: u8, g: u8, b: u8) -> u32 {
    ((r as u32) << 16) | ((g as u32) << 8) | (b as u32) // numeric 0x00RRGGBB (minifb)
}
#[cfg(not(target_arch = "wasm32"))]
#[inline]
pub fn split_rgb(c: u32) -> (u32, u32, u32) {
    ((c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF)
}
