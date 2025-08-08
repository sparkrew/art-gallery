var sketch = function (p) {
  let img;
  let margin = 400;
  let lines = [];
  let circles = [];
  let monoSynth;
  let newLines = [];
  let epsilon = 0.001;
  let buffer = 5;
  let zoomFactor = 0.85;
  let angle = 0;
  let vignetteLayer;

  let speed = 60;
  let numberOfEntities = 150;
  let zoomSpeed = 1;
  let angleSpeed = 0;

  let cam;
  let angleX = 0;
  let angleY = 0;
  let radius = 2000;
  let minRadius = 200;
  let maxRadius = 5000;
  let autoRotate = false;

  let envPool = [];
  let oscPool = [];
  let poolSize = 10;
  let chromaticScale = [277.18, 311.13, 369.99, 415.3, 466.16];

  let width;
  let height;

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height, p.WEBGL);
    canvas.parent("artwork-container");

    cam = p.createCamera();
    img = p.createGraphics(p.windowWidth, p.windowWidth);

    for (let i = 0; i < poolSize; i++) {
      let env = new p5.Envelope();
      let osc = new p5.Oscillator("triangle");
      osc.start();
      osc.freq(0);
      osc.amp(env);
      envPool.push(env);
      oscPool.push(osc);
    }

    for (let i = 0; i < numberOfEntities; i++) {
      let x = p.random(img.width);
      let y = p.random(img.height);
      let l = p.random(60, 600);
      let o = (Math.floor(p.random(0, 4)) * Math.PI) / 2;
      let line = new Line(x, y, l, o);
      let circle = new Circle(x, y, l / 4);
      lines.push(line);
      circles.push(circle);
    }
  };

  p.draw = function () {
    p.background(0);

    if (autoRotate) {
      angleX = (Math.sin(p.frameCount * 0.01) * p.PI) / 4;
      angleY += 0.01;
    } else {
      angleX = p.map(p.mouseY, 0, p.height, -p.PI / 2, p.PI / 2);
      angleY = p.map(p.mouseX, 0, p.width, -p.PI, p.PI);
    }

    let camX = radius * Math.cos(angleX) * Math.sin(angleY);
    let camY = radius * Math.sin(angleX);
    let camZ = radius * Math.cos(angleX) * Math.cos(angleY);

    cam.setPosition(camX, camY, camZ);
    cam.lookAt(0, 0, 0);

    let taille = 1000;

    p.normalMaterial();
    p.push();
    update2D(img);
    p.texture(img);
    p.box(taille);
    p.pop();
  };

  p.mousePressed = function () {
    autoRotate = true;
  };

  p.mouseReleased = function () {
    autoRotate = false;
  };

  p.mouseWheel = function (event) {
    radius += event.delta;
    radius = p.constrain(radius, minRadius, maxRadius);
  };

  function update2D(img) {
    img.clear();
    img.background(0, 0, 0, 0);
    img.frameRate(speed);

    img.fill(255);
    img.textSize(16);
    img.strokeWeight(1);

    img.push();
    img.translate(img.width / 2, img.height / 2);
    img.scale(zoomFactor);
    img.rotate(angle);
    img.translate(-img.width / 2, -img.height / 2);
    angle += p.radians(angleSpeed);
    zoomFactor *= zoomSpeed;

    newLines = [];
    detectCollisions();

    for (let c of circles) {
      c.show(img);
    }

    for (let l of lines) {
      l.move();
      l.show(img);
    }

    img.pop();
  }

  function detectCollisions() {
    for (let l of lines) {
      for (let c of circles) {
        if (lineIntersectsCircle(l, c)) {
          randomColoring(l, c);
        }
      }
    }
  }

  function lineIntersectsCircle(line, circle) {
    if (line.o == Math.PI / 2 || line.o == (Math.PI * 3) / 2) {
      let y2 = line.y + Math.sin(line.o) * line.l;
      let r = circle.r / 2;
      let a = (line.y - y2) ** 2;
      let b = 2 * (line.y * y2 - y2 ** 2 - circle.y * (line.y - y2));
      let c =
        circle.y ** 2 +
        (line.x - circle.x) ** 2 -
        r ** 2 -
        2 * circle.y * y2 +
        y2 ** 2;

      let delta = b ** 2 - 4 * a * c;

      if (delta >= 0) {
        let r1 = (-b - Math.sqrt(delta)) / (2 * a);
        let r2 = (-b + Math.sqrt(delta)) / (2 * a);

        let p = Math.min(1, r2) - Math.max(0, r1);
        if (
          p * line.l + epsilon >=
          2 * Math.sqrt(r ** 2 - (circle.x - line.x) ** 2)
        ) {
          return true;
        }
      } else if (delta < 0 && a <= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      let x2 = line.x + Math.cos(line.o) * line.l;
      let r = circle.r / 2;
      let a = (line.x - x2) ** 2;
      let b = 2 * (line.x * x2 - x2 ** 2 - circle.x * (line.x - x2));
      let c =
        circle.x ** 2 +
        (line.y - circle.y) ** 2 -
        r ** 2 -
        2 * circle.x * x2 +
        x2 ** 2;

      let delta = b ** 2 - 4 * a * c;

      if (delta >= 0) {
        let r1 = (-b - Math.sqrt(delta)) / (2 * a);
        let r2 = (-b + Math.sqrt(delta)) / (2 * a);

        let p = Math.min(1, r2) - Math.max(0, r1);
        if (
          p * line.l + epsilon >=
          2 * Math.sqrt(r ** 2 - (circle.y - line.y) ** 2)
        ) {
          return true;
        }
      } else if (delta < 0 && a <= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  function randomColoring(line, circle) {
    if (line.o == 0 || line.o == Math.PI) {
      let theta1 = Math.asin((circle.y - line.y) / (circle.r / 2)) + Math.PI;
      let theta2 =
        Math.acos((circle.y - line.y) / (circle.r / 2)) - Math.PI / 2;
      let rand = p.int(p.random(4));

      ark = new Arc(circle.x, circle.y, circle.r, theta1, theta2, rand, line);

      let toAdd = true;
      for (a of circle.arcs) {
        if (a.line == ark.line) {
          toAdd = false;
        }
      }

      if (toAdd) {
        if (circle.arcs.length >= buffer) {
          circle.arcs.shift();
          circle.arcs.push(ark);
        } else {
          circle.arcs.push(ark);
        }
      }
    } else {
      let theta1 =
        Math.asin((circle.x - line.x) / (circle.r / 2)) + Math.PI / 2;
      let theta2 = Math.acos((circle.x - line.x) / (circle.r / 2)) - Math.PI;
      let rand = p.random(5);

      ark = new Arc(
        circle.x,
        circle.y,
        circle.r,
        theta1,
        theta2,
        rand,
        line,
        circle
      );

      let toAdd = true;

      for (a of circle.arcs) {
        if (a.line == ark.line) {
          toAdd = false;
        }
      }

      if (toAdd) {
        if (circle.arcs.length >= buffer) {
          circle.arcs.shift();
          circle.arcs.push(ark);
        } else {
          circle.arcs.push(ark);
        }
      }
    }
  }

  class Line {
    constructor(x, y, l, o) {
      this.x = x;
      this.y = y;
      this.l = l;
      this.o = o;
      this.sliced = false;
    }

    show(img) {
      img.stroke(255);
      img.strokeWeight(1);
      img.line(
        this.x,
        this.y,
        this.x + Math.cos(this.o) * this.l,
        this.y + Math.sin(this.o) * this.l
      );
    }

    move() {
      this.y += 10 * Math.sin(this.o);
      this.x += 10 * Math.cos(this.o);

      if (this.x + Math.cos(this.o) * this.l > img.width + 10 && !this.sliced) {
        newLines.push(
          new Line(0 - Math.cos(this.o) * this.l, this.y, this.l, this.o)
        );
        this.sliced = true;
      }
      if (this.x + Math.cos(this.o) * this.l < -10 && !this.sliced) {
        newLines.push(
          new Line(
            img.width - Math.cos(this.o) * this.l,
            this.y,
            this.l,
            this.o
          )
        );
        this.sliced = true;
      }
      if (
        this.y + Math.sin(this.o) * this.l > img.height + 10 &&
        !this.sliced
      ) {
        newLines.push(
          new Line(this.x, 0 - Math.sin(this.o) * this.l, this.l, this.o)
        );
        this.sliced = true;
      }
      if (this.y + Math.sin(this.o) * this.l < -10 && !this.sliced) {
        newLines.push(
          new Line(
            this.x,
            img.height - Math.sin(this.o) * this.l,
            this.l,
            this.o
          )
        );
        this.sliced = true;
      }

      if (
        this.x < img.width + margin &&
        this.x > -margin &&
        this.y < img.height + margin &&
        this.y > -margin
      ) {
        newLines.push(this);
      }

      lines = newLines;
    }
  }

  class Circle {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.linesIntersect = [];
      this.arcs = [];
    }

    show(img) {
      for (let a of this.arcs) {
        a.show(img);
      }
      img.stroke(255);
      img.strokeWeight(1);
      img.noFill();
      img.circle(this.x, this.y, this.r);
    }
  }

  class Arc {
    constructor(x, y, r, theta1, theta2, rand, line, circle) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.theta1 = theta1;
      this.theta2 = theta2;
      this.rand = rand;
      this.line = line;
      this.played = false;
      this.circle = circle;
    }

    show(img) {
      if (this.rand > 4.8) {
        img.noStroke();
        img.fill(255, 0, 0);
        img.arc(
          this.x,
          this.y,
          this.r,
          this.r,
          this.theta1,
          this.theta2,
          p.CHORD
        );
        if (!this.played) {
          playNote(this.circle, this.theta1, this.theta2);
          this.played = true;
        }
      } else {
        img.noStroke();
        img.fill(0 + 200 / (1 + this.rand));
        img.arc(
          this.x,
          this.y,
          this.r,
          this.r,
          this.theta1,
          this.theta2,
          p.CHORD
        );
      }
    }
  }

  function playNote(circle, theta1, theta2) {
    let vol = p.random(0.1, 0.3);
    let attackTime = 0.5;
    let decayTime = 0;
    let sustainLevel = vol;
    let sustainTime = p.map(Math.abs(theta1 - theta2), 0, 2 * p.PI, 0, 1);
    let releaseTime = 1;

    let env = envPool.shift();
    let osc = oscPool.shift();

    if (env && osc) {
      env.setADSR(attackTime, decayTime, sustainLevel, releaseTime);
      env.setRange(vol, 0);

      osc.freq(
        chromaticScale[
          p.int(p.map(circle.r, 20, 200, chromaticScale.length, 0))
        ]
      );
      env.triggerAttack(osc);

      let totalDuration = attackTime + decayTime + sustainTime + releaseTime;

      setTimeout(() => {
        env.triggerRelease(osc);
      }, (attackTime + decayTime + sustainTime) * 1000);

      setTimeout(() => {
        osc.freq(0);
        envPool.push(env);
        oscPool.push(osc);
      }, totalDuration * 1000);
    }
  }
};
