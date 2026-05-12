var sketch = function(p) {

/* config.js
   Everything stored under one namespace to avoid global collisions.
*/

var APP = {
  BG: [217, 226, 184],
  CENTER_FILL: [172, 225, 238],

  Y_SHIFT_RATIO: 0.17,
  CENTER_R_RATIO: 0.075,
  CM_RATIO: 0.020,

  STICK_ANGLES_DEG: [70, 110, 165, 225, 300, 375]
    .map(d => ((d % 360) + 360) % 360)
    .sort((a, b) => a - b),

  SECTOR_DRAW_ORDER: [3, 2, 0, 1, 4, 5],
  SECTOR_BG_ORDER: [4, 3, 2, 1, 0, 5],

  // rotation speed
  SHIFT_EVERY: 16,

  // palette
  PALETTES: [
    { bright: [217, 226, 184], dark: [107, 77, 1] },
    { bright: [197, 206, 164], dark: [74, 69, 17] },
    { bright: [235, 228, 198], dark: [86, 63, 8] },
    { bright: [210, 220, 190], dark: [60, 55, 20] },
    { bright: [225, 210, 170], dark: [70, 45, 5] },
    { bright: [243, 182, 182], dark: [88, 35, 20] },
  ],

  // Arc configs per sector
  SECTORS: {
    0: {
      blockGapsCm: [1.7, 3.2, 2.6, 20.6, 85],
      insideGapsCm: [
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0, 0.4, 1.3, 1.5],
        [3, 2, 4, 4],
        [0.8, 0.12, 0.25, 0.5],
      ],
      slantPct: [0.07, 0.09, 0.11, 0.21, 0.55],
      slantSign: -1,
      thicknessFactors: [
        [0.12, 1.5, 1.8, 3.0],
        [1.2, 1.6, 2.0, 4.0],
        [1.3, 1.7, 4.5, 12.0],
        [1.4, 1.9, 5.0, 27.0],
        [1.6, 2.2, 3.0, 13.0],
      ],
    },

    1: {
      blockGapsCm: [1.2, 2.9, 2.4, 15.1, 85],
      insideGapsCm: [
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0.2, 0.3, 0.8, 1.1],
        [2.2, 1.8, 2.9, 3],
        [0.8, 0.12, 0.25, 0.5],
      ],
      slantPct: [0.05, 0.07, 0.09, 0.04, 0.55],
      slantSign: -1,
      thicknessFactors: [
        [0.12, 1.5, 1.8, 3.0],
        [1.2, 1.6, 2.0, 4.0],
        [1.3, 1.7, 4.0, 10.0],
        [1.4, 1.9, 5.0, 21.0],
        [1.6, 2.2, 3.0, 13.0],
      ],
    },

    2: {
      blockGapsCm: [0.9, 2.6, 2.1, 14.7, 85],
      insideGapsCm: [
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0.2, 0.3, 0.8, 1],
        [2.2, 1.8, 2.9, 3],
        [0.8, 0.12, 0.25, 0.5],
      ],
      slantPct: [0.05, 0.07, 0.09, 0.3, 0.55],
      slantSign: -1,
      thicknessFactors: [
        [0.12, 1.5, 1.8, 3.0],
        [1.2, 1.6, 2.0, 4.0],
        [1.3, 1.7, 3.0, 8.0],
        [1.4, 1.9, 5.0, 21.0],
        [1.6, 2.2, 3.0, 13.0],
      ],
    },

    3: {
      blockGapsCm: [0.6, 2.3, 3.3, 6.7, 41.2],
      insideGapsCm: [
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0, 0.12, 0.25, 0.5],
        [1.8, 1.2, 2.1, 2.2],
        [0.8, 0.12, 0.25, 0.5],
      ],
      slantPct: [0.05, 0.07, 0.09, 0.3, 0.55],
      slantSign: -1,
      thicknessFactors: [
        [0.12, 1.5, 1.8, 3.0],
        [1.2, 1.6, 2.0, 4.0],
        [1.3, 1.7, 2.2, 6.0],
        [1.4, 1.9, 5.0, 17.0],
        [1.6, 2.2, 3.0, 13.0],
      ],
    },

    4: {
      blockGapsCm: [0.4, 2, 2.8, 3.2, 22],
      insideGapsCm: [
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0.7, 0.8, 1.6, 1.6],
        [0.8, 0.12, 0.25, 0.5],
      ],
      slantPct: [0.05, 0.07, 0.09, 0.17, 0.25],
      slantSign: -1,
      thicknessFactors: [
        [0.12, 1.5, 1.8, 3.0],
        [1.2, 1.6, 2.0, 4.0],
        [1.3, 1.7, 2.2, 5.0],
        [1.4, 1.9, 4.5, 15.0],
        [1.6, 2.2, 3.0, 28.0],
      ],
    },

    5: {
      blockGapsCm: [0.2, 1.8, 2.4, 2.6, 11.4],
      insideGapsCm: [
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0.18, 0.12, 0.25, 0.5],
        [0.005, 0.6, 1.3, 1.3],
        [7.2, 2, 3.2, 3.8],
      ],
      slantPct: [-0.09, -0.03, 0.05, 0.03, 0.18],
      slantSign: +1,
      thicknessFactors: [
        [0.12, 1.2, 1.5, 3.0],
        [1.2, 1.6, 2.0, 4.0],
        [1.3, 1.7, 2.2, 5.0],
        [1.4, 1.9, 5.0, 14.0],
        [1.6, 2.2, 3.0, 30.0],
      ],
    },
  },
};

