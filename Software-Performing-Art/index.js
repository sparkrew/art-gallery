let font;
let squares = [];
let isGenerated = false;
let g;
let step;
let colors = ["#FB2E0F", "#AAC3EB", "#F2BD3D", "#CFDB93"];

function preload() {
  font = loadFont("assets/fonts/Roboto-Bold.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(239, 239, 239);
  g = createGraphics(windowWidth, windowHeight);
  g.fill(255);
  g.textFont(font);
  g.textSize(windowWidth / 8);
  g.textAlign(CENTER, CENTER);
  g.text("Software \nPerforming \nArts Gallery", width / 2, height / 2);
}
let fillPoints = [];

function generateFillPoints() {
  step = 16;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let col = g.get(x, y);
      if (col[0] == 255) {
        let colorIndex = Math.floor(x / step + y / step) % colors.length;
        let c = colors[colorIndex];
        fillPoints.push({ x, y, c });
      }
    }
  }
}
function draw() {
  noStroke();
  //fill(0, 255, 255);
  if (!isGenerated) {
    generateFillPoints();
    for (let pt of fillPoints) {
      let c = pt.c;
      squares.push(new Square(pt.x, pt.y, c));
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
    this.size = 13;
    this.color = color;
    this.isLetter = false;
  }

  show() {
    fill("#050505");
    square(this.x - 1, this.y + 1, this.size);

    if (this.isLetter) {
      fill(this.color);
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
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  g = createGraphics(windowWidth, windowHeight);
  g.fill(255);
  g.textFont(font);
  g.textSize(windowWidth / 8);
  g.textAlign(CENTER, CENTER);
  g.text("Software \nPerforming \nArts", width / 2, height / 2);

  fillPoints = [];
  squares = [];
  isGenerated = false;
}
