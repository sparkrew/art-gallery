let size = 20;
let rows;
let cols;

let width;
let height;

let boxes = [];

let font;
let msg = "404";
let points = [];
let fontX;
let fontY;
let fontSize = 700;
let isLetterTab = [];
let container = document.getElementById("error404-container");

function preload() {
  font = loadFont("../../assets/fonts/Roboto-Bold.ttf");
}

function setup() {
  width = container.offsetWidth;
  height = container.offsetHeight;
  canvas = createCanvas(width, height, WEBGL);
  canvas.parent(container);
  angleMode(DEGREES);
  fontX = -width / 3.2 + 6;
  fontY = height / 3.5 - 12;
  cols = width / size;
  rows = height / size;

  points = font.textToPoints(msg, fontX, fontY, fontSize);
  console.log(points);
  for (let i = 0; i < cols; i++) {
    boxes[i] = [];
    isLetterTab[i] = [];
    for (let j = 0; j < rows; j++) {
      let bx = size / 2 + i * size * 1.2 - (size * cols) / 2;
      let by = size / 2 + j * size * 1.2 - (size * rows) / 2;
      boxes[i][j] = new Box(bx, by);
      isLetterTab[i][j] = false;
    }
  }

  for (let k = 0; k < points.length; k++) {
    let px = points[k].x;
    let py = points[k].y;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let bx = boxes[i][j].x;
        let by = boxes[i][j].y;

        if (dist(px, py, bx, by) < 13.5) {
          isLetterTab[i][j] = true;
        }
      }
    }
  }
}

function draw() {
  background(251, 46, 15);
  let distance;
  /* fill(0, 0, 0);
  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, 10, 10);
  } */
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      boxes[i][j].isLetter = isLetterTab[i][j];
      boxes[i][j].display();
    }
  }
}
class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isLetter = false;
    this.angle = 0;
    this.depth = 0;
  }

  display() {
    stroke(255, 100);
    noFill();
    if (this.isLetter == true) {
      stroke(255);
      this.depth += 1;
      this.angle += 1;
    } else {
      this.angle -= 1;
    }

    push();
    translate(this.x, this.y, this.depth);
    rotateX(this.angle);
    rotateZ(this.angle);
    box(size - (1 / 3) * size);
    pop();
  }
}
