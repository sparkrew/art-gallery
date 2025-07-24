//let shapeLayer;
let font;
function preload() {
  font = loadFont("assets/fonts/Roboto-Bold.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textSize(100);

  shapeLayer = createGraphics(width, height);
  shapeLayer.background(90);
  shapeLayer.fill(255); // Blanc = zone à remplir
  shapeLayer.noStroke();

  // Centrage du texte
  let bounds = font.textBounds("software", 0, 0, 100);
  let x = width / 4;
  let y = height / 2 + bounds.h / 2;

  // Dessiner texte plein
  shapeLayer.textFont(font);
  shapeLayer.textSize(300);
  shapeLayer.text("software", x, y);
  generateFillPoints();
}
let fillPoints = [];

function generateFillPoints() {
  let step = 5; // Espace entre points
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let col = shapeLayer.get(x, y);
      if (col[0] > 200) {
        // Zone blanche = dans la lettre
        fillPoints.push({ x, y });
      }
    }
  }
}
function draw() {
  background(0);
  image(shapeLayer, 0, 0); // pour visualiser la forme

  noStroke();
  fill(0, 255, 255);

  for (let pt of fillPoints) {
    ellipse(pt.x, pt.y, 3, 3);
  }
}
