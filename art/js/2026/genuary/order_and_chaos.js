var sketch = function(p) {
  var pieces = []
  var rects = []
  var circles = []
  var colors = []
  let stepGrid = 8
  var w, h
  var cnv
  var canvasHeight
  var canvasWidth

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    w = container.offsetWidth;
    h = container.offsetHeight;
    canvasWidth = p.min(w, h);
    canvasHeight = canvasWidth;
    w = canvasWidth;
    h = canvasHeight;
    generateColors()
    cnv = p.createCanvas(canvasWidth, canvasHeight);
    cnv.parent("artwork-container");

    generateGrid()
    // p.noLoop()
  };

  p.draw = function() {
    p.background(p.color(10, 20, 40));
    drawCanvas()
    if (p.mouseIsPressed == true){
      moveList(rects)
      moveList(circles)
    }
  };

  // Creation des élements
  function createRect(x = p.random(30, 280), y = p.random(30, 380), width = p.random(20, 180), height = p.random(20, 80), alpha = 255) {
    let rect = {
      type: "rect",
      x: x,
      y: y,
      width: width,
      height: height,
      color: pickColor(alpha),
      speed : p.int(p.random(-5,5)),
      direction : p.int(p.random(0,2))
    }

    return rect
  }


  function createcircle(x, y, size = p.random(20, 80)) {
    let circle = {
      type : "circle",
      x : x,
      y : y,
      size: size,
      lifespan: p.random(255,300),
      color: pickColor(),
      centerX: canvasWidth / 2,
      centerY: canvasHeight / 2,

      speed: p.random(0.01, 0.05)
    };

    let dx = circle.x - circle.centerX;
    let dy = circle.x - circle.centerY;
    circle.radius = p.dist(circle.centerX, circle.centerY, x, y);
    circle.angle = p.atan2(dy, dx);
    return circle;
  }

  //Dessiner les élements
  function drawcircle(circle) {
    p.fill(circle.color);
    p.ellipse(circle.x, circle.y, circle.size);

  }

  function drawRect(rectangle){
    // p.noStroke()
    p.fill(rectangle.color)
    p.rect(rectangle.x,rectangle.y,rectangle.width,rectangle.height)
  }

  function drawForm(form) {
    switch (form.type) {
      case "circle":
        drawcircle(form)
        break
      case "rect":
        drawRect(form)
        break
    }
  }

  function drawList(piecesList){
    for (let el of piecesList) {
      drawForm(el)
    }
  }

  function drawCanvas(){
    // moveList(rects)
    // moveList(circles)
    drawList(rects)
    drawList(circles)
  }

  // Générer la grille
  function generateGrid(){
    let pixStep = canvasWidth/stepGrid
    for(i =0; i<canvasWidth; i+=pixStep){
        for(j =0; j<canvasHeight; j+=pixStep){
            createPattern(i,j,pixStep)
            // pattern1(i,j,pixStep)
            // rects.push(createRect(i,j,pixStep,pixStep))
        }
    }
  }

  // Mouvement des elements
  function rectMove(rect){
    if(rect.direction ==0){
      rect.x += rect.speed
      rect.x = rect.x % canvasWidth
    }
    else {
      rect.y += rect.speed
      rect.y = rect.y % canvasHeight
    }
  }

  function circleMove(circle){
    circle.angle += circle.speed;
    circle.x = circle.centerX + circle.radius * p.cos(circle.angle);
    circle.y = circle.centerY + circle.radius * p.sin(circle.angle);

  }

  function moveList(piecesList){
    for (let el of piecesList) {
      if (el.type == "rect"){
        rectMove(el)
      }
      if (el.type == "circle"){
        circleMove(el)
      }
    }
  }


  // Patternes
  function createPattern(x,y,size){
    let rand = p.int(p.random(1,5))
    switch (rand) {
      case 1:
        pattern1(x,y,size)
        break
      case 2:
        pattern2(x,y,size)
        break
      case 3:
        pattern3(x,y,size)
        break
      case 4:
        pattern4(x,y,size)
        break
    }
    // pieces.push(createRect(x,y,size,size))
  }

  function pattern1(x,y,size){
    // rects.push(createRect(x,y,size,size))
    // rects.push(createRect(x,y,size,size))
    rects.push(createRect(x,y,size,size))
    circles.push(createcircle(x+size/2,y+size/2,size/2))
  }

  function pattern2(x,y,size){
    rects.push(createRect(x,y,size,size))
    rects.push(createRect(x,y,size,size))
    rects.push(createRect(x,y,size,size))
    rects.push(createRect(x,y,size,size))
  }

  function pattern3(x,y,size){
    rects.push(createRect(x,y,size,size/2))
    // rects.push(createRect(x,y,size,size/2))
    // rects.push(createRect(x,y+size/2,size,size/2))
    rects.push(createRect(x,y+size/2,size,size/2))
  }

  function pattern4(x,y,size){
    rects.push(createRect(x,y,size/4,size))
    rects.push(createRect(x+size/4,y,size/2,size))
    rects.push(createRect(x+3*size/4,y,size/4,size))
    rects.push(createRect(x,y,size/4,size))
    rects.push(createRect(x+size/4,y,size/2,size))
    rects.push(createRect(x+3*size/4,y,size/4,size))
  }


  // Gestion des couleurs
  function generateColors(){
    // colors.push(p.color(10, 20, 40))
    colors.push(p.color(255, 0, 110))
    colors.push(p.color(131, 56, 236))
    colors.push(p.color(176, 38, 255))
    // colors.push(p.color(255, 190, 11))
    colors.push(p.color(p.random(255),p.random(255),p.random(255)))
    // colors.push(p.color(p.random(255),p.random(255),p.random(255)))
    // colors.push(p.color(p.random(255),p.random(255),p.random(255)))
  }

  function pickColor(alpha = 250){
    let rand = p.int(p.random(colors.length));
    let c = colors[rand];

    return p.color(p.red(c), p.green(c), p.blue(c), alpha);
  }
};
