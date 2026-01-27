use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn render(width: u32, height: u32, time_seconds: f32) -> Vec<u8> {
    let mut buffer = vec![0_u8; (width * height * 4) as usize];

    let w = width as f32;
    let h = height as f32;

    for y in 0..height {
        for x in 0..width {
            let i = ((y * width + x) * 4) as usize;

            let fx = x as f32 / w;
            let fy = y as f32 / h;

            let wave = ((fx * 12.0 + time_seconds).sin() * (fy * 12.0 - time_seconds).cos()) * 0.5 + 0.5;
            let r = (wave * 255.0) as u8;
            let g = ((fx * 255.0) as u8).saturating_add(32);
            let b = ((fy * 255.0) as u8).saturating_add(16);

            buffer[i] = r;
            buffer[i + 1] = g;
            buffer[i + 2] = b;
            buffer[i + 3] = 255;
        }
    }

    buffer
}