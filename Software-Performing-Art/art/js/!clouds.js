var sketch = function (p) {
  let nbClouds = 10;
  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.background(148, 178, 227);
    p.noStroke();
  };
  async function setCanvasSize() {
    var element = await document.getElementById("artwork-container");
    var positionInfo = element.getBoundingClientRect();
    var divh = positionInfo.height;
    var divw = positionInfo.width;
    p.resizeCanvas(divw, divh);
    p.background(148, 178, 227);
  }

  p.draw = function () {
    for (let i = 0; i < nbClouds; i++) {
      p.fill(p.random(180, 220));
      let x = p.random(0, p.width);
      let y = p.random(0, p.height);

      p.circle(x, y, p.random(40, 60));
      p.circle(x + p.random(20, 30), y + p.random(5, 10), p.random(25, 35));
      p.circle(x - p.random(20, 30), y + p.random(5, 10), p.random(25, 35));
    }

    p.circle(p.width / 2, p.height / 2, 100);
    p.circle(p.width / 2 + 50, p.height / 2 + 20, 75);
    p.circle(p.width / 2 - 50, p.height / 2 + 5, 75);
    p.noLoop();
  };
  p.windowResized = function () {
    setCanvasSize();
  };
};
