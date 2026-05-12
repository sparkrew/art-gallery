var sketch = function(p) {

let w, h;
let cnv;
let palette;


/* ------------------------ COLORS ------------------------ */ 



/* Creating palette from one random base hue (pure basic color/dominant) 
color family) and its variations and random saturation and random brightness */
function generatePalette(n = 7) {
  let baseHue = p.random(360);
  let colors = [];

  for (let i = 0; i < n; i++) {
    colors.push([
      (baseHue + i * p.random(20, 45)) % 360,
      /* random  saturation */
      p.random(50, 85),
      // p.random(20, 40),  // soft, pastel look
      // p.random(80, 100), // vivid, intense colors
      
      /* random brightness */
      p.random(30, 70)
      // p.random(60, 100) // airy, luminous
      // p.random(10, 40)  // dark, moody
    ]);
  }
  return colors;
}

/* Randomly selects a palette color and gives it transparency. */
function pickColor(alphaMin = 100, alphaMax = 300) {
  let c = p.random(palette);
  // return p.color(c[0], c[1], c[2], p.random(alphaMin, alphaMax));
  // return p.color(c[0], c[1], c[2], 500);
  return p.color(c[0], c[1], c[2], 75);
}




/* ------------------ SETUP AND DRAWING ------------------ */




p.setup = function() {
  let container = document.getElementById("artwork-container");
  w = container.offsetWidth;
  h = container.offsetHeight;
  cnv = p.createCanvas(w, h);
  cnv.parent("artwork-container");

  p.colorMode(p.HSB, 360, 100, 100, 255);
  p.angleMode(p.DEGREES);
  p.noStroke();
  p.frameRate(7);

  palette = generatePalette();
};

p.draw = function() {
  drawBackground();
  drawArt();
  // p.noLoop();
};




/* ------------------ BACKGROUND ------------------ */



/* Choose two random colors from the same palette and the backgroun
line by line 
*/
function drawBackground() {
  let c1 = pickColor(255, 255);
  // let c2 = pickColor(255, 255);
  let c2 = p.color(0, 0, 95);

  for (let y = 0; y < p.height; y++) {
    let t = y / p.height;
    p.stroke(p.lerpColor(c1, c2, t));
    p.line(0, y, p.width, y);
  }
  p.noStroke();
}




/* ------------------ MAIN COMPOSITION ------------------ */




function drawArt() {
  let MAX_QUADS = 30;
  // let MAX_QUADS = 10;
  let MAX_CIRCLES = 5;
  // let MAX_CIRCLES = 25;

  let quads = [];
  let circles = [];

  /* Fore each quad: 1. tries random placement 2. checks overlap 
  3. draws only if space is free
*/
  for (let i = 0; i < MAX_QUADS; i++) {
    let box = placeNonOverlappingQuad(quads, 50, 140);
    if (box) quads.push(box);
  }

  // --- Then place circles independently ---
  for (let i = 0; i < MAX_CIRCLES; i++) {
    placeNonOverlappingCircle(quads, circles);
  }
}



/* ------------------ QUADS ------------------ */




/* Try random positions until one fits, or give up. */
function placeNonOverlappingQuad(quads, minSize, maxSize, maxAttempts = 120) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let size = p.random(minSize, maxSize);
    let distortion = p.random(15, 45);
    // let distortion = p.random(2, 8);    // clean, geometric
    // let distortion = p.random(50, 90);  // chaotic, painterly

    let x = p.random(80, p.width - size - 80);
    let y = p.random(80, p.height - size - 80);

    let box = {
      x: x - distortion,
      y: y - distortion,
      w: size + 2 * distortion,
      h: size + 2 * distortion
    };

    if (quads.some(q => overlaps(box, q))) continue;

    p.push();
    p.translate(x + size / 2, y + size / 2);
    p.rotate(p.random(-6, 6));
    p.translate(-size / 2, -size / 2);

    p.fill(pickColor());
    randomQuad(0, 0, size, distortion);

    p.pop();

    return box;
  }
  return null;
}

function randomQuad(x, y, size, d) {
  p.quad(
    x + p.random(-d, d), y + p.random(-d, d),
    x + size + p.random(-d, d), y + p.random(-d, d),
    x + size + p.random(-d, d), y + size + p.random(-d, d),
    x + p.random(-d, d), y + size + p.random(-d, d)
  );
}




/* ------------------ CIRCLES ------------------ */




function placeNonOverlappingCircle(quads, circles, maxAttempts = 150) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let r = p.random(30, 80);
    let x = p.random(80 + r, p.width - 80 - r);
    let y = p.random(80 + r, p.height - 80 - r);

    let collision =
      quads.some(q => circleIntersectsBox(x, y, r, q)) ||
      circles.some(c => circleIntersectsCircle(x, y, r, c));

    if (collision) continue;

    p.fill(pickColor(120, 200));
    p.ellipse(x, y, r * 2);

    circles.push({ x, y, r });
    return;
  }
}




/* ------------------ COLLISION HELPERS ------------------ */




function circleIntersectsBox(cx, cy, r, box) {
  let closestX = p.constrain(cx, box.x, box.x + box.w);
  let closestY = p.constrain(cy, box.y, box.y + box.h);
  let dx = cx - closestX;
  let dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}

function circleIntersectsCircle(x, y, r, c) {
  let dx = x - c.x;
  let dy = y - c.y;
  let distSq = dx * dx + dy * dy;
  let minDist = r + c.r;
  return distSq < minDist * minDist;
}

function overlaps(a, b) {
  return !(
    a.x + a.w < b.x || // a is fully left of b
    a.x > b.x + b.w || // a is fully right of b
    a.y + a.h < b.y || // a is fully above b
    a.y > b.y + b.h    // a is fully below b
  );
}

};
