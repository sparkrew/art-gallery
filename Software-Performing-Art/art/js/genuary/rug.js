var sketch = function (p) {
  const N = 7;
  let paths = [];
  let colors;
  let randomColorIndices = [];

  p.setup = function () {
    var canva = p.createCanvas(700, 350);
    canva.parent("artwork-container");
    p.pixelDensity(3);
    p.noLoop();
    //noFill();
    colors = [
      p.color(119, 146, 190),
      p.color(110, 148, 245),
      p.color(127, 166, 204),
      p.color(162, 161, 141),
      p.color(154, 154, 126),
    ];
    randomColorIndices = Array(40)
      .fill(0)
      .map(() => p.floor(p.random(colors.length)));
    findPaths([0, 0], [[0, 0]]);
    p.shuffle(paths, true);
  };

  p.draw = function () {
    p.background(29, 42, 54);
    p.noFill();
    p.stroke(112, 2, 30);
    p.strokeWeight(8);
    // red rectangle
    p.rect(p.width - 680, p.height - 340, p.width - 40, p.height - 20);
    drawRectangularBorder(
      p.width - 650,
      p.height - 320,
      p.width - 100,
      p.height - 60
    );
    // width and height variables don't really do anything
    let innerX = p.width - 550;
    let innerY = p.height - 270;
    let innerW = 400;
    let innerH = 190;
    let n = 8;
    let sw = innerW / (n * 2 * N + 2);
    p.strokeWeight(sw);
    p.stroke(76, 76, 68);
    // second gold(ish) border
    p.rect(innerX, innerY, innerW, innerH);
    // just to make the recatngulars fit nicely
    let newInnerX = innerX + 50;
    let newInnerY = innerY + 40;
    let newInnerW = 300;
    let newInnerH = 110;
    // third gold(ish) border
    p.rect(newInnerX, newInnerY, newInnerW, newInnerH);
    drawRhombusPacking(
      innerX,
      innerY,
      innerW,
      innerH,
      newInnerX,
      newInnerY,
      newInnerW,
      newInnerH
    );
    let centerX = p.width / 2;
    let centerY = p.height / 2;
    let maxRadius = p.min((p.width - 200) / 2.5, (p.height - 100) / 2.5);
    drawCircularLines(centerX, centerY, maxRadius);
    p.push();
    p.translate(centerX, centerY);
    drawDynamicCenter(maxRadius * 0.8);
    p.pop();
  };

  function drawCircularLines(centerX, centerY, radius) {
    let segments = 24;
    let angleStep = p.TWO_PI / segments;
    for (let i = 0; i < segments; i++) {
      let angle = i * angleStep;
      if (
        (angle >= 0 && angle < 0.5) ||
        (angle > 2.8 && angle < 3) ||
        (angle > 3 && angle < 3.5) ||
        (angle > 6.0 && angle < 6.5)
      ) {
        p.stroke(colors[i % colors.length]);
        p.strokeWeight(1.5);
        let x1 = centerX + p.cos(angle) * (radius - 20);
        let y1 = centerY + p.sin(angle) * (radius - 20);
        let x2 = centerX + p.cos(angle) * (radius + 50);
        let y2 = centerY + p.sin(angle) * (radius + 50);
        for (let j = 0; j < 7; j++) {
          let t = j / 7;
          let x = p.lerp(x1, x2, t);
          let y = p.lerp(y1, y2, t);
          p.circle(x, y, 3);
        }
      }
    }
  }

  function drawDynamicCenter(radius) {
    let numTriangles = 30;
    let angleStep = p.TWO_PI / numTriangles;
    //0.4
    //0.5
    let triHeight = radius * 0.6;
    let triWidth = radius * 0.15;
    for (let i = 0; i < numTriangles; i++) {
      let angle = i * angleStep;
      p.stroke(colors[randomColorIndices[i]]);
      p.push();
      p.rotate(angle);
      p.triangle(0, 0, -triWidth, triHeight, triWidth, triHeight);
      p.pop();
    }
  }

  function drawRhombusPacking(
    innerX,
    innerY,
    innerW,
    innerH,
    newInnerX,
    newInnerY,
    newInnerW,
    newInnerH
  ) {
    let rhombuses = [];
    let attempts = 0;
    while (attempts < 500) {
      let size = p.random(5, 15);
      // because we go - and + after translate
      let x = p.random(innerX + size, innerX + innerW - size);
      let y = p.random(innerY + size, innerY + innerH - size);
      let insideOuter =
        x > innerX + size &&
        x < innerX + innerW - size &&
        y > innerY + size &&
        y < innerY + innerH - size;
      let outsideInner =
        x < newInnerX - size ||
        x > newInnerX + newInnerW + size ||
        y < newInnerY - size ||
        y > newInnerY + newInnerH + size;
      if (insideOuter && outsideInner) {
        let overlapping = false;
        for (let rhombus of rhombuses) {
          let dx = Math.abs(x - rhombus.x);
          let dy = Math.abs(y - rhombus.y);
          if (dx < size + rhombus.size && dy < size + rhombus.size) {
            overlapping = true;
            break;
          }
        }
        if (!overlapping) {
          rhombuses.push({ x, y, size });
        }
      }
      attempts++;
    }

    for (let rhombus of rhombuses) {
      p.push();
      p.translate(rhombus.x, rhombus.y);
      p.noStroke();
      //strokeWeight(1.5);
      //stroke(colors[rhombuses.indexOf(rhombus) % colors.length]);
      //fill(colors[rhombuses.indexOf(rhombus) % colors.length]);
      let baseColor = p.color(
        colors[rhombuses.indexOf(rhombus) % colors.length]
      );
      baseColor.setAlpha(200);
      p.fill(baseColor);
      p.beginShape();
      p.vertex(-rhombus.size, 0);
      p.vertex(0, -rhombus.size);
      p.vertex(rhombus.size, 0);
      p.vertex(0, rhombus.size);
      p.endShape(p.CLOSE);
      p.pop();
      baseColor.setAlpha(255);
    }
  }

  function drawRectangularBorder(x0, y0, w, h) {
    let n = 8;
    let sw = w / (n * 2 * N + 2);
    p.strokeWeight(sw);
    p.stroke(76, 76, 68);
    // first gold(ish) border
    p.rect(x0, y0, w, h);
    // because we want to make rect shapes
    let sWidth = (w - 2 * sw) / n;
    let sHeight = (h - 2 * sw) / n;
    y0 += 3;
    p.strokeWeight(Math.min(sWidth, sHeight) / (4 * N));
    // upper horizontal
    for (let i = 0; i < n; i++) {
      let x = x0 + sWidth * i;
      makeTile(x, y0, sWidth, sHeight, i);
    }
    // right vertical
    for (let i = 1; i < n; i++) {
      let y = y0 + sHeight * i;
      makeTile(x0 + w - sWidth - 2 * sw, y, sWidth, sHeight, i + n);
    }
    // lower horizontal
    for (let i = 1; i < n; i++) {
      let x = x0 + w - sWidth * (i + 1);
      makeTile(
        x - 2 * sw,
        y0 + h - sHeight - 2 * sw,
        sWidth,
        sHeight,
        i + 2 * n
      );
    }
    // left vertical
    for (let i = 1; i < n - 1; i++) {
      let y = y0 + h - sHeight * (i + 1);
      makeTile(x0, y - 2 * sw, sWidth, sHeight, i + 3 * n);
    }
  }

  function makeTile(x0, y0, sWidth, sHeight, index) {
    let path = paths[index];
    // change N to update the tile size and then pack more by updating n
    let newSWidth = sWidth / N;
    let newSHeight = sHeight / N;
    // make k+n to have diagonal lines
    for (let k = 0; k < path.length - 1; k++) {
      let [i1, j1] = path[k];
      let [i2, j2] = path[k + 1];
      let x1 = i1 * newSWidth;
      let y1 = j1 * newSHeight;
      let x2 = i2 * newSWidth;
      let y2 = j2 * newSHeight;
      let colorIndex = (index + k) % colors.length;
      p.stroke(colors[colorIndex]);
      p.line(
        x0 + x1 + newSWidth,
        y0 + y1 + newSHeight,
        x0 + x2 + newSWidth,
        y0 + y2 + newSHeight
      );
    }
  }

  function possibleNeighbors([i, j]) {
    let possibilities = [];
    if (i % 2 == 0 && j < N - 1) possibilities.push([i, j + 1]);
    if (i % 2 == 1 && j > 0) possibilities.push([i, j - 1]);
    if (j % 2 == 0 && i < N - 1) possibilities.push([i + 1, j]);
    if (j % 2 == 1 && i > 0) possibilities.push([i - 1, j]);
    return possibilities;
  }

  function inArray([i, j], arr) {
    for (let e of arr) {
      if (e[0] == i && e[1] == j) return true;
    }
    return false;
  }

  function findPaths(p, visited) {
    let neighbors = possibleNeighbors(p);
    if (neighbors.length == 0) {
      if (visited.length == N * N) paths.push(visited);
      return;
    }
    for (let neigh of neighbors) {
      if (!inArray(neigh, visited)) findPaths(neigh, [...visited, neigh]);
    }
  }
};
