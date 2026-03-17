new p5(function (p) {
    let w = 0;
    let h = 0;
    let particles = [];
    let xirod = null;
    const PARTICLE_COUNT = 60;

    // Palette in HSL: background wash, teal, gold, cyan, magenta
    const COLORS = [
        [160, 80, 65],  // teal
        [45, 90, 65],  // gold
        [180, 100, 60], // cyan
        [330, 100, 70], // pink/magenta (matches header CSS)
        [200, 80, 75],  // sky blue
    ];

    // ---------- resize helpers ----------

    function containerSize() {
        const el = document.getElementById("header-sketch");
        if (!el) return {w: 400, h: 130};
        const r = el.getBoundingClientRect();
        return {w: r.width || 400, h: r.height || 130};
    }

    function resizeCanvasToHeader() {
        const s = containerSize();
        w = s.w;
        h = s.h;
        if (p._renderer) {
            p.resizeCanvas(w, h);
        } else {
            p.createCanvas(w, h);
        }
    }

    // ---------- particles ----------

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const col = COLORS[Math.floor(p.random(COLORS.length))];
            particles.push({
                x: p.random(w),
                y: p.random(h),
                r: p.random(6, 18),
                speed: p.random(0.05, 0.3),
                angle: p.random(p.TWO_PI),
                hue: col[0],
                sat: col[1],
                lit: col[2],
            });
        }
    }

    // ---------- per-character text drawing ----------

    function drawGenerativeText(str, cx, cy, size, noiseScale, ampX, ampY, baseColorIdx, t) {
        p.textSize(size);
        p.textAlign(p.CENTER, p.CENTER);

        // Measure total width so we can center-justify char by char
        let totalW = 0;
        for (let i = 0; i < str.length; i++) {
            totalW += p.textWidth(str[i]);
        }

        let curX = cx - totalW / 2;

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            const cw = p.textWidth(ch);

            // Noise seed is unique per character and drifts over time
            const nx = p.noise(i * 0.4 + t * 0.3, 0);
            const ny = p.noise(0, i * 0.4 + t * 0.3 + 100);

            let ox = (nx - 0.5) * 2 * ampX;
            let oy = (ny - 0.5) * 2 * ampY;

            // Mouse/touch repulsion
            const charCX = curX + cw / 2;
            const dx = charCX - p.mouseX;
            const dy = cy - p.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const threshold = 80;
            if (dist < threshold && dist > 0) {
                const force = (threshold - dist) / threshold;
                ox += (dx / dist) * force * 18;
                oy += (dy / dist) * force * 12;
            }

            // Color: cycle through palette based on character index + time
            const colorIdx = (baseColorIdx + i + Math.floor(t * 0.4)) % COLORS.length;
            const col = COLORS[colorIdx];
            // Brightness flicker per character via noise
            const litNoise = p.noise(i * 0.7 + t * 0.5, 50);
            const lit = col[2] + (litNoise - 0.5) * 18;

            p.fill(col[0], col[1], p.constrain(lit, 45, 95), 0.92);
            p.noStroke();
            p.text(ch, curX + cw / 2 + ox, cy + oy);

            curX += cw;
        }
    }

    // ---------- p5 lifecycle ----------

    p.preload = function () {
        xirod = p.loadFont("Xirod.otf");
    };

    p.setup = function () {
        p.pixelDensity(1);
        const seed = Date.now();
        p.randomSeed(seed);
        p.noiseSeed(seed);
        resizeCanvasToHeader();
        p.colorMode(p.HSL, 360, 100, 100, 1);
        createParticles();
        p.frameRate(30);
    };

    p.windowResized = function () {
        resizeCanvasToHeader();
        createParticles();
    };

    p.draw = function () {
        const t = p.frameCount * 0.015;

        p.clear();
        p.noStroke();

        // Dark wash for contrast
        p.fill(220, 100, 5, 0.45);
        p.rect(0, 0, w, h);

        // --- background particles ---
        particles.forEach(function (pt) {
            pt.angle += pt.speed * 0.012;
            const radius = pt.r * 3.5;
            const x = pt.x + p.cos(pt.angle) * radius;
            const y = pt.y + p.sin(pt.angle) * radius;

            p.fill(pt.hue, pt.sat, pt.lit, 0.28);
            p.ellipse(x, y, pt.r * 2, pt.r * 2);
            p.fill((pt.hue + 40) % 360, pt.sat, pt.lit + 10, 0.12);
            p.ellipse(x, y, pt.r * 4, pt.r * 4);
        });

        // --- drifting diagonal lines ---
        p.stroke(160, 70, 65, 0.2);
        p.strokeWeight(1);
        for (let i = 0; i < 6; i++) {
            const y1 = (h / 6) * i + (p.frameCount * 0.18) % (h / 3);
            p.line(0, y1, w, y1 + 35);
        }
        p.noStroke();

        // --- generative text ---
        if (xirod) {
            p.textFont(xirod);
        }

        // Compute a readable font size based on canvas width
        const titleSize = p.constrain(w * 0.055, 22, 52);
        const subSize = p.constrain(w * 0.026, 13, 22);

        // Vertical layout: three lines distributed in the canvas
        const lineSpacing = h / 4;
        const line1Y = lineSpacing * 0.9;
        const line2Y = lineSpacing * 1.9;
        const line3Y = lineSpacing * 2.85;

        // Noise amplitudes: title moves more, subtitles less
        drawGenerativeText(
            "Vernissage d'Art Algorithmique",
            w / 2, line1Y, titleSize,
            0.3, 3.5, 2.5,
            0, t
        );
        drawGenerativeText(
            "8 avril 2026",
            w / 2, line2Y, subSize,
            0.25, 2, 1.5,
            2, t
        );
        drawGenerativeText(
            "Universite de Montreal",
            w / 2, line3Y, subSize,
            0.25, 2, 1.5,
            4, t
        );
    };

}, "header-sketch");
