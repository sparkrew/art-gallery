let container;
let blocs = [];
let dates = [];
let photosBW = [];
let photosColor = [];
let images = [];
let i = 20;
let l = 300;
let texte;
let font;
let data;
let nbMoments = 0;
let timer = 5;
let fontSize;

function preload() {
  container = document.getElementById("art-history-container");

  font = loadFont("../../../assets/fonts/Kolbano-regular.otf");

  data = loadJSON("./art-history.json", (loadedData) => {
    data = loadedData;

    let length = data.length;
    for (let i = 0; i < length; i++) {
      photosBW.push(loadImage(data[i].srcBW));
      photosColor.push(loadImage(data[i].srcColor));
      dates.push(data[i].date);
      nbMoments++;
    }
  });
}

function setup() {
  let width = container.offsetWidth;
  let height = container.offsetHeight;
  let canvas = createCanvas(width, height);
  canvas.parent(container);
  fontSize = width / 35;
  //noLoop();
}

function draw() {
  //background(251, 46, 15);
  blocs = [];

  i = 20;
  l = 300;

  for (let k = 0; k < nbMoments; k++) {
    let bloc = new Bloc(i, l, width / 10, height / 7, " #efefef");
    let image = new Photo(
      photosBW[k],
      bloc.x + bloc.w,
      bloc.y,
      width / 10,
      height / 7
    );

    if (
      mouseX > bloc.x &&
      mouseX < image.x + image.w &&
      mouseY > bloc.y &&
      mouseY < bloc.y + bloc.h
    ) {
      bloc.isHover = true;
      image.isHover = true;
      image.img = photosColor[k];
      bloc.c = "#fb2e0f";
    }

    blocs.push(bloc);
    images.push(image);
    image.show();
    bloc.display();
    bloc.writeText(k);

    i += 400;
  }
}

function mousePressed() {
  let m = 0;
  for (let bloc of blocs) {
    if (
      mouseX > bloc.x &&
      mouseX < bloc.x + bloc.w &&
      mouseY > bloc.y &&
      mouseY < bloc.y + bloc.h
    ) {
      window.location.href = data[m].page;
      return;
    }
    m++;
  }
}

class Photo {
  constructor(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isHover = false;
  }
  show() {
    image(this.img, this.x, this.y, this.w, this.h);
    noFill();
    stroke("#fb2e0f");
    rect(this.x, this.y, this.w, this.h);
  }
}

class Bloc {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.isHover = false;
  }
  writeText(k) {
    noStroke();
    texte = dates[k];
    if (this.isHover == true) {
      fill(255, 255, 255);
    } else {
      fill(251, 46, 15);
    }
    textAlign(CENTER, CENTER);
    textSize(fontSize);
    textFont(font);
    text(texte, this.x + this.w / 2, this.y + this.h / 2);
    //l += 150;
  }

  display() {
    stroke("#fb2e0f");
    fill(this.c);
    rect(this.x, this.y, this.w, this.h);
  }
}