// derived radians once
APP.STICK_ANGLES_RAD = APP.STICK_ANGLES_DEG.map(d => (d * Math.PI) / 180);


/* background.js */

APP.sectorBgColors = new Array(6);
APP.palette = { bright: APP.BG.slice(), dark: [107, 77, 1] };

APP.pickRandomPalette = function () {
  const pal = APP.PALETTES[Math.floor(Math.random() * APP.PALETTES.length)];
  APP.palette = { bright: pal.bright.slice(), dark: pal.dark.slice() };

  APP.BG = APP.palette.bright.slice();
};

APP.initSectorBgColors = function () {
  const bright = p.color(...APP.palette.bright);
  const dark   = p.color(...APP.palette.dark);

  for (let i = 0; i < APP.SECTOR_BG_ORDER.length; i++) {
    const sectorIndex = APP.SECTOR_BG_ORDER[i];
    const t = i / (APP.SECTOR_BG_ORDER.length - 1);
    APP.sectorBgColors[sectorIndex] = p.lerpColor(bright, dark, t);
  }
};

APP.rotateSectorBgColors = function () {
  const old = APP.sectorBgColors.slice();
  for (let i = 0; i < 6; i++) {
    APP.sectorBgColors[i] = old[(i + 1) % 6];
  }
};

APP.drawSectorBackground = function (stickAngles, R) {
  p.noStroke();

  for (let i = 0; i < APP.SECTOR_BG_ORDER.length; i++) {
    const sectorIndex = APP.SECTOR_BG_ORDER[i];
    p.fill(APP.sectorBgColors[sectorIndex]);

    const a0 = stickAngles[sectorIndex];
    const a1 = stickAngles[(sectorIndex + 1) % stickAngles.length];

    APP.drawWedgeFilled(a0, a1, R, 140);
  }
};

APP.drawWedgeFilled = function (a0, a1, rOuter, steps = 120) {
  const d = APP.angleDelta(a0, a1);

  p.beginShape();
  p.vertex(0, 0);
  for (let k = 0; k <= steps; k++) {
    const tt = k / steps;
    const a = a0 + d * tt;
    p.vertex(p.cos(a) * rOuter, p.sin(a) * rOuter);
  }
  p.endShape(p.CLOSE);
};


/* render.js */

APP.drawCenterCircle = function (r, s) {
  p.noStroke();
  p.fill(...APP.CENTER_FILL);
  p.circle(0, 0, 2 * r);

  p.noFill();
  p.stroke(0);
  p.strokeWeight(p.max(0.8, 0.0012 * s));
  p.circle(0, 0, 2 * r);
};

APP.getLocalBounds = function (yShift) {
  return {
    left: -p.width / 2,
    right: p.width / 2,
    top: -(p.height / 2 - yShift),
    bottom: p.height / 2 + yShift,
  };
};

APP.rayToEdgeT = function (dx, dy, b) {
  let tEdge = Infinity;

  if (dx > 0) tEdge = p.min(tEdge, b.right / dx);
  else if (dx < 0) tEdge = p.min(tEdge, b.left / dx);

  if (dy > 0) tEdge = p.min(tEdge, b.bottom / dy);
  else if (dy < 0) tEdge = p.min(tEdge, b.top / dy);

  return tEdge;
};

APP.drawSticks = function (anglesRad, r, s, bounds) {
  p.stroke(0);

  const stickInner = r;
  const segs = 80;

  for (const a of anglesRad) {
    const dx = p.cos(a);
    const dy = p.sin(a);

    const tEdge = APP.rayToEdgeT(dx, dy, bounds);

    const x1 = dx * stickInner;
    const y1 = dy * stickInner;
    const x2 = dx * (tEdge + 2);
    const y2 = dy * (tEdge + 2);

    const w0 = p.max(2, 0.0025 * s);
    const w1 = p.max(6, 0.02 * s);

    for (let i = 0; i < segs; i++) {
      const u0 = i / segs;
      const u1 = (i + 1) / segs;

      const ax = p.lerp(x1, x2, u0);
      const ay = p.lerp(y1, y2, u0);
      const bx = p.lerp(x1, x2, u1);
      const by = p.lerp(y1, y2, u1);

      p.strokeWeight(p.lerp(w0, w1, u0));
      p.line(ax, ay, bx, by);
    }
  }
};

