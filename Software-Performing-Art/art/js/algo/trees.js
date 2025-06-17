var sketch = function (p) {
  // Variables encapsulées dans l'instance p
  let WIDTH, HEIGHT;

  let lSystem;
  let numberRecursions = 7;

  let numberTrees;
  let trees = [];
  let trunkPieces = 10;
  let lenInf = 100;
  let lenSup = 250;

  let numberStars = 42;
  let stars = [];
  let numberShootingStars = 1;
  let shootingStars = [];

  let c1, c2;
  let backgroundFlag = true;

  p.setGradient = function (c1, c2, end = HEIGHT, begin = 0) {
    p.noFill();
    for (let y = begin; y < end; y++) {
      let inter = p.map(y, 0, HEIGHT, 0, 1);
      let c = p.lerpColor(c1, c2, inter);
      p.stroke(c);
      p.line(0, y, WIDTH, y);
    }
  };

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    WIDTH = container.offsetWidth;
    HEIGHT = container.offsetHeight;

    p.createCanvas(WIDTH, HEIGHT);
    p.angleMode(p.DEGREES);
    p.frameRate(60);

    loadRule();

    numberTrees = p.floor(p.random(4, 7));

    for (let i = 0; i < numberTrees; i++) {
      let tree = new Tree(p, WIDTH, HEIGHT, trunkPieces, lenInf, lenSup);
      tree.generate(numberRecursions);
      trees.push(tree);
    }

    for (let i = 0; i < numberStars; i++) {
      stars.push(new Stars(p, WIDTH, HEIGHT));
    }

    for (let i = 0; i < numberShootingStars; i++) {
      shootingStars.push(new Shooting(p, WIDTH, HEIGHT));
    }

    c1 = p.color(40, 15, 54, 255);
    c2 = p.color(240, 159, 156, 255);
    p.setGradient(c1, c2);
  };

  async function setCanvasSize() {
    var element = await document.getElementById("artwork-container");
    var positionInfo = element.getBoundingClientRect();
    var divh = positionInfo.height;
    var divw = positionInfo.width;
    p.resizeCanvas(divw, divh);
  }

  p.draw = function () {
    if (backgroundFlag) {
      c1 = p.color(40, 15, 54, 255);
      c2 = p.color(240, 159, 156, 255);
      p.setGradient(c1, c2);
      backgroundFlag = false;
    } else {
      p.setGradient(
        p.color(40, 15, 54, 50),
        p.color(240, 159, 156, 50),
        HEIGHT / 2,
        0
      );
      p.setGradient(
        p.color(40, 15, 54, 200),
        p.color(240, 159, 156, 200),
        HEIGHT,
        HEIGHT / 2
      );
    }

    for (let i = 0; i < numberStars; i++) {
      stars[i].update();
      stars[i].draw();
    }

    for (let i = 0; i < numberShootingStars; i++) {
      if (p.random() < 0.05) {
        shootingStars[i].revive();
      }
      shootingStars[i].update();
      shootingStars[i].draw();
    }

    for (let i = 0; i < numberTrees; i++) {
      p.push();
      p.stroke(0);
      trees[i].draw();
      p.pop();
    }
  };

  function loadRule() {
    lSystem = {
      axiom: "TZ",
      rules: {
        0: "[+FZ[-FZ]]F[-FZ]",
        1: "[-FZ[+FZ]]F[+FZ]",
        2: "[[+F[FZ]][-F[FZ]]]+F[FZ]",
        3: "[-[F[FZ]][+F[FZ]]]-F[FZ]",
        F: "F",
      },
      constants: {
        numberRules: 4,
        "[": p.push,
        "]": p.pop,
      },
    };
  }

  function doRecursion(n) {
    let currentSeq = lSystem["axiom"];
    let nextSeq = "";
    if (n == 0) {
      return currentSeq;
    }
    while (n != 0) {
      for (let i = 0; i < currentSeq.length; i++) {
        let variable = currentSeq[i];
        if (variable == "Z") {
          nextSeq +=
            lSystem["rules"][
              p.floor(p.random(lSystem["constants"]["numberRules"]))
            ];
        } else if (variable in lSystem["rules"]) {
          nextSeq += lSystem["rules"][variable];
        } else {
          nextSeq += variable;
        }
      }
      currentSeq = nextSeq;
      nextSeq = "";
      n--;
    }
    return currentSeq;
  }

  // Class Stars adapted to instance mode
  class Stars {
    constructor(p, w, h) {
      this.p = p;
      this.WIDTH = w;
      this.HEIGHT = h;
      this.x = p.random(this.WIDTH);
      this.y = p.random(20, this.HEIGHT / 3);
      this.r = p.random(0.25, 3);
      this.lifeTime = p.floor(p.random(42));
    }

    update() {
      this.lifeTime++;
      this.r += 0.01 * this.p.sin(this.lifeTime);
    }

    draw() {
      this.p.noStroke();
      this.p.fill(255);
      this.p.ellipse(this.x, this.y, this.r, this.r);
      this.p.noFill();
    }
  }

  class Shooting {
    constructor(p, w, h) {
      this.p = p;
      this.WIDTH = w;
      this.HEIGHT = h;
      this.fallingSide = p.random();
      this.x = p.random(50, this.WIDTH - 50);
      this.y = p.random(20, this.HEIGHT / 3);
      this.r = p.random(0.25, 3);
      this.fallingSpeed = p.random(0.5, 2);
      this.lifeTime = p.random(30, 80);
      this.lifeReduction = 1;
      this.dead = true;
    }

    revive() {
      if (this.dead) {
        this.fallingSide = this.p.random();
        this.x = this.p.random(50, this.WIDTH - 50);
        this.y = this.p.random(20, this.HEIGHT / 3);
        this.r = this.p.random(0.5, 3);
        this.fallingSpeed = 1;
        this.lifeTime = this.p.floor(this.p.random(30, 80));
        this.lifeReduction = 1;
        this.dead = false;
      }
    }

    update() {
      if (this.fallingSide < 0.5) {
        this.x -= 2;
      } else {
        this.x += 2;
      }
      this.y += this.fallingSpeed;
      this.lifeTime -= this.lifeReduction;
      if (this.lifeTime <= 0) {
        this.dead = true;
      }
    }

    draw() {
      if (!this.dead) {
        this.p.noStroke();
        this.p.fill(255);
        this.p.ellipse(this.x, this.y, this.r, this.r);
        this.p.noFill();
      }
    }
  }

  class Tree {
    constructor(p, w, h, trunkPieces, lenInf, lenSup) {
      this.p = p;
      this.WIDTH = w;
      this.HEIGHT = h;
      this.trunkPieces = trunkPieces;
      this.lenInf = lenInf;
      this.lenSup = lenSup;

      this.sequence = "";
      this.scale = p.random(0.2, 0.3);
      this.len = p.random(lenInf, lenSup);
      this.lw = p.map(this.len, lenInf, lenSup, 9, 15);
      this.angle = 35;
      this.posX = p.random(this.WIDTH);
      this.posY = p.random(this.HEIGHT, this.HEIGHT + 50);

      this.windAngle = p.random(6, 15);
      this.windSpeed = p.random(1, 6);
      this.rigidity = p.map(this.len, 10, lenSup, 1.0, 0.2);
      this.windDiff =
        this.windAngle *
        (p.noise(p.frameCount * this.windSpeed) - 0.05) *
        this.rigidity;

      this.trunkAngles = [];
    }

    generate(numberRecursions) {
      this.sequence = doRecursion(numberRecursions);
      for (let i = 0; i < this.trunkPieces; i++) {
        this.trunkAngles[i] = this.p.random(-5, 5);
      }
    }

    drawTrunk() {
      for (let i = 0; i < this.trunkPieces; i++) {
        this.p.strokeWeight(this.lw);
        this.p.rotate(this.trunkAngles[i]);
        this.p.line(0, 0, 0, -this.len / this.trunkPieces);
        this.p.translate(0, -this.len / this.trunkPieces);
        this.lw *= 0.9;
      }
    }

    draw() {
      this.p.translate(this.posX, this.posY);
      for (let i = 0; i < this.sequence.length; i++) {
        let variable = this.sequence[i];
        if (variable == "F") {
          this.p.strokeWeight(this.lw);
          this.p.line(0, 0, 0, -this.scale * this.len);
          this.p.translate(0, -this.scale * this.len);
        } else if (variable == "T") {
          this.p.strokeWeight(this.lw);
          this.drawTrunk();
        } else if (variable == "+") {
          this.rigidity = this.p.map(this.len, 10, this.lenSup, 1.0, 0.2);
          this.windDiff =
            this.windAngle *
            (this.p.noise(this.p.frameCount * this.windSpeed) - 0.05) *
            this.rigidity;
          this.p.rotate(
            this.angle + 15 * this.p.noise(this.len) + this.windDiff
          );
        } else if (variable == "-") {
          this.rigidity = this.p.map(this.len, 10, this.lenSup, 1.0, 0.2);
          this.windDiff =
            this.windAngle *
            (this.p.noise(this.p.frameCount * this.windSpeed) - 0.05) *
            this.rigidity;
          this.p.rotate(
            -this.angle + 15 * this.p.noise(this.len) + this.windDiff
          );
        } else if (variable == "[") {
          this.len *= 0.85;
          this.lw *= 0.8;
          this.p.push();
        } else if (variable == "]") {
          this.len /= 0.85;
          this.lw /= 0.8;
          this.p.pop();
        }
      }
      this.lw /= Math.pow(0.9, this.trunkPieces);
    }
  }
  p.windowResized = function () {
    setCanvasSize();
  };
};
