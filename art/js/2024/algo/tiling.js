/*
    title: Tiling
    author: LenaMK
    date: 2023-02-14
    description: 
*/
var sketch = function (p) {
  var looping = true;

  var vermeer = true;
  var rotateTiles = false;
  var showStroke = false;
  var tileOverflow = false;
  var recursion = true;
  var depth = 2;

  var xoff, yoff;
  var incx = 0.55;
  var incy = 0.05;
  var incz = 0.2;
  var zoff = 0.0;
  var variance = 0.002;

  var side; //size of square
  var diag; //hypothénuse

  var nbSquares = 12;

  var fontsize = 35;
  var textboxAscent, textboxDescent, textboxHeight;
  let width;
  let height;

  p.setup = function () {
    p.colorMode(p.HSB, 360, 100, 100, 250);
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.frameRate(1);
    p.textSize(fontsize);
    textboxAscent = p.textAscent();
    textboxDescent = p.textDescent();
    textboxHeight = textboxAscent + textboxDescent;

    var ratio = width / height;

    //size of square
    if (ratio < 1) side = height / nbSquares;
    else side = width / nbSquares;

    diag = Math.sqrt(side * side * 2); //hypothénuse
    margin = 50;

    if (showStroke) p.stroke(0, 0, 50, 250);
    else p.noStroke();

    if (!looping) p.noLoop();
  };

  function makeTile(x, y, size) {
    var letsTry = Math.floor(p.random(100));
    console.log(letsTry);

    p.fill(0, 0, 100, 250);

    //Exit function
    if (size > 10 && letsTry % 2 == 0) {
      makeTile(x, y, size / 4);
      makeTile(x + size / 4, y, size / 4);
      makeTile(x, y + size / 4, size / 4);
      makeTile(x + size / 4, y + size / 4, size / 4);
    } else {
      //translate canvas to tile location
      p.push();
      p.translate(x, y);
      p.rect(0, 0, size, size); //white square basis

      var small = Math.sqrt((((size / 4) * size) / 4) * 2);

      //black square fill
      p.fill(0, 0, 0, 250);
      for (let i = 1; i <= 3; i += 2) {
        for (let j = 1; j <= 3; j += 2) {
          p.push();
          p.rectMode(p.CENTER);
          p.angleMode(p.DEGREES);
          p.translate((size * j) / 4, (size * i) / 4);
          p.rotate(45);
          p.rect(0, 0, small, small);
          p.pop();
        }
      }

      //overflow
      if (tileOverflow) {
        p.fill(0, 0, 100, 250);

        for (let i = 0; i <= 4; i += 2) {
          for (let j = 0; j <= 4; j += 2) {
            p.push();
            p.rectMode(p.CENTER);
            p.translate((diag / 4) * j, (diag / 4) * i);
            p.rotate(45);
            p.rect(0, 0, small, small);
            p.pop();
          }
        }
      }
      //vermeer style fill
      p.fill(0, 0, 0, 250);
      if (vermeer) {
        p.push();
        p.rectMode(p.CENTER);
        p.rect(size / 2, size / 2, size / 2, size / 2);
        p.pop();
      }

      p.pop();
    }
  }

  /*suggestions
- travailler sur le ton pour évolution
- real tiles (no empty spaces),movement at the scale of the tile
*/
  p.draw = function () {
    p.background(0, 0, 0);
    p.fill(0, 0, 100, 250);

    yoff = 0.0;

    for (let y = margin; y < height - diag - margin; y += diag) {
      xoff = 0.0;

      for (let x = margin; x < width - diag - margin; x += diag) {
        xoff += incx;

        //
        makeTile(x, y, diag, xoff, yoff, zoff);
      }

      yoff += incy;
    }

    //proof that it loops
    ///circle(mouseX, mouseY, 50);

    //end of frame
    zoff += variance;
  };
};
