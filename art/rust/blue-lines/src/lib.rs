use wasm_bindgen::prelude::*;

#[derive(Clone, Copy)]
struct Rng(u32);

impl Rng {
    fn new(seed: u32) -> Self {
        Self(seed ^ 0xA3C5_9E37u32)
    }

    fn next_u32(&mut self) -> u32 {
        // xorshift32
        let mut x = self.0;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        self.0 = x;
        x
    }

    fn f32_01(&mut self) -> f32 {
        (self.next_u32() as f32) / (u32::MAX as f32 + 1.0)
    }

    fn range_f32(&mut self, lo: f32, hi: f32) -> f32 {
        lo + (hi - lo) * self.f32_01()
    }

    fn range_i32(&mut self, lo: i32, hi: i32) -> i32 {
        let span = (hi - lo + 1) as u32;
        lo + (self.next_u32() % span) as i32
    }
}

#[inline]
fn clamp_u8(x: f32) -> u8 {
    x.clamp(0.0, 255.0) as u8
}

#[inline]
fn blend(dst: u8, src: u8, a: f32) -> u8 {
    let d = dst as f32;
    let s = src as f32;
    clamp_u8(s * a + d * (1.0 - a))
}

fn clear(buf: &mut [u8], rgba: [u8; 4]) {
    for px in buf.chunks_exact_mut(4) {
        px[0] = rgba[0];
        px[1] = rgba[1];
        px[2] = rgba[2];
        px[3] = rgba[3];
    }
}

#[inline]
fn logical_to_px(x: f32, w: f32, width: u32) -> i32 {
    ((x + w / 2.0) / w * width as f32).floor() as i32
}
#[inline]
fn logical_to_py(y: f32, h: f32, height: u32) -> i32 {
    ((h / 2.0 - y) / h * height as f32).floor() as i32
}

fn draw_rect(
    buf: &mut [u8],
    width: u32,
    height: u32,
    logical_w: f32,
    logical_h: f32,
    cx: f32,
    cy: f32,
    rw: f32,
    rh: f32,
    rgb: [u8; 3],
    alpha: f32,
) {
    if width == 0 || height == 0 {
        return;
    }

    let half_w = rw / 2.0;
    let half_h = rh.abs() / 2.0; // handle negative heights

    let x0 = cx - half_w;
    let x1 = cx + half_w;

    let y0 = cy - half_h;
    let y1 = cy + half_h;

    // map to pixels
    let mut px0 = logical_to_px(x0, logical_w, width);
    let mut px1 = logical_to_px(x1, logical_w, width);
    let mut py0 = logical_to_py(y1, logical_h, height); // top
    let mut py1 = logical_to_py(y0, logical_h, height); // bottom

    // clamp
    px0 = px0.clamp(0, width as i32);
    px1 = px1.clamp(0, width as i32);
    py0 = py0.clamp(0, height as i32);
    py1 = py1.clamp(0, height as i32);

    if px0 >= px1 || py0 >= py1 {
        return;
    }

    let w_usize = width as usize;
    let a = alpha.clamp(0.0, 1.0);

    for py in py0..py1 {
        let row = py as usize * w_usize;
        for px in px0..px1 {
            let i = (row + px as usize) * 4;
            buf[i] = blend(buf[i], rgb[0], a);
            buf[i + 1] = blend(buf[i + 1], rgb[1], a);
            buf[i + 2] = blend(buf[i + 2], rgb[2], a);
            buf[i + 3] = 255;
        }
    }
}

fn playground(logical_h: f32, rng: &mut Rng) -> Vec<(f32, f32)> {
    let mut v = Vec::new();

    let wichita = rng.range_i32(42, 66);
    let lullaby = logical_h / (wichita as f32);

    let mut y1 = logical_h / 2.0;
    for _ in 0..wichita {
        let y2 = y1 - lullaby - rng.range_f32(-5.0, -1.0);
        v.push((y1, y2));
        y1 = y1 - lullaby;
    }

    v
}

#[wasm_bindgen]
pub fn render(width: u32, height: u32, time_seconds: f32) -> Vec<u8> {
    let len = (width as usize)
        .saturating_mul(height as usize)
        .saturating_mul(4);
    let mut buf = vec![0u8; len];

    if width == 0 || height == 0 {
        return buf;
    }

    let logical_w = width as f32;
    let logical_h = height as f32;

    clear(&mut buf, [0, 0, 0, 255]);

    let seed = width
        ^ height.rotate_left(16)
        ^ ((time_seconds * 1000.0) as u32).wrapping_mul(2654435761);
    let mut rng = Rng::new(seed);

    let occam = playground(logical_h, &mut rng);

    for (y1, y2) in occam.iter().copied() {
        let mut x = -logical_w / 2.0 + rng.range_f32(-77.0, 77.0);
        let off = y2 - y1; // negative in your code; we handle abs() inside draw_rect

        while x < logical_w / 2.0 {
            let a = rng.range_f32(0.3, 0.9);
            draw_rect(
                &mut buf,
                width,
                height,
                logical_w,
                logical_h,
                x,
                y1,
                111.0,
                off,
                [255, 255, 255],
                a,
            );

            x = x + 111.0 + rng.range_f32(-77.0, 7.0);
        }
    }

    buf
}
