var sketch = function (p) {
  let particles = [];
  let data = [];
  let years = [];
  let particlesPerYear = [];
  let size = 0;
  let joinDistance = 100;
  let startFrom = 0;

  let width;
  let height;

  class Particle {
    constructor() {
      this.x = p.random(0, width);
      this.y = p.random(0, height);
      this.r = p.random(1, 8);
      this.xSpeed = p.random(-5, 5);
      this.ySpeed = p.random(-2, 5.5);
    }

    createParticle() {
      p.noStroke();
      p.fill("rgba(200,169,169,0.5)");
      p.circle(this.x, this.y, this.r);
    }

    moveParticle() {
      if (this.x < 0 || this.x > width) this.xSpeed *= -1;
      if (this.y < 0 || this.y > height) this.ySpeed *= -1;
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }

    joinParticles(particles) {
      particles.forEach((element) => {
        let dis = p.dist(this.x, this.y, element.x, element.y);
        if (dis < joinDistance) {
          p.stroke("rgba(255,255,255,0.04)");
          p.line(this.x, this.y, element.x, element.y);
        }
      });
    }
  }

  p.preload = function () {
    data = p.loadJSON("../art/js/2024/data/papers/papers.json");
  };

  p.setup = function () {
    const container =
      document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;

    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    size = Object.keys(data).length;

    for (let i = 0; i < size; i++) {
      years[i] = data[i]["year"];
    }

    for (let i = 0; i < size; i++) {
      let particle = new Particle();
      let age = 2024 - years[i];

      particle.r = p.map(age, 0, 10, 1, 10);
      //Use a custom function for the size of
      if (startFrom == 1) {
        //start from middle
        particle.x = width / 2;
        particle.y = height / 2;
      } else if (startFrom == 2) {
        particle.x = 0;
        particle.y = 0;
      }
      particles.push(particle);
    }

    for (let i = 0; i < size; i++) {
      if (typeof particlesPerYear[years[i]] == "undefined") {
        particlesPerYear[years[i]] = [];
      }
      particlesPerYear[years[i]].push(particles[i]);
    }
  };

  p.draw = function () {
    p.background("#0f0f0f");
    for (let i = 0; i < particles.length; i++) {
      particles[i].createParticle();
      particles[i].moveParticle();

      //linked particles
      let linkedParticles = particlesPerYear[years[i]];
      particles[i].joinParticles(linkedParticles);
    }
  };
};
