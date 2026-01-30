use wasm_bindgen::prelude::*;

#[derive(Clone, Copy)]
struct Rng(u32);

impl Rng {
    fn new(seed: u32) -> Self {
        Self(seed ^ 0x9E37_79B9)
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

/// HSL [0..1] -> RGB
fn hsl_to_rgb(h: f32, s: f32, l: f32) -> [u8; 3] {
    let h = h - h.floor();
    let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
    let hp = h * 6.0;
    let x = c * (1.0 - ((hp % 2.0) - 1.0).abs());

    let (r1, g1, b1) = if (0.0..1.0).contains(&hp) {
        (c, x, 0.0)
    } else if (1.0..2.0).contains(&hp) {
        (x, c, 0.0)
    } else if (2.0..3.0).contains(&hp) {
        (0.0, c, x)
    } else if (3.0..4.0).contains(&hp) {
        (0.0, x, c)
    } else if (4.0..5.0).contains(&hp) {
        (x, 0.0, c)
    } else {
        (c, 0.0, x)
    };

    let m = l - c / 2.0;
    [
        clamp_u8((r1 + m) * 255.0),
        clamp_u8((g1 + m) * 255.0),
        clamp_u8((b1 + m) * 255.0),
    ]
}

// logical coords like nannou
#[inline]
fn logical_to_px(x: f32, logical_w: f32, width: u32) -> f32 {
    (x + logical_w / 2.0) / logical_w * (width as f32)
}
#[inline]
fn logical_to_py(y: f32, logical_h: f32, height: u32) -> f32 {
    (logical_h / 2.0 - y) / logical_h * (height as f32)
}

#[inline]
fn put_pixel(buf: &mut [u8], width: u32, height: u32, x: i32, y: i32, rgb: [u8; 3], a: f32) {
    if x < 0 || y < 0 || x >= width as i32 || y >= height as i32 {
        return;
    }
    let i = ((y as u32 * width + x as u32) * 4) as usize;
    let a = a.clamp(0.0, 1.0);
    buf[i] = blend(buf[i], rgb[0], a);
    buf[i + 1] = blend(buf[i + 1], rgb[1], a);
    buf[i + 2] = blend(buf[i + 2], rgb[2], a);
    buf[i + 3] = 255;
}

fn draw_rect_logical(
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
    a: f32,
) {
    let x0 = cx - rw / 2.0;
    let x1 = cx + rw / 2.0;
    let y0 = cy - rh / 2.0;
    let y1 = cy + rh / 2.0;

    let px0 = logical_to_px(x0, logical_w, width).floor() as i32;
    let px1 = logical_to_px(x1, logical_w, width).ceil() as i32;
    let py0 = logical_to_py(y1, logical_h, height).floor() as i32;
    let py1 = logical_to_py(y0, logical_h, height).ceil() as i32;

    for y in py0..py1 {
        for x in px0..px1 {
            put_pixel(buf, width, height, x, y, rgb, a);
        }
    }
}

/// Filled ellipse in pixel coords
fn draw_ellipse_filled_px(
    buf: &mut [u8],
    width: u32,
    height: u32,
    cx: f32,
    cy: f32,
    rx: f32,
    ry: f32,
    rgb: [u8; 3],
    a: f32,
) {
    if rx <= 0.0 || ry <= 0.0 {
        return;
    }
    let min_x = (cx - rx).floor() as i32;
    let max_x = (cx + rx).ceil() as i32;
    let min_y = (cy - ry).floor() as i32;
    let max_y = (cy + ry).ceil() as i32;

    let inv_rx2 = 1.0 / (rx * rx);
    let inv_ry2 = 1.0 / (ry * ry);

    for y in min_y..=max_y {
        for x in min_x..=max_x {
            let dx = (x as f32 + 0.5) - cx;
            let dy = (y as f32 + 0.5) - cy;
            let v = dx * dx * inv_rx2 + dy * dy * inv_ry2;
            if v <= 1.0 {
                put_pixel(buf, width, height, x, y, rgb, a);
            }
        }
    }
}

/// Stroked ellipse ring in pixel coords
fn draw_ellipse_stroke_px(
    buf: &mut [u8],
    width: u32,
    height: u32,
    cx: f32,
    cy: f32,
    r: f32,
    stroke: f32,
    rgb: [u8; 3],
    a: f32,
) {
    let outer = r + stroke * 0.5;
    let inner = (r - stroke * 0.5).max(0.0);
    let o2 = outer * outer;
    let i2 = inner * inner;

    let min_x = (cx - outer).floor() as i32;
    let max_x = (cx + outer).ceil() as i32;
    let min_y = (cy - outer).floor() as i32;
    let max_y = (cy + outer).ceil() as i32;

    for y in min_y..=max_y {
        for x in min_x..=max_x {
            let dx = (x as f32 + 0.5) - cx;
            let dy = (y as f32 + 0.5) - cy;
            let d2 = dx * dx + dy * dy;
            if d2 <= o2 && d2 >= i2 {
                put_pixel(buf, width, height, x, y, rgb, a);
            }
        }
    }
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

    // Background
    clear(&mut buf, [0, 0, 0, 255]);

    let logical_w = width as f32;
    let logical_h = height as f32;

    // Seed like "new random values every frame" (nannou update()).
    // Using time makes it change; quantize time to mimic frames.
    let frame = (time_seconds * 60.0).floor() as u32;
    let seed = width ^ height.rotate_left(16) ^ frame.wrapping_mul(1664525);
    let mut rng = Rng::new(seed);

    // In your update(): baldessari[i].x randomized, hall[i].y randomized.
    // We'll generate those 24 points on the fly.

    // Colors
    let blue_rect = hsl_to_rgb(230.0 / 360.0, 1.0, 0.5);

    // ---- First group: alternating rect / ellipse for 24 positions ----
    let mut rect_flag = true;

    for _i in 0..24 {
        let x = rng.range_f32(-logical_w / 2.0, logical_w / 2.0);
        let y = rng.range_f32(-logical_h / 2.0, logical_h / 2.0);

        let wichita = rng.range_f32(42.0, 99.0);
        let vera = rng.range_f32(17.0, 77.0);
        let molnar = rng.range_f32(200.0, 300.0);

        if rect_flag {
            // draw.rect().color(hsl(230/360,1,0.5)).x_y(x,y).w_h(vera,molnar)
            draw_rect_logical(
                &mut buf,
                width,
                height,
                logical_w,
                logical_h,
                x,
                y,
                vera,
                molnar,
                blue_rect,
                1.0,
            );
            rect_flag = false;
        } else {
            // draw.ellipse().color(hsla(molnar/360,1,0.5,0.5)).radius(wichita)
            let rgb = hsl_to_rgb((molnar / 360.0) % 1.0, 1.0, 0.5);
            let cxp = logical_to_px(x, logical_w, width);
            let cyp = logical_to_py(y, logical_h, height);
            let rp = wichita * (width as f32 / logical_w); // keep proportional
            draw_ellipse_filled_px(&mut buf, width, height, cxp, cyp, rp, rp, rgb, 0.5);
            rect_flag = true;
        }
    }

    // ---- Second group: 24 bars at x=-40, random y ----
    for _i in 0..24 {
        let y = rng.range_f32(-logical_h / 2.0, logical_h / 2.0);
        let vera = rng.range_f32(17.0, 27.0);
        // draw.rect().color(hsla(230/360,1,1,0.7)).x_y(-40,y).w_h(100,vera)
        let bar_rgb = hsl_to_rgb(230.0 / 360.0, 1.0, 1.0);
        draw_rect_logical(
            &mut buf,
            width,
            height,
            logical_w,
            logical_h,
            -40.0,
            y,
            100.0,
            vera,
            bar_rgb,
            0.7,
        );
    }

    // ---- Two circles (one thick stroke, one tiny) ----
    // draw.ellipse().no_fill().stroke_color(hsl(hu/360,1,0.5)).stroke_weight(14).x_y(-100,100).radius(100)
    let hu = 330.0 + frame as f32; // mimic model.hu += 1 each update
    let stroke_rgb = hsl_to_rgb((hu / 360.0) % 1.0, 1.0, 0.5);
    let cxp = logical_to_px(-100.0, logical_w, width);
    let cyp = logical_to_py(100.0, logical_h, height);
    let rp = 100.0 * (width as f32 / logical_w);
    let stroke_px = 14.0 * (width as f32 / logical_w);
    draw_ellipse_stroke_px(&mut buf, width, height, cxp, cyp, rp, stroke_px, stroke_rgb, 1.0);

    // draw tiny dot circle at (-50,100), radius 1
    let tiny_rgb = hsl_to_rgb(350.0 / 360.0, 1.0, 0.5);
    let cxp2 = logical_to_px(-50.0, logical_w, width);
    let cyp2 = logical_to_py(100.0, logical_h, height);
    let r2 = (1.0 * (width as f32 / logical_w)).max(1.0);
    draw_ellipse_filled_px(&mut buf, width, height, cxp2, cyp2, r2, r2, tiny_rgb, 1.0);

    buf
}
