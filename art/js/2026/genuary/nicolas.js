var sketch = function(p) {
  var w, h;
  var cnv;

  var NUM_CIRCLES = 130;
  var circles = [];

  var PALETTE = [
    [255, 255, 255], // white
    [0, 0, 0], // black
    [30, 90, 200], // blue
    [200, 40, 40], // red
    [40, 160, 90], // green
    [40, 200, 200], // turquoise
    [240, 140, 40], // orange
  ];

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    w = container.offsetWidth;
    h = container.offsetHeight;
    cnv = p.createCanvas(w, h);
    cnv.parent("artwork-container");
    p.colorMode(p.RGB, 255);
    p.noLoop();
  };

  // Draws paint droplets inside a cluster
  function drawPaintInside(x, y, d, colorLayers) {
    if (colorLayers === undefined) colorLayers = null;
    var ctx = p.drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, d / 2, 0, p.TWO_PI);
    ctx.clip();

    let numLayers;

    if (colorLayers) {
      numLayers = colorLayers.length;
    } else {
      numLayers = p.int(p.random(3, 5));
      colorLayers = p.shuffle([...PALETTE]).slice(0, numLayers);
    }

    var layerMaxRadius = d / 2;

    for (var layer = 0; layer < numLayers; layer++) {
      var layerRadius = layerMaxRadius * (1 - (layer / numLayers) * 0.6);

      var spacingFactor = p.map(layer, 0, numLayers - 1, 0.5, 1);
      var numDrops = p.int(p.random(60, 120) * spacingFactor);

      var base = colorLayers[layer];

      for (var i = 0; i < numDrops; i++) {
        var r = p.random(1, 1.5);
        var angle = p.random(p.TWO_PI);

        var radius;
        if (layer == numLayers - 1) {
          radius = p.random(0, layerRadius - r);
        } else {
          radius = layerRadius + p.random(-layerRadius * 0.2, layerRadius * 0.2);
        }

        var px = x + p.cos(angle) * radius;
        var py = y + p.sin(angle) * radius;

        p.fill(
          p.constrain(base[0] + p.random(-20, 20), 0, 255),
          p.constrain(base[1] + p.random(-20, 20), 0, 255),
          p.constrain(base[2] + p.random(-20, 20), 0, 255),
          p.random(230, 255),
        );

        p.noStroke();
        p.circle(px, py, r * 2);
      }
    }

    ctx.restore();
    return colorLayers;
  }

  // One cluster -> one painting of colours
  // One glass -> multiple clusters with shared colours
  function drawGlassCircle(x, y, d) {
    var clusters = [];
    var numClusters = p.int(p.random(1, 4));
    var maxTries = 100;

    var clusterRadii = [];
    for (var i = 0; i < numClusters; i++) {
      var maxR = (d / 2) * (0.5 - i * 0.12);
      var minR = (d / 2) * 0.2;
      clusterRadii.push(p.random(minR, maxR) * 2);
    }

    var numLayers = p.int(p.random(3, 5));
    var sharedPalette = p.shuffle([...PALETTE]).slice(0, numLayers);

    for (var i = 0; i < numClusters; i++) {
      var clusterRadius = p.min(clusterRadii[i], d / 2 - 2);

      var placed = false;
      var tries = 0;

      while (!placed && tries < maxTries) {
        var angle = p.random(p.TWO_PI);
        var distFromCenter = p.random(0, d / 2 - clusterRadius);
        var clusterX = x + p.cos(angle) * distFromCenter;
        var clusterY = y + p.sin(angle) * distFromCenter;

        var valid = true;
        for (var j = 0; j < clusters.length; j++) {
          var c = clusters[j];
          if (p.dist(clusterX, clusterY, c.x, c.y) < clusterRadius + c.r) {
            valid = false;
            break;
          }
        }

        if (valid) {
          clusters.push({ x: clusterX, y: clusterY, r: clusterRadius });
          placed = true;
        } else if (i === numClusters - 1 && tries === maxTries - 1) {
          clusterRadius *= 0.7;
          tries = 0;
        }

        tries++;
      }
    }

    for (var i = 0; i < clusters.length; i++) {
      var c = clusters[i];
      drawPaintInside(c.x, c.y, c.r, sharedPalette);
    }

    p.noStroke();
    p.fill(255, 255, 255, 60);
    p.circle(x, y, d);

    p.fill(255, 255, 255, 35);
    p.circle(x, y, d * 0.85);

    p.noFill();
    p.stroke(255, 255, 255, 80);
    p.strokeWeight(1);
    p.circle(x, y, d);
  }

  function drawMetallicBorder() {
    let borderThickness = 15;

    for (let i = 0; i < borderThickness; i++) {
      let shade = p.map(i, 0, borderThickness - 1, 120, 200);
      p.stroke(shade);
      p.strokeWeight(1);
      p.noFill();
      p.rect(i / 2, i / 2, w - i, h - i);
    }
  }

  p.draw = function() {
    p.background(157, 212, 114);

    p.noStroke();
    p.fill(255, 255, 255, 180);

    circles = [];

    for (var i = 0; i < NUM_CIRCLES; i++) {
      placeCircle();
    }

    for (var i = 0; i < circles.length; i++) {
      var c = circles[i];
      drawGlassCircle(c.x, c.y, c.d);
    }

    drawMetallicBorder();
  };

  function placeCircle() {
    var maxTries = 500;
    var tries = 0;

    while (tries < maxTries) {
      var d = p.random(10, 60);
      var x = p.random(d / 2, w - d / 2);
      var y = p.random(d / 2, h - d / 2);

      var valid = true;

      for (var i = 0; i < circles.length; i++) {
        var other = circles[i];
        var distCenters = p.dist(x, y, other.x, other.y);

        if (distCenters < d / 2 + other.d / 2) {
          valid = false;
          break;
        }
      }

      if (valid) {
        circles.push({ x: x, y: y, d: d });
        return;
      }

      tries++;
    }
  }
};
