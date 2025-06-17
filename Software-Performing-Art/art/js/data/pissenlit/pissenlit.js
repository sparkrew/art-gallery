// En collaboration avec Etienne Colin
// Inspiration : pissenlit lorsqu'on souffle dessus

var sketch = function (p) {
  var iris;
  var irisLength;
  var maxSl = 0;
  var minSl = Number.POSITIVE_INFINITY;
  var maxSw = 0;
  var minSw = Number.POSITIVE_INFINITY;
  var maxPl = 0;
  var minPl = Number.POSITIVE_INFINITY;
  var maxPw = 0;
  var minPw = Number.POSITIVE_INFINITY;

  let width;
  let height;

  let points = [];

  class Point {
    constructor(x, y, angle, speed, flower) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      this.flower = flower;
    }

    update() {
      //this.angle = (this.angle + 0.001) % p.TWO_PI;
      this.x += p.cos(this.angle) * this.speed;
      this.y += p.sin(this.angle) * this.speed;
      /*
      // Bounce off the edges
      if (this.x < 0 || this.x > p.width) this.vx *= -1;
      if (this.y < 0 || this.y > p.height) this.vy *= -1;
      */
    }

    display() {
      p.stroke(255);
      p.strokeWeight(4);
      //p.point(this.x, this.y);
      var species;
      if (this.flower["species"] == "setosa") {
        species = "se";
      } else if (this.flower["species"] == "versicolor") {
        species = "vs";
      } else {
        species = "vg";
      }

      let r = p.map(this.flower["sepalLength"], minSl, maxSl, 0.0, 120);
      let g = p.map(this.flower["sepalWidth"], minSw, maxSw, 0.0, 120);
      let b = p.map(this.flower["petalWidth"], minPw, maxPw, 0.0, 120);
      let h = r + g + b;
      console.log(h);
      p.fill(h, 100, 50);

      //p.fill(r, g, b);
      p.stroke(255, 0);
      p.text(species, this.x, this.y);

      // this.flower["species"]
      // TODO: display letter letter
    }
  }

  p.preload = function () {
    iris = p.loadJSON("art/js/data/pissenlit/iris.json");
  };

  p.setup = function () {
    p.colorMode(p.HSL);
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    irisLength = Object.keys(iris).length;

    const centerX = p.width / 2;
    const centerY = p.height / 2;
    const speed = 2;
    for (let i = 0; i < irisLength; i++) {
      let flower = iris[i];

      maxSl = Math.max(maxSl, flower["sepalLength"]);
      minSl = Math.min(minSl, flower["sepalLength"]);
      maxSw = Math.max(maxSw, flower["sepalWidth"]);
      minSw = Math.min(minSw, flower["sepalWidth"]);
      maxPl = Math.max(maxPl, flower["petalLength"]);
      minPl = Math.min(minPl, flower["petalLength"]);
      maxPw = Math.max(maxPw, flower["petalWidth"]);
      minPw = Math.min(minPw, flower["petalWidth"]);
    }

    for (let i = 0; i < irisLength; i++) {
      let flower = iris[i];

      const angle = p.random(p.TWO_PI);
      let speed = p.map(flower["petalLength"], minPl, maxPl, 0.1, 0.5);
      points.push(new Point(centerX, centerY, angle, speed, flower));
    }
  };

  p.draw = function () {
    p.background(0);
    /*
    if (p.frameCount < 400) {
      p.background(0);
    }
    **/
    //p.background(0, 8);

    for (let pt of points) {
      if (p.frameCount % 360 == 0) {
        pt.angle = (pt.angle + 180) % 360;
        //pt.angle = (pt.angle + p.PI) % p.TWO_PI;
      }
      //species = pt.flower()["species"];
      //p.text()
      pt.update();
      pt.display();
    }
  };
};
