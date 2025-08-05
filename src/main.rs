use aether::core::{composition::Composition, renderer::CompRenderer};

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

    let mut size = (WIDTH, HEIGHT);
    let mut renderer = CompRenderer::new(comp, size); // comp now owned by renderer

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

    let start = Instant::now();
    while window.is_open() && !window.is_key_down(Key::Escape) {
        // resize bookkeeping
        let new_size = window.get_size();
        if new_size != size {
            size = new_size;
            renderer.resize(size);
        }

        // ---- render ----
        let t = Instant::now() - start;
        renderer.render(t);

        // present
        window
            .update_with_buffer(&renderer.accumulator, size.0, size.1)
            .unwrap();
    }
}
