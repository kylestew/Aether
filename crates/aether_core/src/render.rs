use crate::types::*;

impl Comp {
    /// Render to supplied RGBA8 buffer; buffer length must be width*height*4.
    pub fn render(&self, _t_ms: f32, out: &mut [u8]) {
        // Clear background
        fill_rgba(out, self.background, self.width, self.height);

        // Render layers bottom->top
        for layer in &self.layers {
            if !layer.base.enabled {
                continue;
            }

            match &layer.kind {
                LayerKind::Gradient(params) => {
                    render_gradient(layer, params, out, self.width, self.height);
                }
                LayerKind::Image(params) => {
                    render_image(layer, params, out, self.width, self.height);
                }
            }
        }
    }
}

fn fill_rgba(out: &mut [u8], color: [u8; 4], width: u32, height: u32) {
    for chunk in out.chunks_exact_mut(4) {
        chunk[0] = color[0]; // R
        chunk[1] = color[1]; // G
        chunk[2] = color[2]; // B
        chunk[3] = color[3]; // A
    }
}

fn render_gradient(
    layer: &Layer,
    params: &GradientParams,
    out: &mut [u8],
    comp_width: u32,
    comp_height: u32,
) {
    let inv_transform = match layer.base.transform.inverse() {
        Some(inv) => inv,
        None => return, // Skip if transform is not invertible
    };

    // Convert angle to radians and compute gradient direction vector
    let angle_rad = params.angle_deg.to_radians();
    let dir_x = angle_rad.cos();
    let dir_y = angle_rad.sin();

    // For each pixel in composition space
    for y in 0..comp_height {
        for x in 0..comp_width {
            let pixel_idx = ((y * comp_width) + x) as usize * 4;

            // Transform comp pixel to layer local coordinates
            let (local_x, local_y) = inv_transform.apply(x as f32, y as f32);

            // Calculate gradient interpolation factor
            // Use a simple normalized projection along gradient direction
            // Assume gradient spans from -0.5 to 0.5 in normalized coordinates
            let proj = (local_x - 0.5) * dir_x + (local_y - 0.5) * dir_y;
            let t = (proj + 0.5).clamp(0.0, 1.0);

            // Interpolate colors
            let src_color = [
                (params.c0[0] as f32 + (params.c1[0] as f32 - params.c0[0] as f32) * t) as u8,
                (params.c0[1] as f32 + (params.c1[1] as f32 - params.c0[1] as f32) * t) as u8,
                (params.c0[2] as f32 + (params.c1[2] as f32 - params.c0[2] as f32) * t) as u8,
                (params.c0[3] as f32 + (params.c1[3] as f32 - params.c0[3] as f32) * t) as u8,
            ];

            // Apply opacity and blend
            blend_normal(
                &mut out[pixel_idx..pixel_idx + 4],
                src_color,
                layer.base.opacity,
            );
        }
    }
}

fn render_image(
    layer: &Layer,
    params: &ImageParams,
    out: &mut [u8],
    comp_width: u32,
    comp_height: u32,
) {
    let inv_transform = match layer.base.transform.inverse() {
        Some(inv) => inv,
        None => return, // Skip if transform is not invertible
    };

    // For each pixel in composition space
    for y in 0..comp_height {
        for x in 0..comp_width {
            let pixel_idx = ((y * comp_width) + x) as usize * 4;

            // Transform comp pixel to layer local coordinates
            let (local_x, local_y) = inv_transform.apply(x as f32, y as f32);

            // Convert to image pixel coordinates
            let img_x = (local_x * params.width as f32) as i32;
            let img_y = (local_y * params.height as f32) as i32;

            // Check bounds
            if img_x < 0
                || img_y < 0
                || img_x >= params.width as i32
                || img_y >= params.height as i32
            {
                // Out of bounds - transparent
                continue;
            }

            // Sample image (nearest neighbor)
            let img_pixel_idx = ((img_y as u32 * params.width) + img_x as u32) as usize * 4;
            if img_pixel_idx + 3 < params.pixels.len() {
                let src_color = [
                    params.pixels[img_pixel_idx],
                    params.pixels[img_pixel_idx + 1],
                    params.pixels[img_pixel_idx + 2],
                    params.pixels[img_pixel_idx + 3],
                ];

                // Apply opacity and blend
                blend_normal(
                    &mut out[pixel_idx..pixel_idx + 4],
                    src_color,
                    layer.base.opacity,
                );
            }
        }
    }
}

fn blend_normal(dst: &mut [u8], src: [u8; 4], opacity: f32) {
    let src_a = (src[3] as f32 / 255.0) * opacity;
    let inv_alpha = 1.0 - src_a;

    // Normal alpha over blending
    let dst_a = dst[3] as f32 / 255.0;
    let out_a = src_a + dst_a * inv_alpha;

    if out_a > 0.0 {
        dst[0] = ((src[0] as f32 * src_a + dst[0] as f32 * dst_a * inv_alpha) / out_a) as u8;
        dst[1] = ((src[1] as f32 * src_a + dst[1] as f32 * dst_a * inv_alpha) / out_a) as u8;
        dst[2] = ((src[2] as f32 * src_a + dst[2] as f32 * dst_a * inv_alpha) / out_a) as u8;
        dst[3] = (out_a * 255.0) as u8;
    }
}
