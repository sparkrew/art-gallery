var sketch = function(p) {
  const margin = 5;
  let canvasWidth;
  let canvasHeight;

  let colors;

  const maxNbRectangles = 70;
  const minNbRectangles = 10;
  let nbRectangles = -1; // set any integer >= 1 for the number of rectangles for the canvas' width, or set to -1 to use a random number

  const maxNoiseScale = 0.001;
  const minNoiseScale = 0.0003;
  let noiseScale = -1; // set any float for the noise scale (high = small details, low = smooth curves), or set to -1 to use a random scale

  let offsetX = 0;
  let speed;
  let noiseAmplitude;

  let isPaused = false;

  p.setup = function() {
    p.colorMode(p.HSB);

    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let canvas = p.createCanvas(w, h);
    canvas.parent("artwork-container");

    canvasWidth = w;
    canvasHeight = h;

    colors = [
      [p.random(200, 240), p.random(40, 100), p.random(60, 100)], // blue-ish
      [p.random(100, 150), p.random(40, 80), p.random(30, 50)], // dark green-ish
      [p.random(20, 40), p.random(30, 80), p.random(30, 50)], // brown-ish
    ];

    if (nbRectangles === -1) {
      nbRectangles = Math.floor(Math.random() * (maxNbRectangles - minNbRectangles + 1) + minNbRectangles);
    }

    if (noiseScale === -1) {
      noiseScale = Math.random() * (maxNoiseScale - minNoiseScale) + minNoiseScale;
    }

    speed = 6 * noiseScale + 0.002; // Gives nice speeds based on what I wanted
    noiseAmplitude = canvasHeight / 1.3;
  };

  p.draw = function() {
    if (isPaused) {
      return;
    }

    p.stroke(0, 0, 78, 100); // Light grey border between rectangles
    // p.noStroke();

    let rectangleWidth = Math.ceil(canvasWidth / nbRectangles);
    let halfRectWidth = rectangleWidth / 2;

    for (let rectIndex = 0; rectIndex < nbRectangles; rectIndex++) {
      let left = rectIndex * rectangleWidth;
      let center = left + halfRectWidth;
      let midPoint1 = f1(center);
      let midPoint2 = f2(center);

      drawSlice(left, rectangleWidth, midPoint1, midPoint2);
    }

    offsetX += speed;
  };

  function drawSlice(left, rectangleWidth, midPoint1, midPoint2) {
    let inverted = midPoint1 > midPoint2;

    let height1 = inverted ? midPoint2 : midPoint1;
    let height2 = Math.abs(midPoint2 - midPoint1);
    let height3 = canvasHeight - height1 - height2;

    p.fill(...colors[0]);
    p.rect(left, 0, rectangleWidth, height1);

    if (inverted) {
      const mixedColors = [
        (colors[0][0] + colors[2][0]) / 2, // Not the right way to average the hue, but this gives nice results 😂
        (colors[0][1] + colors[2][1]) / 2,
        (colors[0][2] + colors[2][2]) / 2,
      ];
      p.fill(...mixedColors);
    } else {
      p.fill(...colors[1]);
    }
    p.rect(left, height1, rectangleWidth, height2);

    p.fill(...colors[2]);
    p.rect(left, height1 + height2, rectangleWidth, height3);
  }

  function f1(x) {
    return canvasHeight / 2 + (p.noise(x * noiseScale + offsetX, 0) - 0.5) * noiseAmplitude;
  }

  function f2(x) {
    return canvasHeight * 0.65 + (p.noise(x * noiseScale + offsetX, 42) - 0.5) * noiseAmplitude;
  }

  p.keyPressed = function() {
    if (p.keyCode === 32) { // Space key
      isPaused = !isPaused;
    }
  };
};