APP.drawLamps = function (r, s) {
  p.rectMode(p.CENTER);
  p.noStroke();
  p.fill(247, 255, 247);

  const lampsTop = [
    { y: -(r * 3.8), w: 0.023 * s, h: 0.2 * s },
    { y: -(r * 2.2), w: 0.023 * s, h: 0.05 * s },
    { y: -(r * 1.5), w: 0.02 * s, h: 0.018 * s },
    { y: -(r * 1.11), w: 0.0125 * s, h: 0.016 * s },
  ];

  const lampsBottom = [
    { y: r * 1.18, w: 0.0125 * s, h: 0.026 * s },
    { y: r * 1.84, w: 0.02 * s, h: 0.035 * s },
    { y: r * 2.76, w: 0.023 * s, h: 0.06 * s },
    { y: r * 6.4, w: 0.025 * s, h: 0.45 * s },
  ];

  for (const L of lampsTop) p.rect(0, L.y, L.w, L.h);
  for (const L of lampsBottom) p.rect(0, L.y, L.w, L.h);
};

APP.angleDelta = function (a0, a1) {
  let d = (a1 - a0) % p.TWO_PI;
  if (d < 0) d += p.TWO_PI;
  return d;
};

APP.drawSlantedArc = function (rStart, rEnd, a0, a1, sw, steps = 180) {
  const d = APP.angleDelta(a0, a1);

  p.strokeWeight(sw);
  for (let k = 0; k < steps; k++) {
    const t0 = k / steps;
    const t1 = (k + 1) / steps;

    const ang0 = a0 + d * t0;
    const ang1 = a0 + d * t1;

    const rr0 = p.lerp(rStart, rEnd, t0);
    const rr1 = p.lerp(rStart, rEnd, t1);

    p.line(
      p.cos(ang0) * rr0, p.sin(ang0) * rr0,
      p.cos(ang1) * rr1, p.sin(ang1) * rr1
    );
  }
};

APP.drawSectorArcBlocksSlanted = function (stickAngles, sectorIndex, rCircle, cm, TH, cfg) {
  const a0 = stickAngles[sectorIndex];
  const a1 = stickAngles[(sectorIndex + 1) % stickAngles.length];

  p.noFill();
  p.stroke(0);
  p.strokeCap(p.SQUARE);

  let baseR = rCircle;

  for (let b = 0; b < cfg.blockGapsCm.length; b++) {
    baseR += cfg.blockGapsCm[b] * cm;

    let rr = baseR;
    const inside = cfg.insideGapsCm[b];
    const thickFactors = cfg.thicknessFactors[b];

    for (let i = 0; i < inside.length; i++) {
      rr += inside[i] * cm;

      const rStart = rr;
      const rEnd = rr + (rr * cfg.slantPct[b] * cfg.slantSign);

      const sw = thickFactors[i] * TH;
      APP.drawSlantedArc(rStart, rEnd, a0, a1, sw, 220);
    }
  }
};


/* sketch.js */

p.setup = function() {
  let container = document.getElementById("artwork-container");
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  let canvas = p.createCanvas(w, h);
  canvas.parent("artwork-container");
  p.pixelDensity(1);

  APP.SHIFT_EVERY = Math.floor(1 + Math.random() * 35);

  APP.pickRandomPalette();

  APP.initSectorBgColors();

  console.log("SHIFT_EVERY =", APP.SHIFT_EVERY, "palette =", APP.palette);
};

p.windowResized = function() {
  let container = document.getElementById("artwork-container");
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  p.resizeCanvas(w, h);
};

p.draw = function() {
  p.background(...APP.BG);

  p.push();

  const yShift = APP.Y_SHIFT_RATIO * p.height;
  p.translate(p.width / 2, p.height / 2 - yShift);

  const s = p.min(p.width, p.height);
  const r = APP.CENTER_R_RATIO * s;

  const cm = APP.CM_RATIO * s;
  const TH = p.max(1, 0.002 * s);

  const R = p.max(p.width, p.height) * 1.6;

  if (p.frameCount % APP.SHIFT_EVERY === 0) APP.rotateSectorBgColors();

  APP.drawSectorBackground(APP.STICK_ANGLES_RAD, R);

  APP.drawCenterCircle(r, s);

  const bounds = APP.getLocalBounds(yShift);
  APP.drawSticks(APP.STICK_ANGLES_RAD, r, s, bounds);

  APP.drawLamps(r, s);

  for (const idx of APP.SECTOR_DRAW_ORDER) {
    APP.drawSectorArcBlocksSlanted(APP.STICK_ANGLES_RAD, idx, r, cm, TH, APP.SECTORS[idx]);
  }

  p.pop();
};

};
