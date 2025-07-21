mod layer;
mod renderers;

use layer::{Blend, Layer};
use renderers::gradient::VerticalGradient;

use minifb::{Key, ScaleMode, Window, WindowOptions};
use std::time::Instant;

const WIDTH: usize = 1280;
const HEIGHT: usize = 720;

fn main() {
    let mut window = Window::new(
        "Desktop-Aether v0 - ESC to quit",
        WIDTH,
        HEIGHT,
        WindowOptions {
            resize: true,
            scale_mode: ScaleMode::UpperLeft,
            ..WindowOptions::default()
        },
    )
    .expect("Unable to create window");
    window.set_target_fps(30);

    // ----- buffers -------------------------------
    let mut backbuffer = vec![0u32; WIDTH * HEIGHT];
    let mut scratch = vec![0u32; WIDTH * HEIGHT];
    let mut size = (WIDTH, HEIGHT);
    // ---------------------------------------------

    // ----- create layers -------------------------
    let mut layers: Vec<Layer> = vec![Layer::new(
        Blend::Normal,
        1.0,
        Box::new(VerticalGradient::new(0x1E90FF, 0xFF1493)),
    )];
    // ---------------------------------------------

    let start = Instant::now();
    while window.is_open() && !window.is_key_down(Key::Escape) {
        // resize bookkeeping
        let new_size = window.get_size();
        if new_size != size {
            size = new_size;
            let cap = size.0 * size.1;
            backbuffer.resize(cap, 0);
            scratch.resize(cap, 0);
        }

        // ---- render ----
        backbuffer.fill(0); // clear
        let t = (Instant::now() - start).as_secs_f32();

        // render each layer into scratch, then blend -> backbuffer
        for layer in &mut layers {
            layer.renderer.render(&mut scratch, size, t); // draw
            layer::blend_into(&mut backbuffer, &scratch, layer.blend, layer.opacity); // composite
        }

        // present
        window
            .update_with_buffer(&backbuffer, size.0, size.1)
            .unwrap();
    }
}
