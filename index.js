let font;
let squares = [];
let isGenerated = false;
let isFree = true;
let carres = [];
let cols;
let rows;
let g;
let step;
let size;
let colors = [
  ["#FB2E0F", "#AAC3EB", "#F2BD3D", "#CFDB93"],
  ["#FB2E0F"],
  ["#CFDB93"],
  ["#AAC3EB"],
  ["#F2BD3D"],
];
let randomColor;
let galleryZone;
let animationStarted = false;
let animationStartTime = 0;
let animationFinished = false;

function preload() {
  font = loadFont("assets/fonts/Roboto-Bold.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(239, 239, 239);
  g = createGraphics(windowWidth, windowHeight);
  size = windowWidth / 30;
  cols = ceil(windowWidth / size);
  rows = ceil(windowHeight / size);
  for (let i = 0; i < cols * size; i = i + size) {
    for (let j = 0; j < rows * size; j = j + size) {
      carres.push(new Carre(i, j));
    }
  }

  g.fill(255);
  g.textFont(font);
  g.textSize(windowWidth / 8);
  g.textAlign(CENTER, CENTER);
  g.text("Software \nPerforming \nArts Gallery", width / 2, height / 2 - 50);
  randomColor = Math.floor(Math.random(2) * colors.length);
}
let fillPoints = [];

function generateFillPoints() {
  step = 16;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let col = g.get(x, y);
      if (col[0] == 255) {
        let colorIndex =
          Math.floor(x / step + y / step) % colors[randomColor].length;
        let c = colors[randomColor][colorIndex];
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
      let square = new Square(pt.x, pt.y, pt.c);
      square.isLetter = true;

      if (pt.x > width / 2 - (1 / 10) * width && pt.y > (height / 3) * 2) {
        square.isGallery = true;
      }

      squares.push(square);
    }
    isGenerated = true;
  }
  let isMoving = false;

  squares.forEach((square) => {
    square.show();
    square.move();
    if (random(1) < 0.01) square.speed = 0.5;
    if (square.isLetter && square.x < square.start + square.size) {
      isMoving = true;
    }
  });

  if (!isMoving && !animationStarted) {
    animationStarted = true;
    animationStartTime = millis();
    carres.forEach((carre) => {
      carre.fadeDelay = random(0, 2000);
    });
  }
  if (animationStarted && !animationFinished) {
    let currentTime = millis() - animationStartTime;
    //console.log(currentTime);
    carres.forEach((carre) => {
      carre.update(currentTime);
      carre.show();
    });
    if (carres.every((c) => !c.isFree)) {
      setTimeout(() => {
        animationFinished = true;
      }, 1000);
    }
  }

  if (animationFinished) {
    background(0);
    window.location.href = "pages/gallery.html";
    return;
  }
}

class Square {
  constructor(x, y, color) {
    this.start = x;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.size = windowWidth / 110;
    this.color = color;
    this.isLetter = false;
    this.isGallery = false;
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
class Carre {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.isFree = true;
    this.fadeDelay = 0;
    this.color;
    this.shouldShow = false;
  }
  show() {
    if (this.shouldShow) {
      randomColor = Math.floor(Math.random(2) * colors.length);
      let colorIndex =
        Math.floor(this.x / step + this.y / step) % colors[randomColor].length;
      this.color = colors[randomColor][colorIndex];
      fill(this.color);
      square(this.x, this.y, this.size);
    }
  }
  update(currentTime) {
    if (currentTime >= this.fadeDelay) {
      this.shouldShow = true;
      this.isFree = false;
    }
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  g = createGraphics(windowWidth, windowHeight);
  g.fill(255);
  g.textFont(font);
  g.textSize(windowWidth / 8);
  console.log(windowWidth / 8);
  g.textAlign(CENTER, CENTER);
  g.text("Software \nPerforming \nArts", width / 2, height / 2);

  fillPoints = [];
  squares = [];
  isGenerated = false;
}
