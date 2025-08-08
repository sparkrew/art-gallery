var sketch = function (p) {
  const num = 1;
  const noiseScale = 0.01;
  const particles = [];
  let currentColor;
  let colorChange = 0.5;
  let currentIteration = 0;
  let width, height;

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;

    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");

    p.colorMode(p.HSB);
    currentColor = p.color(0, 0, 100); // Set initial color
    p.background(0, 0, 0);

    for (let i = 0; i < num; i++) {
      particles.push(p.createVector(p.random(width), p.random(height)));
    }
  };

  p.draw = function () {
    if (currentIteration % 3 === 0) {
      for (let i = 0; i < num; i++) {
        particles.push(p.createVector(p.random(width), p.random(height)));
      }
    }

    p.background(0, 0, 0, 0.01);

    for (let i = 0; i < particles.length; i++) {
      p.stroke(currentColor);
      let particle = particles[i];
      p.point(particle.x, particle.y);
      let n = p.noise(particle.x * noiseScale, particle.y * noiseScale);
      let a = p.TAU * n;
      particle.x += p.cos(a);
      particle.y += p.sin(a);

      if (!onScreen(particle)) {
        particle.x = p.random(width);
        particle.y = p.random(height);
      }
    }

    currentIteration++; // Increment iteration count
  };

  p.mousePressed = function () {
    p.noiseSeed(p.millis());
  };

  function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
  }
};
