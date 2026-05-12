var sketch = function(p) {
  const BLUE = "#000000";
  const RECT_WIDTH = 576;
  const RECT_HEIGHT = 1024;
  const CELL_W = 72;
  const CELL_H = 4;
  const LEVELS = 8;
  const LIGHT_BLUE = "#ffffff";
  const DARK_BLUE = "#0a0f1f";
  const BLUE_BIAS = "#3b6ce3";
  const BLUE_BIAS_STRENGTH = 0.2;
  const VINEGAR_LEVELS = 4;
  const VINEGAR_LIGHT = "#ffffff";
  const VINEGAR_TINT = "#f3e1a2";
  const VINEGAR_MAX = 0.35;
  const RED_LEVELS = 5;
  const RED_LIGHT = "#ffffff";
  const RED_DARK = "#b00010";
  const RED_MAX = 0.4;
  const RED_P = 0;
  const RED_Q = 1 / 16;
  const GRAIN_RANGE = 60;
  const GRAIN_ALPHA = 70;
  let palette = [];
  let vinegarLight;
  let vinegarTint;
  let redLight;
  let redDark;
  let grainLayer;

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let canvas = p.createCanvas(w, h);
    canvas.parent("artwork-container");
    palette = buildPalette();
    vinegarLight = p.color(VINEGAR_LIGHT);
    vinegarTint = p.color(VINEGAR_TINT);
    redLight = p.color(RED_LIGHT);
    redDark = p.color(RED_DARK);
    grainLayer = buildGrainLayer();
  };

  p.draw = function() {
    p.background(BLUE);
    p.noStroke();
    p.fill(255);
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, p.height / 2, RECT_WIDTH, RECT_HEIGHT);

    const grid = getGrid();
    p.randomSeed(7);
    drawCells(grid);
    drawGrain(grid);
  };

  p.windowResized = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    p.resizeCanvas(w, h);
  };

  function getGrid() {
    const halfW = RECT_WIDTH / 2;
    const halfH = RECT_HEIGHT / 2;
    const left = p.width / 2 - halfW;
    const right = p.width / 2 + halfW;
    const top = p.height / 2 - halfH;
    const bottom = p.height / 2 + halfH;
    const cols = p.floor(RECT_WIDTH / CELL_W);
    const rows = p.floor(RECT_HEIGHT / CELL_H);
    const cellW = RECT_WIDTH / cols;
    const cellH = RECT_HEIGHT / rows;

    return { left, right, top, bottom, cols, rows, cellW, cellH };
  }

  function drawCells(grid) {
    p.rectMode(p.CORNER);
    p.noStroke();

    const redProbs = getRedProbs();
    for (let col = 0; col < grid.cols; col += 1) {
      let level = p.floor(p.random(LEVELS));
      let vinegar = p.floor(p.random(VINEGAR_LEVELS));
      const redStart = initialRedLevel(col, grid.cols);
      let redLevel = redStart;
      for (let row = 0; row < grid.rows; row += 1) {
        const x = grid.left + col * grid.cellW;
        const y = grid.top + row * grid.cellH;
        const vinegarT = vinegar / (VINEGAR_LEVELS - 1);
        const weight = vinegarT * VINEGAR_MAX;
        const vinegarColor = p.lerpColor(vinegarLight, vinegarTint, vinegarT);
        let mixed = p.lerpColor(palette[level], vinegarColor, weight);
        const redT = redLevel / (RED_LEVELS - 1);
        const redWeight = redT * RED_MAX;
        const redColor = p.lerpColor(redLight, redDark, redT);
        mixed = p.lerpColor(mixed, redColor, redWeight);
        p.fill(mixed);
        p.rect(x, y, grid.cellW, grid.cellH);
        level = stepLevel(level);
        vinegar = stepVinegar(vinegar);
        redLevel = stepRed(redLevel, redProbs);
      }
    }
  }

  function buildPalette() {
    const light = p.color(LIGHT_BLUE);
    const dark = p.color(DARK_BLUE);
    const bias = p.color(BLUE_BIAS);
    const colors = [];
    for (let i = 0; i < LEVELS; i += 1) {
      const t = i / (LEVELS - 1);
      const base = p.lerpColor(light, dark, t);
      const shift = p.sin(p.PI * t) * BLUE_BIAS_STRENGTH;
      colors.push(p.lerpColor(base, bias, shift));
    }
    return colors;
  }

  function stepLevel(level) {
    const roll = p.random();
    if (roll < 0.25) level -= 1;
    else if (roll < 0.375) level += 1;
    return p.constrain(level, 0, LEVELS - 1);
  }

  function stepVinegar(level) {
    const roll = p.random();
    if (roll < 0.25) level -= 1;
    else if (roll < 0.375) level += 1;
    return p.constrain(level, 0, VINEGAR_LEVELS - 1);
  }

  function initialRedLevel(col, cols) {
    const band = 2;
    const start = p.floor((cols - band) / 2);
    const end = start + band;
    return col >= start && col < end ? RED_LEVELS - 1 : 0;
  }

  function getRedProbs() {
    const pUp = RED_P;
    const pDown = RED_Q;
    const pStay = p.constrain(1 - pUp - pDown, 0, 1);
    return { pUp, pDown, pStay };
  }

  function stepRed(level, probs) {
    const roll = p.random();
    if (roll < probs.pDown) level -= 1;
    else if (roll < probs.pDown + probs.pUp) level += 1;
    return p.constrain(level, 0, RED_LEVELS - 1);
  }

  function buildGrainLayer() {
    const layer = p.createGraphics(RECT_WIDTH, RECT_HEIGHT);
    layer.pixelDensity(1);
    layer.noSmooth();
    p.randomSeed(13);
    layer.loadPixels();
    for (let i = 0; i < layer.pixels.length; i += 4) {
      const v = 128 + p.floor(p.random(-GRAIN_RANGE, GRAIN_RANGE));
      layer.pixels[i] = v;
      layer.pixels[i + 1] = v;
      layer.pixels[i + 2] = v;
      layer.pixels[i + 3] = GRAIN_ALPHA;
    }
    layer.updatePixels();
    return layer;
  }

  function drawGrain(grid) {
    if (!grainLayer) return;
    p.push();
    p.blendMode(p.SOFT_LIGHT);
    p.image(grainLayer, grid.left, grid.top, RECT_WIDTH, RECT_HEIGHT);
    p.pop();
  }
};
