/* BezierCurves

References:
https://www.youtube.com/watch?v=uctX1P3H3xM
https://editor.p5js.org/PeterQwertz/sketches/Mh7aSsyMl


vec_of_bezier_lines = [...,...,...]
new_point = point
vec_of_bezier_lines[i % len(vec)] = new_point
*/
var sketch = function (p) {
  let pause = false;
  let x1, y1, x2, y2, x3, y3, x4, y4;
  let i = 30;
  let offset = 100;
  let speed = 0.005;
  let j1 = -100;
  let j2 = -100;
  let j3 = 100;
  let j4 = 100;

  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.background(5);
  };

  p.draw = function () {
    // background(0)

    // noLoop()

    bezier_func(1);

    // Tests:
    // call_bezier(2)
  };

  function bezier_func(l) {
    p.background(5, 5, 5, 6);
    p.noFill();
    p.strokeWeight(4);

    p.stroke(
      200,
      0,
      0, // red
      // 200, 200, 0, // yellow
      // noise(offset + i) * 300,
      // noise(offset + i * 2) * 300, // adds color
      // noise(offset + i * 3) * 300, // adds color
      40
    );

    x1 = (p.noise(offset + i) * width + j1) * l;
    y1 = (p.noise(offset + i * 2) * height + j1) * l;
    x2 = (p.noise(offset + i * 3) * width + j2) * l;
    y2 = (p.noise(offset + i * 4) * height + j2) * l;
    x3 = (p.noise(offset + i * 5) * width + j3) * l;
    y3 = (p.noise(offset + i * 6) * height + j3) * l;
    x4 = (p.noise(offset + i * 7) * width + j4) * l;
    y4 = (p.noise(offset + i * 8) * height + j4) * l;

    p.bezier(
      x1,
      y1,
      x2,
      y2,
      x3,
      y3,
      // x4, y4,
      x1,
      y1
    );
    offset += speed;
  }

  function mousePressed() {
    if (pause == false) {
      p.noLoop();
      pause = true;
    } else {
      p.loop();
      pause = false;
    }
  }

  function call_bezier(l) {
    if (l < 0.1) {
      return;
    } else {
      bezier_func(l);
      call_bezier(l / 2);
    }
  }
};
