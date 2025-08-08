var sketch = function (p) {
  let cols, rows;
  let inc = 0.1; // Variation du bruit
  let scl = 20; // Taille des cellules du champ
  let zoff = 0; // Dimension Z du bruit de Perlin
  let flowfield;
  let particles = [];
  let center;

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    cols = p.floor(p.width / scl);
    rows = p.floor(p.height / scl);
    flowfield = new Array(cols * rows);
    center = p.createVector(p.width / 2, p.height / 2);

    for (let i = 0; i < 2000; i++) {
      particles.push(new Particle());
    }

    p.background(0);
  };

  p.draw = function () {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = p.noise(xoff, yoff, zoff) * p.TWO_PI;
        let v = p5.Vector.fromAngle(angle);
        flowfield[index] = v;
        xoff += inc;
      }
      yoff += inc;
    }

    zoff += 0.005;

    // Mise à jour des particules
    for (let particle of particles) {
      particle.follow(flowfield);
      particle.update();
      particle.edges();
      particle.show();
    }
  };

  class Particle {
    constructor() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p5.Vector.random2D();
      this.acc = p.createVector(0, 0);
      this.maxspeed = 2;
      this.prevPos = this.pos.copy();
      this.color = p.color(
        p.random(100, 255),
        p.random(100, 255),
        p.random(100, 255),
        50
      );
    }

    follow(vectors) {
      let x = p.floor(this.pos.x / scl);
      let y = p.floor(this.pos.y / scl);
      let index = x + y * cols;
      let force = vectors[index];
      if (force) this.applyForce(force);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
    }

    show() {
      p.stroke(this.color);
      p.strokeWeight(1.5);
      p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      this.updatePrev();
    }

    updatePrev() {
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    edges() {
      if (this.pos.x > p.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = p.height;
      this.updatePrev();
    }
  }
};
