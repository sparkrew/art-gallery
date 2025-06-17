var sketch = function (p) {
  let points1 = [];
  let points2 = [];
  let shapes1 = [];
  let shapes2 = [];
  let width;
  let height;
  let jsonData1;
  let jsonData2;
  let records1 = [];
  let records2 = [];
  let maxEvents1 = 0;
  let maxEvents2 = 0;

  const config = {
    n: 0,
    maxTrials: 0,
    r: 0.65,
    angle: 0.03,
    pBranch: 0.01,
    lineSize: 1,
    shapeSize: 4,
    minShapeDistance: 8,
  };

  const categoryShapes = {
    FileRead: drawTriangle,
    FileWrite: drawSquare,
    ProcessStart: drawPentagon,
    NetworkAccess: drawHexagon,
  };

  let currentRecordIndex1 = 0;
  let currentRecordIndex2 = 0;

  p.preload = function () {
    jsonData1 = p.loadJSON("art/js/data/theo/data/pdf-test.json");
    jsonData2 = p.loadJSON("art/js/data/theo/data/pdf-prod.json");
  };

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.background("#1A1A1A");

    for (let key in jsonData1) {
      records1 = records1.concat(jsonData1[key]);
    }
    maxEvents1 = records1.reduce(
      (max, record) => Math.max(max, record.events.length),
      0
    );

    for (let key in jsonData2) {
      records2 = records2.concat(jsonData2[key]);
    }
    maxEvents2 = records2.reduce(
      (max, record) => Math.max(max, record.events.length),
      0
    );

    points1.push({
      x: width / 4,
      y: height / 2,
      dir: 0,
      level: 0,
      category: null,
      eventFactor: 1,
    });

    points2.push({
      x: (3 * width) / 4,
      y: height / 2,
      dir: 0,
      level: 0,
      category: null,
      eventFactor: 1,
    });

    const maxRecords = Math.max(records1.length, records2.length);
    // might have to scale depending on the number of records
    config.maxTrials = (maxRecords * 70) / 100;
    config.n = (maxRecords * 80) / 100;
    // random seed of my birthday, but it does not work when test and prod files are the same. That is
    // because the prod data starts with a different position in the random sequence than if it
    // was running alone.
    p.randomSeed(19971008);
  };

  p.draw = function () {
    if (points1.length < config.n) {
      generateNextPoint(1);
    }
    if (points2.length < config.n) {
      generateNextPoint(2);
    }

    p.fill("#FFFFFF");
    p.noStroke();
    for (let shape of shapes1) {
      p.push();
      p.translate(shape.x, shape.y);
      p.rotate(shape.rotation);
      categoryShapes[shape.category](config.shapeSize);
      p.pop();
    }
    for (let shape of shapes2) {
      p.push();
      p.translate(shape.x, shape.y);
      p.rotate(shape.rotation);
      categoryShapes[shape.category](config.shapeSize);
      p.pop();
    }

    if (points1.length >= config.n && points2.length >= config.n) {
      p.noLoop();
    }
  };

  function generateNextPoint(execIndex) {
    // do I have more lines than required?
    const points = execIndex === 1 ? points1 : points2;
    const shapes = execIndex === 1 ? shapes1 : shapes2;
    const records = execIndex === 1 ? records1 : records2;
    const maxEvents = execIndex === 1 ? maxEvents1 : maxEvents2;
    let currentRecordIndex =
      execIndex === 1 ? currentRecordIndex1 : currentRecordIndex2;
    const xOffset = execIndex === 1 ? 0 : width / 2;

    let valid = false;
    let trial = 0;

    while (!valid && trial < config.maxTrials) {
      let randomPoint = p.random(points);
      let branch = p.random() <= config.pBranch;

      if (branch) {
        currentRecordIndex = (currentRecordIndex + 1) % records.length;
        if (execIndex === 1) {
          currentRecordIndex1 = currentRecordIndex;
        } else {
          currentRecordIndex2 = currentRecordIndex;
        }
      }
      let currentRecord = records[currentRecordIndex];
      // the eventFactor is loosly related to the number of events in the record. Ideally it should make a bigger difference.
      // maybe there are better equations to use here
      let eventFactor = branch
        ? 1 - (currentRecord.events.length / maxEvents) * 0.05
        : randomPoint.eventFactor;
      let r =
        config.r *
        (1 + 1 / (branch ? randomPoint.level + 1 : randomPoint.level)) *
        eventFactor;
      let newCategory = branch
        ? currentRecord.detectorCategory
        : randomPoint.category;

      let { xj, yj, alpha } = getNewPosition(randomPoint, r, branch);

      // x position based on the visualization we're working with
      xj = p.constrain(xj, xOffset + 50, xOffset + width / 2 - 50);

      if (isValidPosition(xj, yj, r, points)) {
        addNewPoint(
          xj,
          yj,
          alpha,
          randomPoint,
          newCategory,
          eventFactor,
          points
        );

        if (newCategory) {
          tryAddShape(xj, yj, newCategory, shapes);
        }
        valid = true;
      }
      trial++;
    }
  }

  function getNewPosition(randomPoint, r, branch) {
    let branchAngle = branch ? (p.random() < 0.5 ? -p.PI / 2 : p.PI / 2) : 0;
    let alpha =
      randomPoint.dir +
      p.random(-config.angle, config.angle) +
      branch * branchAngle;
    let xj = randomPoint.x + (p.cos(alpha) * r * width) / 140;
    let yj = randomPoint.y + (p.sin(alpha) * r * height) / 80;
    return { xj, yj, alpha };
  }

  function isValidPosition(x, y, r, points) {
    // points should stay within their respective areas
    let halfIndex = x > width / 2 ? 2 : 1;
    let minX = halfIndex === 1 ? 0 : width / 2;
    let maxX = halfIndex === 1 ? width / 2 : width;
    // canvas
    if (x < minX || x > maxX || y < 0 || y > height) return false;
    // points and their gaps
    let minDist = (r * width) / 140;
    for (let point of points) {
      if (p.dist(x, y, point.x, point.y) < minDist) return false;
    }
    return true;
  }

  function isValidShapePosition(x, y, shapes) {
    for (let shape of shapes) {
      if (p.dist(x, y, shape.x, shape.y) < config.minShapeDistance) {
        return false;
      }
    }
    let padding = config.shapeSize;
    // the half we are in
    let halfIndex = x > width / 2 ? 2 : 1;
    let minX = halfIndex === 1 ? padding : width / 2 + padding;
    let maxX = halfIndex === 1 ? width / 2 - padding : width - padding;
    return x >= minX && x <= maxX && y >= padding && y <= height - padding;
  }

  function tryAddShape(x, y, category, shapes) {
    if (isValidShapePosition(x, y, shapes)) {
      shapes.push({
        x: x,
        y: y,
        rotation: p.random(p.TWO_PI),
        category: category,
      });
      return true;
    }
    return false;
  }

  function addNewPoint(
    x,
    y,
    alpha,
    randomPoint,
    category,
    eventFactor,
    points
  ) {
    let newLevel =
      p.random() <= config.pBranch
        ? randomPoint.level + 1
        : Math.max(1, randomPoint.level);
    // had edges here. but thought it is better without them. But they can be added back if needed.
    points.push({
      x: x,
      y: y,
      dir: alpha,
      level: newLevel,
      category: category,
      eventFactor: eventFactor,
    });
  }

  function drawTriangle(size) {
    p.beginShape();
    p.vertex(0, -size);
    p.vertex(-size * p.cos(p.PI / 6), size * p.sin(p.PI / 6));
    p.vertex(size * p.cos(p.PI / 6), size * p.sin(p.PI / 6));
    p.endShape(p.CLOSE);
  }

  function drawSquare(size) {
    p.rect(-size / 2, -size / 2, size, size);
  }

  function drawRegularShape(sides, size) {
    p.beginShape();
    for (let i = 0; i < sides; i++) {
      const angle = (p.TWO_PI * i) / sides - p.PI / 2;
      p.vertex(p.cos(angle) * size, p.sin(angle) * size);
    }
    p.endShape(p.CLOSE);
  }

  function drawPentagon(size) {
    drawRegularShape(5, size);
  }

  function drawHexagon(size) {
    drawRegularShape(6, size);
  }
};
