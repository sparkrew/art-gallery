let size = 20;
let rows;
let cols;
let grid = 6;
let width;
let height;
let colors = ["#fb2e0f", "#abe54d", "#f7e40f"];
let boxes = [];

let font;
let msg = "SOFTWARE";
let points = [];
let fontX;
let fontY;
let fontSize = 300;
let isLetterTab = [];

function preload() {
  font = loadFont("assets/fonts/Roboto-Bold.ttf");
}

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(windowWidth, windowHeight, WEBGL);

  fontX = -width / 2 + 40;
  fontY = -height / 5;
  cols = width / size;
  rows = height / size;

  points = font.textToPoints(msg, fontX, fontY, fontSize);

  background("#efefef");
  noStroke();

  for (let y = -height / 2 + 120; y < height; y += height / grid) {
    for (let x = -width / 2 + 120; x < windowWidth; x += width / grid) {
      let c = colors[(x / (width / grid) + floor(y / (height / grid))) % 3];
      boxes.push(new Box(x, y, c));
    }
  }
}
function draw() {
  ellipse(-width / 2, -height / 2, 10, 10);
  fill(0, 0, 0);
  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, 10, 10);
  }
  boxes.forEach((box) => {
    box.show();
    box.move();
    if (random(1) < 0.01) box.speed = 1;
  });
}
class Box {
  constructor(x, y, color) {
    this.start = x;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.size = height / grid / 8;
    this.color = color;
  }

  show() {
    fill("#0d0e08");
    square(this.x - 1, this.y + 1, this.size);
    fill(this.color);
    square(this.x, this.y, this.size);
  }

  move() {
    if (this.x < this.start + this.size) {
      this.x += this.speed;
      this.y -= this.speed;
    } else {
      console.log("trop petit");
    }
  }
}
