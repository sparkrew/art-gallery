//let shapeLayer;
let font;
let squares = [];
let isGenerated = false;
let letters = [];
function preload() {
  font = loadFont("assets/fonts/Roboto-Bold.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(239, 239, 239);
  fill(255);
  textFont(font);
  textSize(300);
  textAlign(CENTER, CENTER);
  text("Software", width / 2, height / 2 - 200);
  text("Performing", width / 2, height / 2 + 200);
}
let fillPoints = [];

function generateFillPoints() {
  let step = 16;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let col = get(x, y);
      if (col[0] == 255) {
        fillPoints.push({ x, y });
      }
    }
  }
}
function draw() {
  noStroke();
  fill(0, 255, 255);
  if (!isGenerated) {
    generateFillPoints();
    for (let pt of fillPoints) {
      squares.push(new Square(pt.x, pt.y, "#7b71d9"));
      for (let square of squares) {
        square.isLetter = true;
      }
      //ellipse(pt.x, pt.y, 3, 3);
    }
    isGenerated = true;
  }

  squares.forEach((square) => {
    square.show();
    square.move();
    if (random(1) < 0.01) square.speed = 0.5;
  });
}
class Square {
  constructor(x, y, color) {
    this.start = x;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.size = 12;
    this.color = color;
    this.isLetter = false;
  }

  show() {
    fill("#bf2008");
    square(this.x - 1, this.y + 1, this.size);

    if (this.isLetter) {
      fill("#FB2E0F");
    }

    square(this.x, this.y, this.size);
  }

  move() {
    if (this.isLetter) {
      if (this.x < this.start + this.size) {
        this.x += this.speed;
        this.y -= this.speed;
      }
    }
  }
}
