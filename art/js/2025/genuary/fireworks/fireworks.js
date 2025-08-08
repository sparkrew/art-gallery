var sketch = function (p) {
  let fireworks = [];
  let gravity;
  let trails = [];
  let explosionSound;
  let soundPlayed = false;
  let width;
  let height;

  /* p.preload = function () {
    explosionSound = p.loadSound(
      "../art/js/2025/genuary/fireworks/firework.mp3",
      () => {
        soundPlayed = true;
      }
    );
  }; */

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");

    gravity = p.createVector(0, 0.2);
    p.userStartAudio();
  };

  p.draw = function () {
    p.background(10, 10, 30, 25);

    if (p.random(1) < 0.05) {
      fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].done()) {
        fireworks.splice(i, 1);
      }
    }

    for (let i = trails.length - 1; i >= 0; i--) {
      trails[i].update();
      trails[i].show();
      if (trails[i].done()) {
        trails.splice(i, 1);
      }
    }
  };

  p.stopSound = function () {
    if (explosionSound && explosionSound.isPlaying()) {
      explosionSound.stop();
      soundPlayed = false;
    }
  };

  p.playSound = function () {
    if (explosionSound && !explosionSound.isPlaying()) {
      explosionSound.play();
      soundPlayed = true;
    }
  };

  class Firework {
    constructor() {
      this.firework = new Particle(p.random(p.width), p.height, true);
      this.exploded = false;
      this.particles = [];
      trails.push(new Trail(this.firework.pos.x, this.firework.pos.y));
    }

    update() {
      if (!this.exploded) {
        this.firework.applyForce(gravity);
        this.firework.update();
        if (this.firework.vel.y >= 0) {
          this.exploded = true;
          this.explode();
        }
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].applyForce(gravity);
        this.particles[i].update();
        if (this.particles[i].done()) {
          this.particles.splice(i, 1);
        }
      }
    }

    explode() {
      if (soundPlayed) {
        explosionSound.play();
      }
      for (let i = 0; i < 150; i++) {
        let pParticle = new Particle(
          this.firework.pos.x,
          this.firework.pos.y,
          false
        );
        this.particles.push(pParticle);
      }
    }

    done() {
      return this.exploded && this.particles.length === 0;
    }

    show() {
      if (!this.exploded) {
        this.firework.show();
      }
      for (let p of this.particles) {
        p.show();
      }
    }
  }

  class Particle {
    constructor(x, y, firework) {
      this.pos = p.createVector(x, y);
      this.firework = firework;
      this.lifespan = 255;
      this.vel = firework
        ? p.createVector(0, p.random(-15, -10))
        : p5.Vector.random2D().mult(p.random(3, 12));
      this.acc = p.createVector(0, 0);
      this.color = p.color(p.random(255), p.random(255), p.random(255));
    }

    applyForce(force) {
      this.acc.add(force);
    }

    update() {
      if (!this.firework) {
        this.vel.mult(0.95);
        this.lifespan -= 5;
      }
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    done() {
      return this.lifespan < 0;
    }

    show() {
      p.stroke(this.color);
      if (!this.firework) {
        p.strokeWeight(3);
        p.stroke(this.color, this.lifespan);
      } else {
        p.strokeWeight(5);
      }
      p.point(this.pos.x, this.pos.y);
    }
  }

  class Trail {
    constructor(x, y) {
      this.path = [];
      this.lifespan = 255;
      this.color = p.color(255, 100);
      this.pos = p.createVector(x, y);
    }

    update() {
      this.path.push({ x: this.pos.x, y: this.pos.y });
      if (this.path.length > 10) {
        this.path.shift();
      }
      this.lifespan -= 10;
    }

    done() {
      return this.lifespan < 0;
    }

    show() {
      p.noFill();
      p.stroke(this.color, this.lifespan);
      p.strokeWeight(2);
      p.beginShape();
      for (let point of this.path) {
        p.vertex(point.x, point.y);
      }
      p.endShape();
    }
  }
};
