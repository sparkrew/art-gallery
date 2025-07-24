let colors = ["#1c80b4", "#fcad2a", "#f82f1d"];
let grid = 6;
let boxes = [];
let size = 10;
let msg = "SOFTWARES";
let points = [];
let fontX;
let fontY;
let fontSize = 300;
let isLetterTab = [];

function preload() {
  font = loadFont("assets/fonts/Roboto-Bold.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);

  background("#ffe7c1");
  noStroke();
  fontX = width / 2 - font.textBounds(msg, 0, 0, fontSize).w / 2;
  fontY = height / 2 + fontSize / 3;

  points = font.textToPoints(msg, fontX, fontY, fontSize);

  for (let y = height / 100; y < height; y += 25) {
    for (let x = 0; x < width; x += 25) {
      //let c = colors[(x / (width / x) + floor(y / (height / y))) % 3];
      //console.log("couleur", c);

      boxes.push(new Box(x, y, "#1c80b4"));
    }
  }
  for (let pt of points) {
    for (let box of boxes) {
      if (dist(pt.x, pt.y, box.x, box.y) < 10) {
        box.isLetter = true;
      }
    }
  }

  /* for (let y = height / grid / 2; y < height; y += height / grid) {
    for (let x = 0; x < windowWidth; x += width / grid) {
      let c = colors[(x / (width / grid) + floor(y / (height / grid))) % 3];
      
      boxes.push(new Box(x, y, c));
    }
  } */
}

function draw() {
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
    this.isLetter = false;
  }

  show() {
    fill("#0d0e08");
    square(this.x - 1, this.y + 1, this.size);

    if (this.isLetter) {
      fill("#f82f1d");
    } else {
      fill(this.color);
    }

    square(this.x, this.y, this.size);
    console.log("nouveau carré");
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
