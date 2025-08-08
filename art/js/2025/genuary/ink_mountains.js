var sketch = function (p) {
  let WIDTH;
  let HEIGHT;

  let drops = [];
  let dropsSun = [];
  let numberDrops = 1;
  let numberMountains;
  let loop = 0;

  let x;
  let totalX;
  let y;
  let initY;
  let noiseLevel;
  let noiseScale;
  let seed;

  let heightSun;
  let posSun;
  let radiusSun;
  let sunDrop = 0;

  let radiusInf = 4;
  let radiusSup = 6;

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    WIDTH = container.offsetWidth;
    HEIGHT = container.offsetHeight;
    const canvas = p.createCanvas(WIDTH, HEIGHT);
    canvas.parent("artwork-container");

    //let sizeX = (p.windowWidth - p.width) / 2;
    //let sizeY = (p.windowHeight - p.height) / 2;
    //cnv.position(sizeX, sizeY);

    p.background(235, 224, 197);

    seed = p.random(p.width * p.height);
    noiseLevel = p.random(50, 100);
    noiseScale = p.random(0.01, 0.03);

    let r = p.random();
    numberMountains = r < 0.5 ? 3 : 4;

    x = 0;
    totalX = 0;
    initY = p.random(HEIGHT / 7, HEIGHT / 5);
    y = initY + noiseLevel * p.noise(noiseScale * seed);

    for (let i = 0; i < numberDrops; i++) {
      drops.push(new Drop(x, y, p.random(radiusInf, radiusSup)));
    }

    p.noStroke();

    heightSun = HEIGHT / 5;
    posSun = p.random(50, WIDTH - 50);
    radiusSun = p.random(WIDTH / 12, WIDTH / 9);
    p.angleMode(p.DEGREES);

    for (let theta = -195; theta < 15; theta++) {
      let radius = p.random(radiusInf, radiusSup);
      let dr = radius / (2 * radiusSun);
      let da = 200 / (2 * radiusSun);
      if (theta <= -155 || theta >= -25) {
        dr = radius / (0.6 * radiusSun);
        da = 200 / (0.6 * radiusSun);
      }
      dropsSun.push(
        new DropSun(
          posSun + radiusSun * p.cos(theta),
          heightSun + radiusSun * p.sin(theta),
          radius,
          dr,
          da
        )
      );
    }
  };

  p.draw = function () {
    if (loop === 0) {
      if (sunDrop < dropsSun.length - 1) sunDrop++;
      for (let i = sunDrop - 1; i >= 0; i--) {
        dropsSun[i].move(p);
        if (dropsSun[i].r <= 0 || dropsSun[i].a <= 0) {
          dropsSun.splice(i, 1);
          sunDrop--;
          continue;
        }
        dropsSun[i].update(p);
      }
      if (sunDrop === 0) loop++;
    } else {
      p.noStroke();
      for (let i = drops.length - 1; i >= 0; i--) {
        drops[i].move(p);
        if (drops[i].r <= 0) {
          drops.splice(i, 1);
          continue;
        }
        drops[i].update(p);
      }

      loop++;
      if (loop % 2 === 0) {
        numberDrops++;
        x += 1;
        totalX += 1;
        y = initY + noiseLevel * p.noise(noiseScale * (seed + totalX));
        drops.push(new Drop(x, y, p.random(radiusInf, radiusSup)));
      }

      if (x >= p.width && numberMountains !== 1) {
        x = 0;
        seed = p.random(p.width * p.height);
        initY += p.random(30, 50);
        noiseLevel += p.random(10, 20);
        y = initY + noiseLevel * p.noise(noiseScale * (seed + totalX));
        numberMountains--;
      }
    }
  };

  class Drop {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.initR = r;
      this.r = r;
      this.lifeReductionStep = 0;
      this.lifeReduction = 0;
      this.s = 1;

      this.red = 39;
      this.green = 45;
      this.blue = 56;

      this.lifeSpan = this.y / (1.66 * HEIGHT);
      this.initA = p.random(200, 255);
      this.a = this.initA * this.lifeSpan;
    }

    move(p) {
      p.fill(this.red, this.green, this.blue, this.a);
      p.circle(this.x, this.y, this.r);
    }

    update(p) {
      this.y += this.s;
      this.x += p.random(-1, 1);
      this.lifeReductionStep += this.s;
      this.lifeReduction = (this.lifeReductionStep * 2) / HEIGHT;
      this.r -= this.lifeReduction;

      this.red = p.map(this.r, 0, this.initR, 255, 39);
      this.green = p.map(this.r, 0, this.initR, 255, 45);
      this.blue = p.map(this.r, 0, this.initR, 255, 56);

      this.lifeSpan = this.y / (1.66 * HEIGHT);
      this.a = this.initA * this.lifeSpan;
    }
  }

  class DropSun {
    constructor(x, y, r, dr, da) {
      this.x = x;
      this.y = y;
      this.s = 1;
      this.initR = r;
      this.r = r;
      this.dr = dr;

      this.red = 193 + p.random(-5, 5);
      this.green = 43 + p.random(-5, 5);
      this.blue = 23 + p.random(-5, 5);

      this.a = p.random(150, 180);
      this.da = da;
    }

    move(p) {
      p.fill(this.red, this.green, this.blue, this.a);
      p.circle(this.x, this.y, this.r);
    }

    update(p) {
      this.y += this.s;
      this.x += p.random(-1, 1);
      this.r -= this.dr;
      this.a -= this.da;
    }
  }
};
