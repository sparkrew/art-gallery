var sketch = function (p) {
  let width;
  let height;
  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height, p.WEBGL);
    canvas.parent("artwork-container");

    p.stroke(107, 252, 3);
    p.strokeWeight(5);
    p.noFill();
  };

  p.draw = function () {
    p.background(25);

    p.push();
    p.rotate(0.01 * p.frameCount, [1, 1, 1]);
    p.box(50, 50);
    p.pop();

    p.push();
    p.rotate(0.01 * p.frameCount, [-1, -1, 0]);
    p.box(150, 150);
    p.pop();

    p.push();
    p.rotate(0.01 * p.frameCount, [-1, 0, 1]);
    p.box(250, 250);
    p.pop();
  };
};
