var sketch = function (p) {
  let x = 0;
  let y = 0;
  let a = 1.641;
  let b = 1.902;
  let c = 0.316;
  let d = 1.525;
  let scaleFactor = 200;

  let red, green, blue, baseHue;

  let WIDTH;
  let HEIGHT;
  let textDisplay = true;

  let niceShapes = [
    [
      -2.430208197055763, -0.1412899183132339, -3.777287976692114,
      2.0557980475025275,
    ],
    [
      8.44429121184001, 1.0797997890047206, -3.730966926025337,
      8.289829516752008,
    ],
    [
      -3.0882656648508267, -6.152900514058219, -3.20685774566358,
      3.267318267214174,
    ],
    [
      -0.6248992815658743, -1.5396267542386717, 1.2372708202073945,
      -0.9018103234879042,
    ],
  ];

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    WIDTH = container.offsetWidth;
    HEIGHT = container.offsetHeight;
    const canvas = p.createCanvas(WIDTH, HEIGHT);
    canvas.parent("artwork-container");
    //let sizeX = (p.windowWidth - p.width) / 2;
    //let sizeY = (p.windowHeight - p.height) / 2;
    //cnv.position(sizeX, sizeY);
    p.background(0);
    p.colorMode(p.HSB, 360, 100, 100, 1);

    a = p.random(-2, 2);
    b = p.random(-2, 2);
    c = p.random(-2, 2);
    d = p.random(-2, 2);

    console.log(a, b, c, d);
    baseHue = p.random(300);
  };

  p.draw = function () {
    p.push();
    p.fill(baseHue, 0, 100, 0.5);
    p.strokeWeight(0.05);
    p.textSize(10);
    p.text(a.toFixed(3), 50, p.height - 15, p.width / 4 - 40);
    p.text(b.toFixed(3), p.width / 4 + 50, p.height - 15, p.width / 4 - 40);
    p.text(c.toFixed(3), p.width / 2 + 50, p.height - 15, p.width / 4 - 40);
    p.text(
      d.toFixed(3),
      (3 * p.width) / 4 + 50,
      p.height - 15,
      p.width / 4 - 40
    );
    p.pop();

    baseHue = (baseHue + 180) % 360;
    p.stroke(baseHue, 0, 100, 0.7);
    p.translate(p.width / 2, p.height / 2);

    for (let i = 0; i < 1000; i++) {
      p.point(scaleFactor * x, scaleFactor * y);
      let temp = x;
      x = Math.sin(a * y) - Math.cos(b * x);
      y = Math.sin(c * temp) - Math.cos(d * y);
    }
  };
};
