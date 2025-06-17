var sketch = function (p) {
  let x, y, lengthX, lengthY;
  let numberTriangles = 0;
  let numberMaxTriangles = 300;
  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    //background(177, 118, 219);
    p.background(p.random(0, 255));
  };

  p.draw = function () {
    if (numberTriangles < numberMaxTriangles) {
      x = p.random(-30, p.width + 30);
      y = p.random(-30, p.height + 30);
      lengthX = p.random(35, 70);
      lengthY = p.random(35, 70);
      numberTriangles += 1;
      p.noStroke();

      //fill(214, 192, 26, p.random(35, 200));
      p.fill(
        p.random(0, 255),
        p.random(0, 255),
        p.random(0, 255),
        p.random(35, 200)
      );
      p.push();
      p.translate(x, y);
      p.rotate(p.random(0, 360));
      p.triangle(0, 0, lengthX, lengthY / 2, lengthX, -lengthY);
      p.pop();
    }
  };
};
