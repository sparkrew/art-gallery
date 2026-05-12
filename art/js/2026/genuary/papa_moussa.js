var sketch = function(p) {
  let w, h;
  let cnv;

  const minRadius = 13;
  const maxRadius = 35;
  const stepRadius = 1;
  const steps = 1000000;
  const circles = [];

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    w = container.offsetWidth;
    h = container.offsetHeight;
    cnv = p.createCanvas(w, h);
    cnv.parent("artwork-container");
    p.angleMode(p.DEGREES);
  };

  // detection de chevauchements entre les cercles et definition des limites de l'emboitement
  function overlap(x, y, r) {
    if (x - r < 3 || x + r > p.width || y - r < p.height - (p.height / 3) || y + r > p.height - 3) return true;
    return circles.find(c => p.dist(c.x, c.y, x, y) <= c.r + r);
  }

  // https://editor.p5js.org/thibpat/sketches/ZxZYBdaAU
  // empilement de cercles en evitant les chevauchements mais en minimisant aussi la distance entre les perimetres des cercles
  function drawingCircles() {
    p.strokeWeight(3);
    for (let i = 0; i < steps; i++) {
      const x = p.random(0, p.width);
      const y = p.random(0, p.height);
      for (let r = minRadius; r <= maxRadius; r += stepRadius) {
        const col = overlap(x, y, r);
        if (col && r == minRadius) break;
        if (col) {
          r -= stepRadius;
          p.strokeWeight(3.4);
          p.fill(125, 125, 125);
          p.circle(x, y, r * 2);
          circles.push({ x, y, r });
          break;
        }
      }
    }
  }

  // genere un motif s'apparentant a un mur de brique avec alternance de carres et de rectangles
  function SquareRec() {
    rec = false;
    black = false;

    i = 0;
    j = 0;
    h = p.random(25, 35);
    w = p.random(60, 70);
    while (j <= p.height) {
      while (i <= p.width) {
        if (rec == false) {
          (black) ? p.fill(0, 0, 0) : p.fill(255, 255, 255);
          p.square(i, j, h);
          black = !black;
          i = i + h;
        } else {
          (black) ? p.fill(0, 0, 0) : p.fill(255, 255, 255);
          p.rect(i, j, w, h);
          black = !black;
          i = i + w;
        }
      }
      i = 0;
      rec = !rec;
      j = j + h;
    }
  }

  // genere des grilles remplies de carres recursifs
  function recursiveSquare() {
    j = 0;
    while (j < p.width - 35) {
      espacement = p.random(50, 100);

      NbrSquareX = Math.floor(p.random(0, 4));
      i = 0;
      while (i < p.height) {
        for (let k = 0; k < NbrSquareX; k = k + 1) {
          p.square(j + (35 * k), i, 35);
          p.push();
          p.translate(j + (35 * k), i);
          o = 0;
          q = 0;
          while (o < 35) {
            while (q < 35) {
              p.fill(0);

              p.stroke(255, 255, 255);
              p.strokeWeight(1.5);
              p.square(q, o, 35 / 3);
              q = q + 35 / 3;
            }
            q = 0;
            o = o + 35 / 3;
          }
          p.pop();
          p.push();
          p.strokeWeight(4);
          p.stroke(211, 211, 211);
          p.noFill();
          p.square(j + (35 * k), i, 35);
          p.pop();
        }
        i = i + 35;
      }
      j = j + (NbrSquareX * 35) + espacement;
    }
  }

  // dessine des lignes horizontales avec une hauteur bien determine
  function lines() {
    p.push();
    i = 0;
    j = 0;
    while (i <= p.height) {
      p.strokeWeight(1);
      p.line(0, i, p.width, i);
      i += 20;
    }
    p.pop();
  }

  p.draw = function() {
    p.noLoop();
    p.background(255);
    lines();
    p.strokeWeight(1.5);
    drawingCircles();

    recursiveSquare();

    p.push();
    p.circle(350, 250, 350);
    p.drawingContext.clip();
    p.push();
    p.translate(p.width / 4, p.height / 4);
    p.rotate(-45);
    p.translate(-p.width / 4, -p.height / 4);
    SquareRec();
    p.pop();
    p.pop();
  };
};
