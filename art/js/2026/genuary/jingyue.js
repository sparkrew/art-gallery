var sketch = function(p) {
    let seed = 42;
    let tubes = [];
    let bricks = [];

    // Colors
    const PRIMARY_GOLD = [201, 162, 39];
    const BRONZE = [139, 105, 20];
    const HIGHLIGHT = [232, 213, 144];
    const SHADOW = [60, 45, 15];
    const BG_COLOR = [15, 12, 10];

    // for circle
    let circleX, circleY, circleRadius;

    p.setup = function() {
        let container = document.getElementById("artwork-container");
        let w = container.offsetWidth;
        let h = container.offsetHeight;
        let canvas = p.createCanvas(w, h);
        canvas.parent("artwork-container");
        p.pixelDensity(2);
        p.noLoop();
        generateArt();
    };

    p.windowResized = function() {
        let container = document.getElementById("artwork-container");
        let w = container.offsetWidth;
        let h = container.offsetHeight;
        p.resizeCanvas(w, h);
        generateArt();
    };

    p.mousePressed = function() {
        seed = p.floor(p.random(999999));
        generateArt();
    };

    p.keyPressed = function() {
        if (p.key === ' ' || p.key === 'r' || p.key === 'R') {
            seed = p.floor(p.random(999999));
            generateArt();
        }
        if (p.key === 's' || p.key === 'S') {
            p.saveCanvas('industrial-tessellation-' + seed, 'png');
        }
    };

    function generateArt() {
        p.randomSeed(seed);
        p.noiseSeed(seed);

        tubes = [];
        bricks = [];

        // define the circle
        circleX = p.width * 0.2;
        circleY = p.height * 0.35;
        circleRadius = p.min(p.width, p.height) * 0.22;

        generateBricksAndTubes();

        p.redraw();
    }

    function generateBricksAndTubes() {
        let brickW = p.width / 55;

        let columnTypes = [];
        let col = 0;
        while (col < 55) {
            let squareCols = p.floor(p.random(1, 3));
            for (let i = 0; i < squareCols && col < 55; i++) {
                columnTypes[col] = 'square9';
                col++;
            }
            let rectCols = p.floor(p.random(1, 3));
            for (let i = 0; i < rectCols && col < 55; i++) {
                columnTypes[col] = 'horizontal';
                col++;
            }
        }

        let columnHeights = [];
        for (let col = 0; col < 55; col++) {
            let xProgress = col / 55;
            let noiseVal = p.noise(col * 0.2, seed * 0.01);

            let baseColumnHeight;
            if (xProgress < 0.35) {
                baseColumnHeight = p.height + 50;
            } else {
                let rightProgress = (xProgress - 0.35) / 0.65;
                baseColumnHeight = p.height * (1.0 - rightProgress * 0.45) * (0.7 + noiseVal * 0.3);
            }

            if (columnTypes[col] === 'square9') {
                columnHeights[col] = baseColumnHeight;
            } else {
                columnHeights[col] = baseColumnHeight * 0.65;
            }
        }

        for (let col = 0; col < 55; col++) {
            let x = col * brickW + brickW / 2;
            let colType = columnTypes[col];
            let maxY = columnHeights[col];

            let y = 0;
            while (y < maxY) {
                if (colType === 'square9') {
                    bricks.push({
                        x: x,
                        y: y,
                        w: brickW,
                        h: brickW,
                        depth: p.noise(x * 0.01, y * 0.01) * 0.4,
                        type: 'square9'
                    });
                    y += brickW;
                } else {
                    let rectH = brickW * 0.28;
                    bricks.push({
                        x: x,
                        y: y,
                        w: brickW,
                        h: rectH,
                        depth: p.noise(x * 0.01, y * 0.01) * 0.4,
                        type: 'horizontal'
                    });
                    y += rectH;
                }
            }
        }

        let baseRadius = p.min(p.width, p.height) * 0.022;

        function canPlaceTube(x, y) {
            let colIndex = p.floor(x / brickW);
            if (colIndex < 0 || colIndex >= 55) return false;
            if (y < columnHeights[colIndex]) return false;
            let colXProgress = colIndex / 55;
            if (colXProgress < 0.35 && columnTypes[colIndex] !== 'horizontal') return false;
            return true;
        }

        function overlapsExisting(x, y, r) {
            for (let t of tubes) {
                let dx = x - t.x;
                let dy = y - t.y;
                let dist = p.sqrt(dx * dx + dy * dy);
                if (dist < r + t.radius - 1) return true;
            }
            return false;
        }

        let tubeRow = 0;
        for (let y = 0; y < p.height + baseRadius * 2; y += baseRadius * 1.8) {
            let offsetX = (tubeRow % 2) * baseRadius;
            for (let x = offsetX; x < p.width + baseRadius * 2; x += baseRadius * 2) {
                if (!canPlaceTube(x, y)) continue;

                let sizeVar = p.random(0.7, 1.3);
                let radius = baseRadius * sizeVar;

                tubes.push({
                    x: x + p.random(-2, 2),
                    y: y + p.random(-2, 2),
                    radius: radius,
                    depth: p.random(0.4),
                    brightness: p.random(0.5, 1.0)
                });
            }
            tubeRow++;
        }

        let mediumRadius = baseRadius * 0.6;
        for (let y = 0; y < p.height + mediumRadius * 2; y += mediumRadius * 1.5) {
            let offsetX = (p.floor(y / mediumRadius) % 2) * mediumRadius * 0.75;
            for (let x = offsetX; x < p.width + mediumRadius * 2; x += mediumRadius * 1.5) {
                if (!canPlaceTube(x, y)) continue;

                let radius = mediumRadius * p.random(0.8, 1.1);
                if (overlapsExisting(x, y, radius)) continue;

                tubes.push({
                    x: x,
                    y: y,
                    radius: radius,
                    depth: p.random(0.4),
                    brightness: p.random(0.5, 1.0)
                });
            }
        }

        let smallRadius = baseRadius * 0.4;
        for (let y = 0; y < p.height + smallRadius * 2; y += smallRadius * 1.3) {
            let offsetX = (p.floor(y / smallRadius) % 2) * smallRadius * 0.65;
            for (let x = offsetX; x < p.width + smallRadius * 2; x += smallRadius * 1.3) {
                if (!canPlaceTube(x, y)) continue;

                let radius = smallRadius * p.random(0.85, 1.1);
                if (overlapsExisting(x, y, radius)) continue;

                tubes.push({
                    x: x,
                    y: y,
                    radius: radius,
                    depth: p.random(0.4),
                    brightness: p.random(0.5, 0.95)
                });
            }
        }
    }

    function getMetallicColor(depth, brightness) {
        let r, g, b;

        if (brightness > 0.85) {
            let t = (brightness - 0.85) * 6.67;
            r = p.lerp(PRIMARY_GOLD[0], HIGHLIGHT[0], t);
            g = p.lerp(PRIMARY_GOLD[1], HIGHLIGHT[1], t);
            b = p.lerp(PRIMARY_GOLD[2], HIGHLIGHT[2], t);
        } else if (brightness > 0.4) {
            let t = (brightness - 0.4) / 0.45;
            r = p.lerp(BRONZE[0], PRIMARY_GOLD[0], t);
            g = p.lerp(BRONZE[1], PRIMARY_GOLD[1], t);
            b = p.lerp(BRONZE[2], PRIMARY_GOLD[2], t);
        } else {
            let t = brightness / 0.4;
            r = p.lerp(SHADOW[0], BRONZE[0], t);
            g = p.lerp(SHADOW[1], BRONZE[1], t);
            b = p.lerp(SHADOW[2], BRONZE[2], t);
        }

        let depthFactor = 1 - depth * 0.4;
        return p.color(r * depthFactor, g * depthFactor, b * depthFactor);
    }

    p.draw = function() {
        p.background(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2]);

        for (let t of tubes) {
            drawTube(t);
        }

        for (let b of bricks) {
            drawBrick(b);
        }

        drawCircleFocal();
    };

    function drawBrick(b) {
        let baseColor = getMetallicColor(b.depth, 0.7);

        p.push();
        p.translate(b.x, b.y);

        if (b.type === 'square9') {
            p.fill(baseColor);
            p.noStroke();
            p.rect(-b.w/2, 0, b.w, b.h);

            p.fill(BG_COLOR[0] + 6, BG_COLOR[1] + 5, BG_COLOR[2] + 3);
            let margin = b.w * 0.1;
            let holeSize = (b.w - margin * 2) / 3 * 0.78;
            let spacing = (b.w - margin * 2) / 3;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let hx = -b.w/2 + margin + i * spacing + (spacing - holeSize) / 2;
                    let hy = margin + j * spacing + (spacing - holeSize) / 2;
                    p.rect(hx, hy, holeSize, holeSize);
                }
            }

            let hlColor = getMetallicColor(b.depth * 0.5, 0.85);
            p.fill(hlColor);
            p.rect(-b.w/2 + b.w * 0.05, b.h * 0.02, b.w * 0.9, b.h * 0.06);

        } else if (b.type === 'horizontal') {
            p.fill(baseColor);
            p.noStroke();
            p.rect(-b.w/2, 0, b.w, b.h);

            let hlColor = getMetallicColor(b.depth * 0.4, 0.88);
            p.fill(hlColor);
            p.rect(-b.w/2 + b.w * 0.04, b.h * 0.08, b.w * 0.92, b.h * 0.18);
        }

        p.pop();
    }

    function drawTube(t) {
        p.push();
        p.translate(t.x, t.y);

        let outerColor = getMetallicColor(t.depth, t.brightness * 0.9);
        p.noStroke();
        p.fill(outerColor);
        p.ellipse(0, 0, t.radius * 2, t.radius * 2);

        let wallThickness = t.radius * 0.18;
        let innerR = t.radius - wallThickness;
        let shadowColor = getMetallicColor(t.depth + 0.25, t.brightness * 0.45);
        p.fill(shadowColor);
        p.ellipse(0, -0.5, innerR * 2, innerR * 2);

        p.fill(BG_COLOR[0] + 5, BG_COLOR[1] + 4, BG_COLOR[2] + 2);
        p.ellipse(0, -1, innerR * 1.4, innerR * 1.4);

        if (t.brightness > 0.6) {
            let hlColor = getMetallicColor(t.depth * 0.3, 0.95);
            p.noFill();
            p.stroke(p.red(hlColor), p.green(hlColor), p.blue(hlColor), 100);
            p.strokeWeight(0.8);
            p.arc(0, 0, t.radius * 1.7, t.radius * 1.7, p.PI + 0.5, p.TWO_PI - 0.3);
        }

        p.pop();
    }

    function drawCircleFocal() {
        p.push();
        p.translate(circleX, circleY);

        p.drawingContext.save();
        p.drawingContext.beginPath();
        p.drawingContext.arc(0, 0, circleRadius, 0, Math.PI * 2);
        p.drawingContext.clip();

        let angle = p.PI / 6;
        p.rotate(angle);

        let colW = circleRadius * 0.2;
        let startX = -circleRadius * 1.5;
        let endX = circleRadius * 1.5;

        let colIndex = 0;
        for (let x = startX; x < endX; x += colW) {
            let isSquareCol = (colIndex % 2 === 0);

            if (isSquareCol) {
                let squareSize = colW * 0.98;
                for (let y = -circleRadius * 1.5; y < circleRadius * 1.5; y += squareSize) {
                    let brightness = 0.6 + p.noise(x * 0.05, y * 0.05) * 0.35;
                    let baseColor = getMetallicColor(0.15, brightness);

                    p.fill(baseColor);
                    p.noStroke();
                    p.rect(x, y, squareSize, squareSize);
                }
            } else {
                let rectH = colW * 0.28;
                for (let y = -circleRadius * 1.5; y < circleRadius * 1.5; y += rectH) {
                    let brightness = 0.6 + p.noise(x * 0.05, y * 0.05) * 0.3;
                    let baseColor = getMetallicColor(0.12, brightness);

                    p.fill(baseColor);
                    p.noStroke();
                    p.rect(x, y, colW * 0.98, rectH * 0.95);
                }
            }
            colIndex++;
        }

        p.drawingContext.restore();
        p.pop();
    }
};
