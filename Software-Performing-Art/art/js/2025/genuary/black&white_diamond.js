var sketch = function (p) {
  let canvasWidth = 800;
  let canvasHeight = 800;
  let topLayer;
  let bottomLayer;
  let startX = -canvasWidth;
  let weightDifference;
  let blackWeight;
  let whiteWeight;
  let maskGraphics;

  p.setup = function () {
    p.createCanvas(p.canvasWidth, p.canvasHeight);
    p.noLoop();
    topLayer = p.createGraphics(p.canvasWidth, p.canvasHeight);
    bottomLayer = p.createGraphics(p.canvasWidth, p.canvasHeight);

    weightDifference = p.random(-5, 5);
    blackWeight = p.random(5, 20);
    whiteWeight = blackWeight + weightDifference;

    startX = -canvasWidth; // Reset startX for drawing stripes
    // Draw top layer stripes
    while (startX < canvasWidth) {
      // Draw black stripe
      topLayer.stroke(0);
      topLayer.strokeWeight(blackWeight);
      topLayer.line(startX, 0, startX + canvasWidth, canvasHeight);
      startX += blackWeight;

      // Draw white stripe
      topLayer.stroke(255);
      topLayer.strokeWeight(whiteWeight);
      topLayer.line(startX, 0, startX + canvasWidth, canvasHeight);
      startX += whiteWeight;
    }

    startX = -canvasWidth; // Reset startX for bottom layer stripes
    // Draw bottom layer stripes in the opposite diagonal direction
    while (startX < canvasWidth) {
      // Draw black stripe
      bottomLayer.stroke(255);
      bottomLayer.strokeWeight(blackWeight);
      bottomLayer.line(startX, canvasHeight, startX + canvasWidth, 0);
      startX += blackWeight;

      // Draw white stripe
      bottomLayer.stroke(0);
      bottomLayer.strokeWeight(whiteWeight);
      bottomLayer.line(startX, canvasHeight, startX + canvasWidth, 0);
      startX += whiteWeight;
    }

    maskGraphics = p.createGraphics(p.width, p.height);
  };

  p.draw = function () {
    p.image(topLayer, 0, 0);
    p.image(bottomLayer, 0, 0);

    maskGraphics.clear(); // Clear previous frames
    maskGraphics.fill(255); // White area defines the visible part
    let halfWidth = canvasWidth / 2;
    maskGraphics.square(halfWidth, 0, halfWidth);
    maskGraphics.square(0, halfWidth, halfWidth);

    // Apply the mask to the top layer
    let maskedLayer = topLayer.get();
    maskedLayer.mask(maskGraphics);

    //   // Draw the masked top layer
    image(maskedLayer, 0, 0);
    noStroke();
    triangle(0, 0, halfWidth, 0, 0, halfWidth);
    triangle(0, halfWidth, 0, canvasHeight, halfWidth, canvasHeight);
    triangle(halfWidth, 0, canvasWidth, 0, canvasWidth, halfWidth);
    triangle(
      halfWidth,
      canvasHeight,
      canvasWidth,
      canvasHeight,
      canvasWidth,
      halfWidth
    );
  };
};
