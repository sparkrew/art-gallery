var sketch = function(p) {

  const vortexRadius = 45;

  function drawVortex(parentX, parentY) {
    let hue = p.random(0, 360);
    let sat = 80;
    let bri = 85;

    let parentRadius = vortexRadius;
    p.fill(hue, sat, bri);
    p.circle(parentX, parentY, parentRadius * 2);

    let childRadius;
    let childMinProp = 0.6;
    let childMaxProp = 0.9;
    let nbChild = p.random(2, 11);

    for (let i = 0; i < nbChild; i++) {
      childRadius = p.random(
        parentRadius * childMinProp,
        parentRadius * childMaxProp,
      );
      let randAngle = p.random(0, 360);
      hue = p.random(0, 360);
      sat = 80;
      bri = 85;

      let angle = p.radians(randAngle);
      let hypotenuse = parentRadius - childRadius;
      let stepX = hypotenuse * p.cos(angle);
      let stepY = hypotenuse * p.sin(angle);

      let childX = parentX + stepX;
      let childY = parentY + stepY;
      p.fill(hue, sat, bri);
      p.circle(childX, childY, childRadius * 2);

      parentX = childX;
      parentY = childY;
      parentRadius = childRadius;
    }
  }

  function colorGreenRect() {
    let hue = p.random(95, 150);
    let sat = p.random(25, 35);
    let bri = p.random(80, 100);
    let alpha = 80;
    p.fill(hue, sat, bri, alpha);
  }

  function drawRectangles() {
    let h1 = p.random();
    let h2 = p.random();
    let h3 = p.random();
    let total = h1 + h2 + h3;

    h1 = (h1 / total) * p.height;
    h2 = (h2 / total) * p.height;
    h3 = (h3 / total) * p.height;

    let y = 0;
    colorGreenRect();
    p.rect(0, y, p.width, h1);
    y += h1;
    colorGreenRect();
    p.rect(0, y, p.width, h2);
    y += h2;
    colorGreenRect();
    p.rect(0, y, p.width, h3);
  }

  function drawCurve() {
    let incrementY = 5;
    let noiseScale = 0.002;
    let amplitude = p.width;
    let gapSquared = (vortexRadius * 2.1) ** 2;
    let prevX = 0;
    let prevY = 0;

    for (let y = 0; y <= p.height; y += incrementY) {
      let x = p.noise(y * noiseScale) * amplitude - amplitude / 2 + p.width / 2;

      if ((x - prevX) ** 2 + (y - prevY) ** 2 > gapSquared) {
        drawVortex(x, y, vortexRadius);
        prevX = x;
        prevY = y;
      }
    }
  }

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let canvas = p.createCanvas(w, h);
    canvas.parent("artwork-container");
    p.noLoop();
    p.colorMode(p.HSB);
  };

  p.draw = function() {
    p.background(255);
    p.noStroke();

    drawRectangles();
    drawCurve();
  };

};
