var sketch = function (p) {
  let startXLine, startYLine, endXLine, endYLine;
  let startXRect1, startYRect1, hRect1, wRect1;
  let startXRect2, startYRect2, hRect2, wRect2;
  let timeSwitch;
  let numPoints = 500;
  let ampWave = 200;
  let ampNoise = 10;
  let particles = [];
  let cols, rows;
  let scale = 20;
  let flowField = [];
  let numParticles = 200;
  let radius = 20;
  let sample0PlayingBackground = false;
  let sample0PlayingParticle = false;
  let samples = [];
  let currentSamples = [];
  let previousTime = 0;
  let customFrameCount = 0;
  let width;
  let height;

  p.preload = function () {
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/0.mp3"));
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/1.mp3"));
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/2.mp3"));
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/3.mp3"));
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/4.mp3"));
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/5.mp3"));
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/6.mp3"));
    samples.push(p.loadSound("art/js/2025/algo/artwork_2/samples/7.mp3"));
  };

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");

    startXLine = 0;
    startYLine = p.floor(p.random(p.height));
    endXLine = p.width;
    endYLine = p.floor(p.random(p.height));

    timeSwitch = p.random(10, 13);

    startXRect1 = p.width * p.random();
    startYRect1 = p.height * p.random();
    hRect1 = p.floor(p.random(100, p.height / 2));
    wRect1 = p.floor(p.random(100, p.width / 2));

    startXRect2 = p.width * p.random();
    startYRect2 = p.height * p.random();
    hRect2 = p.floor(p.random(100, p.height / 2));
    wRect2 = p.floor(p.random(100, p.width / 2));

    customFrameCount = 0;
    currentSamples = [];
    playRandomSample();

    cols = p.floor(p.width / scale);
    rows = p.floor(p.height / scale);

    p.noiseDetail(4);
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      let angle = p.map(i, 0, numParticles, 0, p.TWO_PI);
      let x = p.width / 2 + p.cos(angle) * radius;
      let y = p.height / 2 + p.sin(angle) * radius;
      particles.push(new Particle(x, y, angle, p));
    }
    sample0PlayingParticle = false;
    p.background(0);
  };

  p.draw = function () {
    if (sample0PlayingBackground) {
      p.background(255);
      sample0PlayingBackground = false;
    }

    if (
      p.abs(customFrameCount / 60 - previousTime) >
      currentSamples[currentSamples.length - 1].duration()
    ) {
      previousTime = customFrameCount / 60;
      playRandomSample();
    }

    if (sample0PlayingParticle) {
      let yoff = 0;
      for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
          let index = x + y * cols;
          let angle = p.noise(xoff, yoff, p.frameCount * 0.005) * p.TWO_PI * 2;
          let v = p5.Vector.fromAngle(angle);
          flowField[index] = v;
          xoff += 0.1;
        }
        yoff += 0.1;
      }

      for (let part of particles) {
        part.follow(flowField);
        part.applyRadialForce();
        part.update();
        part.show();
      }
    } else {
      p.background(0);
      drawLine(
        numPoints,
        ampWave,
        ampNoise,
        startXLine,
        startYLine,
        endXLine,
        endYLine,
        10 * p.noise(customFrameCount * 0.1),
        10 * p.noise(customFrameCount * 0.1),
        p
      );
      drawBouncyRect(
        startXRect1,
        startYRect1,
        wRect1,
        hRect1,
        p.map(p.noise(customFrameCount * 0.1), 0, 1, -5, 5),
        100 * p.noise(customFrameCount * 0.1),
        p
      );
      drawBouncyRect(
        startXRect2,
        startYRect2,
        wRect2,
        hRect2,
        5 * p.sin(0.1 * p.noise(customFrameCount * 0.1)) + 0.845,
        100 * p.noise(customFrameCount * 0.1, 100),
        p
      );
    }

    customFrameCount += 1;
  };

  function playRandomSample() {
    if (customFrameCount / 60 < timeSwitch) {
      let randomIndex = p.floor(p.random(1, samples.length));
      currentSamples.push(samples[randomIndex]);
      currentSamples[currentSamples.length - 1].loop();
    } else {
      for (let s of currentSamples) s.stop();
      sample0PlayingBackground = true;
      sample0PlayingParticle = true;
      currentSamples = [samples[0]];
      currentSamples[0].play();
      currentSamples[0].onended(() => p.setup());
    }
  }

  function drawLine(
    numPoints,
    ampWave,
    ampNoise,
    startX,
    startY,
    endX,
    endY,
    mode,
    c,
    p
  ) {
    p.stroke(255);
    p.strokeWeight(5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= numPoints; i++) {
      let t = i / numPoints;
      let x = p.lerp(startX, endX, t);
      let yBase = p.lerp(startY, endY, t);
      let yWave =
        ampWave * p.sin(mode * p.PI * t) * p.cos(c * p.frameCount * 0.02);
      let y = yBase + yWave + p.random(ampNoise);
      p.vertex(x, y);
    }
    p.endShape();
  }

  function drawBouncyRect(
    startX,
    startY,
    widthR,
    heightR,
    curveBounce,
    randomness,
    p
  ) {
    p.curveTightness(curveBounce);
    p.fill("white");
    p.beginShape();
    p.curveVertex(startX + p.random(randomness), startY + p.random(randomness));
    p.curveVertex(
      startX + 1 + p.random(randomness),
      startY + p.random(randomness)
    );
    p.curveVertex(
      startX + widthR + p.random(randomness),
      startY + p.random(randomness)
    );
    p.curveVertex(
      startX + widthR + p.random(randomness),
      startY + heightR + p.random(randomness)
    );
    p.curveVertex(
      startX + p.random(randomness),
      startY + heightR + p.random(randomness)
    );
    p.endShape(p.CLOSE);
  }

  class Particle {
    constructor(x, y, angle, p) {
      this.p = p;
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(0, 0);
      this.acc = p.createVector(0, 0);
      this.maxSpeed = 2;
      this.initialAngle = angle;
    }

    follow(vectors) {
      let x = this.p.floor(this.pos.x / scale);
      let y = this.p.floor(this.pos.y / scale);
      let index = x + y * cols;
      if (vectors[index]) {
        this.applyForce(vectors[index]);
      }
    }

    applyForce(force) {
      this.acc.add(force);
    }

    applyRadialForce() {
      let center = this.p.createVector(this.p.width / 2, this.p.height / 2);
      let dir = p5.Vector.sub(this.pos, center);
      dir.setMag(0.05);
      this.applyForce(dir);
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    show() {
      this.p.stroke(255, 100);
      this.p.strokeWeight(2);
      this.p.point(this.pos.x, this.pos.y);
    }
  }
};
