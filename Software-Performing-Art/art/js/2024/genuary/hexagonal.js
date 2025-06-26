/*
Genuary : JAN. 10 - Hexagonal.

Author: Brice Michel Bigendako
*/

var sketch = function (p) {
  let polygonSize = 50;
  let polygonStrokeWeight = 10;
  let col1 = 140;
  let col2 = 227;
  let col3 = 237;
  let polygonColor = 0; //0-> fixed, 1->black and white, 2->random
  let polygonImbricatedRotation = 0; //0-> fixed, 1->sequential, 2->random

  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    col1 = p.random(1, 255);
    col2 = p.random(1, 255);
    col3 = p.random(1, 255);
  };

  function isOdd(num) {
    return num % 2 == 1;
  }

  function drawHexagon(x, y, rotation = 90) {
    p.push();
    p.translate(x, y);
    //convert 90 degree rotation into radian
    p.rotate(rotation * (p.PI / 180));
    polygon(0, 0, polygonSize, 6);
    p.pop();
  }

  function drawLine(lineNumber, columns, startFrom = 0) {
    let x = polygonSize;
    let y = polygonSize;
    let startX = polygonSize * Math.sqrt(3);
    let rotation = 90;

    if (polygonImbricatedRotation) {
      rotation = 0;
    }

    if (isOdd(lineNumber)) {
      startX = (polygonSize / 2) * Math.sqrt(3);
      columns++;
    }

    for (let i = startFrom; i < columns + startFrom; i++) {
      x = startX + i * polygonSize * Math.sqrt(3);
      y = polygonSize * (lineNumber - 1) + (polygonSize / 2) * (lineNumber - 1);
      drawHexagon(x, y, rotation);
    }
  }

  function drawGrid(lines = 50, columns = 50) {
    for (let i = 1; i <= lines; i++) {
      startFrom = 0;
      drawLine(i, columns);
    }
  }

  function drawGridImbricated(lines = 50, columns = 50) {
    for (let i = 1; i <= lines; i++) {
      startFrom = 0;
      drawLineImbricated(i, polygonSize, startFrom);
    }
  }

  function drawLineImbricated(lineNumber, columns, startFrom = 0) {
    let x = polygonSize;
    let y = polygonSize;
    let startX = polygonSize * Math.sqrt(3);

    if (isOdd(lineNumber)) {
      startX = (polygonSize / 2) * Math.sqrt(3);
      columns++;
    }

    for (let i = startFrom; i < columns + startFrom; i++) {
      x = startX + i * polygonSize * Math.sqrt(3);
      y = polygonSize * (lineNumber - 1) + (polygonSize / 2) * (lineNumber - 1);
      drawIbricated(x, y);
    }
  }

  function drawIbricated(mainX = 90, mainY = 90) {
    let initpolygonSize = polygonSize;
    let rotation = 0;

    for (let i = 0; i < 10; i++) {
      polygonSize = initpolygonSize - (initpolygonSize / 10) * i;
      if (polygonImbricatedRotation == 1) {
        rotation = 90 - 9 * i;
      } else if (polygonImbricatedRotation > 1) {
        rotation = 9 * p.random(0, 10);
      }
      drawHexagon(mainX, mainY, rotation);
    }
    polygonSize = initpolygonSize;
  }

  function step1Hexagon() {
    p.background(140, 227, 237);
    polygonColor = 3;
    polygonSize = 200;
    polygonStrokeWeight = 10;

    drawHexagon(polygonSize, polygonSize, 90);
  }

  function step2Grid() {
    polygonColor = 2;
    polygonSize = 100;
    polygonStrokeWeight = 20;

    polygonImbricatedRotation = 2;

    drawGrid();
  }

  function step3Imbricated() {
    polygonSize = 500;
    polygonStrokeWeight = 10;
    polygonImbricatedRotation = 2;
    drawIbricated(polygonSize, polygonSize);
  }

  function step4GridImbricated() {
    polygonColor = 2;
    polygonStrokeWeight = 10;
    polygonSize = 150;
    polygonImbricatedRotation = 2;

    drawGridImbricated();
  }

  function step5GridImbricatedRandom() {
    polygonStrokeWeight = 10;
    polygonSize = 150;
    polygonImbricatedRotation = p.random([0, 1]);
    polygonColor = p.random([0, 1, 2]);

    drawGridImbricated();
  }

  function step6AllGridsRandom() {
    polygonStrokeWeight = 10;
    polygonSize = 150;
    polygonImbricatedRotation = p.random([0, 1, 2]);
    polygonColor = p.random([0, 1, 2]);
    if (p.random([0, 1])) {
      drawGridImbricated();
    } else {
      polygonStrokeWeight = p.random(20, 40);
      drawGrid();
    }
  }

  function polygon(x, y, radius, npoints) {
    let angle = p.TWO_PI / npoints;
    if (polygonColor == 0) {
      //fixed color
      p.fill(col1, col2, col3);
    } else if (polygonColor == 1) {
      //black and white
      col = p.random(1, 255);
      p.fill(col, col, col);
    } else {
      //random
      col1 = p.random(1, 255);
      col2 = p.random(1, 255);
      col3 = p.random(1, 255);
      p.fill(col1, col2, col3);
    }

    p.stroke(255, 255, 255);
    p.strokeWeight(polygonStrokeWeight);
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * radius;
      let sy = y + p.sin(a) * radius;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }

  p.draw = function () {
    //You can uncomments to check differents elements of the project

    //step1Hexagon();

    //step2Grid();

    //step3Imbricated();

    //step4GridImbricated();

    step5GridImbricatedRandom();

    //step6AllGridsRandom();

    p.noLoop();
  };
};
