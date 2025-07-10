var sketch = function (p) {
  let colored = true;
  let loop = true;
  let buildSpeed = 15;
  let order = 7;
  let N = Math.pow(2, order);
  let total = N * N;
  let path = [];
  let pathCol = [];
  let shapeColor = [];
  let counter = 0;
  let img;
  let fillWith = 0; //0 -> regular, 1 -> ellipse, 2->image
  let width;
  let height;

  function preload() {
    if (fillWith == 2) {
      img = loadImage("../art/js/2024/algo/hilbert_curve/logoUdem.png");
    }
  }

  p.setup = function () {
    if (fillWith == 2) {
      p.colorMode(p.RGB, 360, 255, 255);
    } else {
      p.colorMode(p.HSB, 360, 255, 255);
    }

    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");

    //get all points location
    for (let i = 0; i < total; i++) {
      path[i] = hilbert(i);
      len = height / N;
      path[i].mult(len);
      path[i].add(len / 2, len / 2);
    }

    if (fillWith == 1) {
      //fill with an ellipse
      p.fill(255);
      p.ellipse(width / 2, width / 2, width / 2, width / 2);
      shapeColor = get(width / 2, width / 2);
    } else if (fillWith == 2) {
      //fill with an image
      p.image(img, 0, 0, 800, 700);
    }

    for (let i = 0; i < path.length; i++) {
      pathCol[i] = p.get(path[i].x, path[i].y);
    }
    p.background(200);
  };

  p.draw = function () {
    drawCurve();
  };

  function sameColor(col1, col2) {
    return JSON.stringify(col1) == JSON.stringify(col2);
  }

  function drawCurve() {
    p.beginShape();
    p.noFill();
    p.strokeWeight(3);
    for (let i = 0; i < counter; i++) {
      if (colored) {
        if (fillWith == 2) {
          //fill with image
          p.stroke(pathCol[i][0], pathCol[i][1], pathCol[i][2]);
        } else if (fillWith == 1) {
          // fillwith  an ellipse

          if (sameColor(shapeColor, pathCol[i])) {
            h = map(i, 0, path.length, 0, 360);
            p.stroke(h, 255, 255);
          } else {
            p.stroke(255);
          }
        } else {
          h = p.map(i, 0, path.length, 0, 360);
          p.stroke(h, 255, 255);
        }
      } else {
        p.stroke(255);
      }

      p.line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
      //triangle(path[i].x, path[i].y, path[i+1].x, path[i+1].y, path[i+2].x, path[i+2].y);
    }
    p.endShape();

    if (buildSpeed == 0 || buildSpeed >= total) {
      counter += total - 1;
    } else {
      counter += buildSpeed;
    }

    if (counter >= path.length) {
      if (loop) {
        counter = 1;
      } else {
        p.noLoop();
      }
    }
  }

  function hilbert(i) {
    points = [
      p.createVector(0, 0),
      p.createVector(0, 1),
      p.createVector(1, 1),
      p.createVector(1, 0),
    ];

    let index = i % 4;
    let v = points[index];
    let u = i;

    for (var j = 1; j < order; j++) {
      i = Math.trunc(i / 4);
      index = i % 4;
      let leng = Math.pow(2, j);
      if (index == 0) {
        let temp = v.x;
        v.x = v.y;
        v.y = temp;
      } else if (index == 1) {
        v.y += leng;
      } else if (index == 2) {
        v.x += leng;
        v.y += leng;
      } else if (index == 3) {
        var temp = leng - 1 - v.x;
        v.x = leng - 1 - v.y;
        v.y = temp;
        v.x += leng;
      }
    }

    return v;
  }
};
