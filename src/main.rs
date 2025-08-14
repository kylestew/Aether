use aether::core::{composition::Composition, renderer::CompRenderer};

use minifb::{Key, ScaleMode, Window, WindowOptions};
use std::time::Instant;

const WIDTH: usize = 1280;
const HEIGHT: usize = 720;

fn main() {
    /* ---------------------------------------------------------------
     * 1.  Load the JSON file passed as first CLI arg
     * ------------------------------------------------------------- */
    // Use CLI arg if present, else "default.json"
    let path: String = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "default.json".to_string());

    let json = std::fs::read_to_string(&path).expect("unable to read file");
    let comp: Composition = serde_json::from_str(&json).expect("invalid Composition JSON");

    let mut size = (WIDTH, HEIGHT);
    let mut renderer = CompRenderer::new(comp, (size.0 as u32, size.1 as u32)); // comp now owned by renderer

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
    let mut frame_count = 0u64;
    let mut fps_timer = Instant::now();

    while window.is_open() && !window.is_key_down(Key::Escape) {
        // resize bookkeeping
        let new_size = window.get_size();
        if new_size != size {
            size = new_size;
            renderer.resize((size.0 as u32, size.1 as u32));
        }

        // ---- render ----
        let t = Instant::now() - start;
        renderer.render(t);

        // present
        window
            .update_with_buffer(&renderer.accumulator, size.0, size.1)
            .unwrap();

        // FPS calculation
        frame_count += 1;
        let fps_elapsed = fps_timer.elapsed();
        if fps_elapsed.as_secs_f64() >= 1.0 {
            let fps = frame_count as f64 / fps_elapsed.as_secs_f64();
            frame_count = 0;
            fps_timer = Instant::now();

            // Update window title with FPS
            window.set_title(&format!("Desktop‑Aether – {} – {:.1} FPS", path, fps));
        }
    }
}
