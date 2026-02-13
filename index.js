let font;
let squaresLetters = [];
let isGenerated = false;
let isFree = true;
let squaresTransition = [];
let cols;
let rows;
let graphic;
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
let colorIndex;
let galleryZone;
let animationStarted = false;
let animationStartTime = 0;
let animationFinished = false;
let fs; //font size

function resizingText(minRem, vw, maxRem) {
  const remToPx = 16;
  const minPx = minRem * remToPx;
  const maxPx = maxRem * remToPx;
  const vwPx = (vw / 100) * windowWidth;

  return Math.max(minPx, Math.min(vwPx, maxPx));
}

function preload() {
  font = loadFont("assets/fonts/Roboto-Bold.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(239, 239, 239);
  graphic = createGraphics(windowWidth, windowHeight);
  size = windowWidth / 30;
  fs = resizingText(0.5, 13, 500);

  cols = ceil(windowWidth / size);
  rows = ceil(windowHeight / size);
  for (let i = 0; i < cols * size; i = i + size) {
    for (let j = 0; j < rows * size; j = j + size) {
      squaresTransition.push(new SquareTransition(i, j));
    }
  }

  graphic.fill(255);
  graphic.textFont(font);
  graphic.textSize(fs);
  graphic.textAlign(CENTER, CENTER);
  graphic.text(
    "Software \nPerforming \nArts Gallery",
    width / 2,
    height / 2 - 50
  );
  randomColor = Math.floor(Math.random(2) * colors.length);
}
let fillPoints = [];

function generateFillPoints() {
  step = width / 95;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let col = graphic.get(x, y);
      if (col[0] == 255) {
        colorIndex =
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
      let square = new SquareLetter(pt.x, pt.y, pt.c);
      square.isLetter = true;

      if (pt.x > width / 2 - (1 / 10) * width && pt.y > (height / 3) * 2) {
        square.isGallery = true;
      }

      squaresLetters.push(square);
    }
    isGenerated = true;
  }
  let isMoving = false;

  squaresLetters.forEach((square) => {
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
    squaresTransition.forEach((square) => {
      square.appearance = random(0, 2000);
    });
  }
  if (animationStarted && !animationFinished) {
    let currentTime = millis() - animationStartTime;
    //console.log(currentTime);
    squaresTransition.forEach((square) => {
      square.update(currentTime);
      square.show();
    });
    if (squaresTransition.every((c) => !c.isFree)) {
      setTimeout(() => {
        animationFinished = true;
      }, 1000);
    }
  }

  if (animationFinished) {
    background(0);
    window.location.href = "pages/gallery.html";
  }
}
function mousePressed() {
  window.location.href = "pages/gallery.html";
}

class SquareLetter {
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
class SquareTransition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.isFree = true;
    this.appearance = 0;
    this.color;
    this.shouldShow = false;
  }
  show() {
    if (this.shouldShow) {
      randomColor = Math.floor(Math.random(2) * colors.length);
      colorIndex =
        Math.floor(this.x / step + this.y / step) % colors[randomColor].length;
      this.color = colors[randomColor][colorIndex];
      fill(this.color);
      square(this.x, this.y, this.size);
    }
  }
  update(currentTime) {
    if (currentTime >= this.appearance) {
      this.shouldShow = true;
      this.isFree = false;
    }
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  graphic = createGraphics(windowWidth, windowHeight);
  graphic.fill(255);
  graphic.textFont(font);
  fs = resizingText(0.5, 13, 500);
  graphic.textSize(fs);
  graphic.textAlign(CENTER, CENTER);
  graphic.text("Software \nPerforming \nArts", width / 2, height / 2);

  fillPoints = [];
  squaresLetters = [];
  isGenerated = false;
}
