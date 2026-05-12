var sketch = function(p) {
  // GLOBAL CONTROL: Set to true to use p5.brush watercolor effects, false for original rendering
  const USE_BRUSH = true;
  const overlayalpha = 50;
  // Diverse colorset from vending machine goods (snacks + beverages)
  let vendingColorset = [
    // Chip bag yellows & golds
    [255, 215, 0], // Bright gold (Lay's Classic)
    [255, 195, 50], // Warm yellow (snack bags)
    [242, 169, 0], // Golden yellow

    // Oranges & warm tones
    [255, 140, 0], // Vibrant orange (Doritos, Crush)
    [255, 99, 71], // Tomato red-orange (Doritos Nacho)
    [255, 127, 80], // Coral (snack packaging)

    // Reds & pinks
    [220, 20, 60], // Crimson (Pepsi, Doritos)
    [199, 21, 133], // Deep pink (candy/gum wrappers)
    [178, 34, 34], // Fire brick (Dr Pepper, dark reds)
    [240, 80, 80], // Salmon red (Pringles)

    // Blues & purples
    [0, 48, 135], // Deep Pepsi blue
    [65, 105, 225], // Royal blue (Gatorade, packaging)
    [138, 43, 226], // Blue violet (candy bars)
    [100, 149, 237], // Cornflower blue (lighter packaging)
    [147, 112, 219], // Medium purple (candy)

    // Greens
    [34, 139, 34], // Forest green (7Up bottles)
    [50, 205, 50], // Lime green (Mountain Dew)
    [173, 255, 47], // Yellow-green (bright Dew)
    [60, 179, 113], // Sea green (mint packaging)
    [144, 238, 144], // Light green (packaging accents)

    // Browns & earth tones
    [139, 69, 19], // Saddle brown (beer bottles)
    [160, 82, 45], // Sienna (chocolate, coffee)
    [205, 133, 63], // Peru brown (lighter brown bags)
    [188, 143, 143], // Rosy brown (chocolate bars)

    // Metallic & silver tones
    [192, 192, 192], // Silver (beverage packaging)
    [169, 169, 169], // Dark gray (metallic chips)
    [211, 211, 211], // Light gray (silver accents)

    // Additional vibrant tones
    [255, 20, 147], // Deep pink (bright candy)
    [255, 165, 0], // Orange (Fanta, cheese puffs)
    [70, 130, 180], // Steel blue (cans)
    [147, 197, 114], // Muted sage green
    [230, 190, 255], // Lavender (light purple snacks)
  ];

  // Define polygon types for each segment
  let polygonTypes = ["triangle", "square", "hexagon", "diamond"];

  // Define different goodsize and goodensity for each segment
  let goodsizes = [];

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;

    // Create canvas - WEBGL mode required for p5.brush
    if (USE_BRUSH && typeof brush !== "undefined") {
      let canvas = p.createCanvas(w, h, p.WEBGL);
      canvas.parent("artwork-container");
      p.background(40); // Blackchalk color
      // Initialize p5.brush
      brush.load();
      configureBrushDefaults();
    } else {
      let canvas = p.createCanvas(w, h);
      canvas.parent("artwork-container");
      p.background(40); // Blackchalk color
    }

    goodsizes = [
      p.random(30, 90), // Segment 1
      p.random(20, 80), // Segment 2
      p.random(50, 90), // Segment 3
      p.random(35, 85), // Segment 4
    ];
  };

  function configureBrushDefaults() {
    // Global brush setup for the whole sketch
    let brushes = [
      "2B",
      "cpencil",
      "pen",
      "rotring",
      "spray",
      "marker",
      "marker2",
      "hatch_brush",
    ];
    let brushtype = p.random(brushes);
    let bleedvalue = p.random(0, 0.3);
    let bleeddirection = p.random(["in", "out"]);
    brush.pick("marker");
    console.log("selected brush", brushtype, bleedvalue, bleeddirection);
  }

  function drawOverlayCircle(x, y, radius, color, alpha) {
    // Normal p5 fill overlay, independent from brush
    p.fill(color[0], color[1], color[2], alpha);
    p.noStroke();
    p.circle(x, y, radius * 2);
  }

  // ============================================================
  // DRAWING FUNCTIONS - Handle both p5.brush and standard modes
  // ============================================================

  function drawFilledCircle(x, y, radius, color) {
    if (USE_BRUSH && typeof brush !== "undefined") {
      // Build circle vertices for p5.brush
      let vertices = [];
      let steps = 60;
      for (let i = 0; i < steps; i++) {
        let angle = (p.TWO_PI / steps) * i;
        let px = x + p.cos(angle) * radius;
        let py = y + p.sin(angle) * radius;
        vertices.push([px, py]);
      }

      // Configure watercolor effect
      brush.fill(color, 255);
      brush.polygon(vertices);
    } else {
      p.fill(color[0], color[1], color[2]);
      p.noStroke();
      p.circle(x, y, radius * 2);
    }
  }

  function fillSegmentWithPolygons(
    segmentVertices,
    polygonType,
    colorset,
    gridAngle,
    goodSize,
    goodensity,
  ) {
    let effectiveGridSize = goodSize / goodensity;

    let minX = p.min(segmentVertices.map((v) => v.x));
    let maxX = p.max(segmentVertices.map((v) => v.x));
    let minY = p.min(segmentVertices.map((v) => v.y));
    let maxY = p.max(segmentVertices.map((v) => v.y));

    let dx1 = p.cos(gridAngle);
    let dy1 = p.sin(gridAngle);
    let dx2 = p.cos(gridAngle + p.HALF_PI);
    let dy2 = p.sin(gridAngle + p.HALF_PI);

    let centerX = (minX + maxX) / 2;
    let centerY = (minY + maxY) / 2;

    let maxDist = p.max(maxX - minX, maxY - minY) * 1.5;
    let steps = p.ceil(maxDist / effectiveGridSize);

    for (let i = -steps; i <= steps; i++) {
      for (let j = -steps; j <= steps; j++) {
        let x =
          centerX + i * effectiveGridSize * dx1 + j * effectiveGridSize * dx2;
        let y =
          centerY + i * effectiveGridSize * dy1 + j * effectiveGridSize * dy2;

        if (pointInPolygon(x, y, segmentVertices)) {
          let randomSize = p.random(goodSize * 0.6, goodSize * 1.7) * 0.4;
          let randomColor = p.random(colorset);
          drawPolygon(x, y, polygonType, randomColor, randomSize, gridAngle);
        }
      }
    }
  }

  function drawPolygon(x, y, type, color, size, rotation) {
    // Draw different types of polygons with rotation
    if (USE_BRUSH && typeof brush !== "undefined") {
      let vertices = buildPolygonVertices(type, size);
      let transformed = transformVertices(vertices, x, y, rotation);

      brush.fill(color, 255);
      brush.polygon(transformed);
    } else {
      p.push();
      p.translate(x, y);
      p.rotate(rotation);

      p.fill(color[0], color[1], color[2]);
      p.noStroke();
      p.strokeWeight(1);

      if (type === "triangle") {
        let h = (size * p.sqrt(3)) / 2;
        p.triangle(0, -size * 0.6, -size * 0.5, h * 0.4, size * 0.5, h * 0.4);
      } else if (type === "square") {
        p.rectMode(p.CENTER);
        p.square(0, 0, size);
      } else if (type === "hexagon") {
        p.beginShape();
        for (let i = 0; i < 6; i++) {
          let angle = (p.TWO_PI / 6) * i - p.HALF_PI;
          let px = p.cos(angle) * size * 0.5;
          let py = p.sin(angle) * size * 0.5;
          p.vertex(px, py);
        }
        p.endShape(p.CLOSE);
      } else if (type === "diamond") {
        p.beginShape();
        p.vertex(0, -size * 0.5);
        p.vertex(size * 0.4, 0);
        p.vertex(0, size * 0.5);
        p.vertex(-size * 0.4, 0);
        p.endShape(p.CLOSE);
      }

      p.pop();
    }
  }

  function buildPolygonVertices(type, size) {
    let vertices = [];

    if (type === "triangle") {
      let h = (size * p.sqrt(3)) / 2;
      vertices = [
        [0, -size * 0.6],
        [-size * 0.5, h * 0.4],
        [size * 0.5, h * 0.4],
      ];
    } else if (type === "square") {
      let half = size * 0.5;
      vertices = [
        [-half, -half],
        [half, -half],
        [half, half],
        [-half, half],
      ];
    } else if (type === "hexagon") {
      for (let i = 0; i < 6; i++) {
        let angle = (p.TWO_PI / 6) * i - p.HALF_PI;
        let px = p.cos(angle) * size * 0.5;
        let py = p.sin(angle) * size * 0.5;
        vertices.push([px, py]);
      }
    } else if (type === "diamond") {
      vertices = [
        [0, -size * 0.5],
        [size * 0.4, 0],
        [0, size * 0.5],
        [-size * 0.4, 0],
      ];
    }

    return vertices;
  }

  function transformVertices(vertices, x, y, rotation) {
    let cosR = p.cos(rotation);
    let sinR = p.sin(rotation);
    return vertices.map(([vx, vy]) => [
      x + vx * cosR - vy * sinR,
      y + vx * sinR + vy * cosR,
    ]);
  }

  function drawCircleIntersection(circle1, circle2) {
    let d = p.dist(circle1.x, circle1.y, circle2.x, circle2.y);

    if (
      d >= circle1.radius + circle2.radius ||
      d <= p.abs(circle1.radius - circle2.radius)
    ) {
      return;
    }

    let a =
      (circle1.radius * circle1.radius -
        circle2.radius * circle2.radius +
        d * d) /
      (2 * d);
    let h = p.sqrt(circle1.radius * circle1.radius - a * a);

    let px = circle1.x + (a * (circle2.x - circle1.x)) / d;
    let py = circle1.y + (a * (circle2.y - circle1.y)) / d;

    let ix1 = px + (h * (circle2.y - circle1.y)) / d;
    let iy1 = py - (h * (circle2.x - circle1.x)) / d;
    let ix2 = px - (h * (circle2.y - circle1.y)) / d;
    let iy2 = py + (h * (circle2.x - circle1.x)) / d;

    let angle1_1 = p.atan2(iy1 - circle1.y, ix1 - circle1.x);
    let angle1_2 = p.atan2(iy2 - circle1.y, ix2 - circle1.x);
    let angle2_1 = p.atan2(iy1 - circle2.y, ix1 - circle2.x);
    let angle2_2 = p.atan2(iy2 - circle2.y, ix2 - circle2.x);

    let mid1 = (angle1_1 + angle1_2) / 2;
    let angleTo2 = p.atan2(circle2.y - circle1.y, circle2.x - circle1.x);

    let diff = angleTo2 - mid1;
    while (diff > p.PI) diff -= p.TWO_PI;
    while (diff < -p.PI) diff += p.TWO_PI;

    if (p.abs(diff) > p.HALF_PI) {
      let temp = angle1_1;
      angle1_1 = angle1_2;
      angle1_2 = temp;
    }

    let mid2 = (angle2_1 + angle2_2) / 2;
    let angleTo1 = p.atan2(circle1.y - circle2.y, circle1.x - circle2.x);

    diff = angleTo1 - mid2;
    while (diff > p.PI) diff -= p.TWO_PI;
    while (diff < -p.PI) diff += p.TWO_PI;

    if (p.abs(diff) > p.HALF_PI) {
      let temp = angle2_1;
      angle2_1 = angle2_2;
      angle2_2 = temp;
    }

    let steps = 50;

    if (USE_BRUSH && typeof brush !== "undefined") {
      let vertices = [];

      for (let i = 0; i <= steps; i++) {
        let angle = lerpAngle(angle1_1, angle1_2, i / steps);
        let xp = circle1.x + p.cos(angle) * circle1.radius;
        let yp = circle1.y + p.sin(angle) * circle1.radius;
        vertices.push([xp, yp]);
      }

      for (let i = 0; i <= steps; i++) {
        let angle = lerpAngle(angle2_2, angle2_1, i / steps);
        let xp = circle2.x + p.cos(angle) * circle2.radius;
        let yp = circle2.y + p.sin(angle) * circle2.radius;
        vertices.push([xp, yp]);
      }

      brush.noStroke();
      brush.fill([255, 255, 255], 255);
      brush.polygon(vertices);
    } else {
      p.fill(255);
      p.noStroke();
      p.beginShape();

      for (let i = 0; i <= steps; i++) {
        let angle = lerpAngle(angle1_1, angle1_2, i / steps);
        let x = circle1.x + p.cos(angle) * circle1.radius;
        let y = circle1.y + p.sin(angle) * circle1.radius;
        p.vertex(x, y);
      }

      for (let i = 0; i <= steps; i++) {
        let angle = lerpAngle(angle2_2, angle2_1, i / steps);
        let x = circle2.x + p.cos(angle) * circle2.radius;
        let y = circle2.y + p.sin(angle) * circle2.radius;
        p.vertex(x, y);
      }

      p.endShape(p.CLOSE);
    }
  }

  function drawOverlayIntersection(circle1, circle2, alpha) {
    // Normal p5 fill overlay for the lens shape
    let d = p.dist(circle1.x, circle1.y, circle2.x, circle2.y);
    if (
      d >= circle1.radius + circle2.radius ||
      d <= p.abs(circle1.radius - circle2.radius)
    ) {
      return;
    }

    let a =
      (circle1.radius * circle1.radius -
        circle2.radius * circle2.radius +
        d * d) /
      (2 * d);
    let h = p.sqrt(circle1.radius * circle1.radius - a * a);

    let px = circle1.x + (a * (circle2.x - circle1.x)) / d;
    let py = circle1.y + (a * (circle2.y - circle1.y)) / d;

    let ix1 = px + (h * (circle2.y - circle1.y)) / d;
    let iy1 = py - (h * (circle2.x - circle1.x)) / d;
    let ix2 = px - (h * (circle2.y - circle1.y)) / d;
    let iy2 = py + (h * (circle2.x - circle1.x)) / d;

    let angle1_1 = p.atan2(iy1 - circle1.y, ix1 - circle1.x);
    let angle1_2 = p.atan2(iy2 - circle1.y, ix2 - circle1.x);
    let angle2_1 = p.atan2(iy1 - circle2.y, ix1 - circle2.x);
    let angle2_2 = p.atan2(iy2 - circle2.y, ix2 - circle2.x);

    let mid1 = (angle1_1 + angle1_2) / 2;
    let angleTo2 = p.atan2(circle2.y - circle1.y, circle2.x - circle1.x);

    let diff = angleTo2 - mid1;
    while (diff > p.PI) diff -= p.TWO_PI;
    while (diff < -p.PI) diff += p.TWO_PI;

    if (p.abs(diff) > p.HALF_PI) {
      let temp = angle1_1;
      angle1_1 = angle1_2;
      angle1_2 = temp;
    }

    let mid2 = (angle2_1 + angle2_2) / 2;
    let angleTo1 = p.atan2(circle1.y - circle2.y, circle1.x - circle2.x);

    diff = angleTo1 - mid2;
    while (diff > p.PI) diff -= p.TWO_PI;
    while (diff < -p.PI) diff += p.TWO_PI;

    if (p.abs(diff) > p.HALF_PI) {
      let temp = angle2_1;
      angle2_1 = angle2_2;
      angle2_2 = temp;
    }

    let steps = 50;
    p.fill(255, 255, 255, alpha);
    p.noStroke();
    p.beginShape();
    for (let i = 0; i <= steps; i++) {
      let angle = lerpAngle(angle1_1, angle1_2, i / steps);
      let x = circle1.x + p.cos(angle) * circle1.radius;
      let y = circle1.y + p.sin(angle) * circle1.radius;
      p.vertex(x, y);
    }
    for (let i = 0; i <= steps; i++) {
      let angle = lerpAngle(angle2_2, angle2_1, i / steps);
      let x = circle2.x + p.cos(angle) * circle2.radius;
      let y = circle2.y + p.sin(angle) * circle2.radius;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }

  function lerpAngle(a1, a2, t) {
    let diff = a2 - a1;

    while (diff > p.PI) diff -= p.TWO_PI;
    while (diff < -p.PI) diff += p.TWO_PI;

    return a1 + diff * t;
  }

  function pointInPolygon(px, py, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      let xi = vertices[i].x,
        yi = vertices[i].y;
      let xj = vertices[j].x,
        yj = vertices[j].y;

      let intersect =
        yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function findClosestEdgePoints(corner, edgePoints) {
    let result = [];

    for (let point of edgePoints) {
      if (point.x === corner.x || point.y === corner.y) {
        result.push(point);
      }
    }

    result.sort((a, b) => {
      let distA = p.dist(a.x, a.y, corner.x, corner.y);
      let distB = p.dist(b.x, b.y, corner.x, corner.y);
      return distA - distB;
    });

    return result.slice(0, 2);
  }

  function connectsOppositeEdges(line) {
    let edge1 = getEdge(line.x1, line.y1);
    let edge2 = getEdge(line.x2, line.y2);

    if (
      (edge1 === "top" && edge2 === "bottom") ||
      (edge1 === "bottom" && edge2 === "top")
    ) {
      return true;
    }
    if (
      (edge1 === "left" && edge2 === "right") ||
      (edge1 === "right" && edge2 === "left")
    ) {
      return true;
    }

    return false;
  }

  function connectsSameEdges(line1, line2) {
    let edges1 = [getEdge(line1.x1, line1.y1), getEdge(line1.x2, line1.y2)];
    let edges2 = [getEdge(line2.x1, line2.y1), getEdge(line2.x2, line2.y2)];

    for (let e1 of edges1) {
      for (let e2 of edges2) {
        if (e1 === e2) {
          return true;
        }
      }
    }
    return false;
  }

  function findLineIntersection(line1, line2) {
    let x1 = line1.x1,
      y1 = line1.y1;
    let x2 = line1.x2,
      y2 = line1.y2;
    let x3 = line2.x1,
      y3 = line2.y1;
    let x4 = line2.x2,
      y4 = line2.y2;

    let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (p.abs(denom) < 0.001) {
      return { x: p.width / 2, y: p.height / 2 };
    }

    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1),
    };
  }

  function getEdge(x, y) {
    let tolerance = 0.1;

    if (p.abs(y) < tolerance) return "top";
    if (p.abs(y - p.height) < tolerance) return "bottom";
    if (p.abs(x) < tolerance) return "left";
    if (p.abs(x - p.width) < tolerance) return "right";

    return "unknown";
  }

  function findEdgePoints(cx, cy, angle) {
    let dx = p.cos(angle);
    let dy = p.sin(angle);

    let points = [];

    if (p.abs(dx) > 0.001) {
      let t = -cx / dx;
      let y = cy + t * dy;
      if (y >= 0 && y <= p.height) {
        points.push({ x: 0, y: y, t: t });
      }
    }

    if (p.abs(dx) > 0.001) {
      let t = (p.width - cx) / dx;
      let y = cy + t * dy;
      if (y >= 0 && y <= p.height) {
        points.push({ x: p.width, y: y, t: t });
      }
    }

    if (p.abs(dy) > 0.001) {
      let t = -cy / dy;
      let x = cx + t * dx;
      if (x >= 0 && x <= p.width) {
        points.push({ x: x, y: 0, t: t });
      }
    }

    if (p.abs(dy) > 0.001) {
      let t = (p.height - cy) / dy;
      let x = cx + t * dx;
      if (x >= 0 && x <= p.width) {
        points.push({ x: x, y: p.height, t: t });
      }
    }

    points.sort((a, b) => a.t - b.t);

    return {
      x1: points[0].x,
      y1: points[0].y,
      x2: points[points.length - 1].x,
      y2: points[points.length - 1].y,
    };
  }

  p.draw = function() {
    if (USE_BRUSH && typeof brush !== "undefined") {
      p.translate(-p.width / 2, -p.height / 2);
    }

    // Step 1: Pick first line connecting two opposite edges
    let line1 = {};
    let line1Vertical = p.random() < 0.5;

    if (line1Vertical) {
      line1.x1 = p.random(100, p.width - 100);
      line1.y1 = 0;
      line1.x2 = p.random(100, p.width - 100);
      line1.y2 = p.height;
    } else {
      line1.x1 = 0;
      line1.y1 = p.random(100, p.height - 100);
      line1.x2 = p.width;
      line1.y2 = p.random(100, p.height - 100);
    }

    // Step 2: Find a perpendicular line that connects the other two opposite edges
    let line2 = {};
    let angle1 = p.atan2(line1.y2 - line1.y1, line1.x2 - line1.x1);
    let angle2 = angle1 + p.HALF_PI;
    let maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let t = p.random(0.2, 0.8);
      let px = line1.x1 + t * (line1.x2 - line1.x1);
      let py = line1.y1 + t * (line1.y2 - line1.y1);

      line2 = findEdgePoints(px, py, angle2);

      if (connectsOppositeEdges(line2) && !connectsSameEdges(line1, line2)) {
        break;
      }
    }

    let intersection = findLineIntersection(line1, line2);
    let cx = intersection.x;
    let cy = intersection.y;
    let heart = { x: cx, y: cy };

    let edgePoints = [
      { x: line1.x1, y: line1.y1 },
      { x: line1.x2, y: line1.y2 },
      { x: line2.x1, y: line2.y1 },
      { x: line2.x2, y: line2.y2 },
    ];

    let corners = [
      { x: 0, y: 0, name: "top-left" },
      { x: p.width, y: 0, name: "top-right" },
      { x: p.width, y: p.height, name: "bottom-right" },
      { x: 0, y: p.height, name: "bottom-left" },
    ];

    let densityreduce = 0.4;
    let goodensities = [
      p.random(1.7, 2.3) - densityreduce,
      p.random(1.8, 2.2) - densityreduce,
      p.random(1.6, 2.4) - densityreduce,
      p.random(1.9, 2.1) - densityreduce,
    ];
    // step 3: draw polygon grids
    for (let i = 0; i < 4; i++) {
      let closestPoints = findClosestEdgePoints(corners[i], edgePoints);

      if (closestPoints.length === 2) {
        let segmentVertices = [
          corners[i],
          closestPoints[0],
          { x: cx, y: cy },
          closestPoints[1],
        ];

        fillSegmentWithPolygons(
          segmentVertices,
          polygonTypes[i],
          vendingColorset,
          angle1,
          goodsizes[i],
          goodensities[i],
        );
      }
    }

    // step 4: Draw pepcircles around the heart
    let minDistFromHeart = 20;
    let maxDistFromHeart = 80;
    let distFromHeart = p.random(minDistFromHeart, maxDistFromHeart);
    let angleFromHeart = p.random(p.TWO_PI);

    let pepcircle1 = {
      x: heart.x + p.cos(angleFromHeart) * distFromHeart,
      y: heart.y + p.sin(angleFromHeart) * distFromHeart,
      radius: 0,
    };

    let minRadius = distFromHeart;
    pepcircle1.radius = p.random(minRadius + 10, minRadius + 60);

    let distFromPepcircle1 = p.random(pepcircle1.radius, pepcircle1.radius * 1.5);
    let angleFromPepcircle1 = p.random(p.TWO_PI);

    let pepcircle2 = {
      x: pepcircle1.x + p.cos(angleFromPepcircle1) * distFromPepcircle1,
      y: pepcircle1.y + p.sin(angleFromPepcircle1) * distFromPepcircle1,
      radius: p.random(pepcircle1.radius * 0.5, pepcircle1.radius),
    };

    // Draw pepcircle1 (red)
    let redColor = [220, 60, 60];

    drawOverlayCircle(
      pepcircle1.x,
      pepcircle1.y,
      pepcircle1.radius,
      redColor,
      overlayalpha,
    );
    drawFilledCircle(pepcircle1.x, pepcircle1.y, pepcircle1.radius, redColor);

    // Draw pepcircle2 (blue)
    let blueColor = [72, 65, 209];
    drawFilledCircle(pepcircle2.x, pepcircle2.y, pepcircle2.radius, blueColor);
    drawOverlayCircle(
      pepcircle2.x,
      pepcircle2.y,
      pepcircle2.radius,
      blueColor,
      overlayalpha,
    );

    // Draw intersection in white
    drawCircleIntersection(pepcircle1, pepcircle2);
    drawOverlayIntersection(pepcircle1, pepcircle2, overlayalpha);

    // Draw the 2 perpendicular lines on top
    p.noStroke();
    p.strokeWeight(4);
    p.line(line1.x1, line1.y1, line1.x2, line1.y2);
    p.line(line2.x1, line2.y1, line2.x2, line2.y2);
    p.noLoop();
  };
};
