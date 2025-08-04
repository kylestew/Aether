use aether::core::{blender, composition::Composition};

use minifb::{Key, ScaleMode, Window, WindowOptions};
use std::time::Instant;

const WIDTH: usize = 1280;
const HEIGHT: usize = 720;

fn main() {
    /* ---------------------------------------------------------------
     * 1.  Load the JSON file passed as first CLI arg
     * ------------------------------------------------------------- */
    let path = std::env::args()
        .nth(1)
        .expect("Usage: cargo run -- <file.json>");

    let json = std::fs::read_to_string(&path).expect("unable to read file");
    let comp: Composition = serde_json::from_str(&json).expect("invalid Composition JSON");

    let mut window = Window::new(
        &format!("Desktop‑Aether – {}", path),
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

    let mut backbuffer = vec![0u32; WIDTH * HEIGHT];
    let mut scratch = vec![0u32; WIDTH * HEIGHT];
    let mut size = (WIDTH, HEIGHT);
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

        // TODO: redo the way we composite so the buffer situation isn't exposed and
        // duplicated in web version

        // ---- render ----
        backbuffer.fill(0); // clear
        let t = (Instant::now() - start).as_secs_f32();

        // render each layer into scratch, then blend -> backbuffer
        for layer in comp.layers() {
            layer.renderer.render(&backbuffer, &mut scratch, size, t); // draw
            blender::blend_into(&mut backbuffer, &scratch, layer.blend, layer.opacity); // composite
        }

        // present
        window
            .update_with_buffer(&backbuffer, size.0, size.1)
            .unwrap();
    }
}
