// sketch.js - Pond of Reflections

var sketch = function(p) {

let magicNumber = 10;
let circles = [];
let particles = [];
let clinkSound;
let audioStarted = false;
let isNightMode = false;

// Tool used to pick the colours: https://codepen.io/HunorMarton/details/eWvewo 
const PARTICLE_PALETTE = {
    red:       { h: 350, s: 90, b: 90 },  
    orange:    { h: 50,  s: 90, b:90 },  
    blue:      { h: 210, s: 90, b: 90 },  
    turquoise: { h: 192, s: 90, b: 90 },
    green: { h: 120, s: 90, b: 90 },
    black:     { h: 0,   s: 0,   b: 0 }, 
    white:     { h: 0,   s: 0,   b: 90 },
};


const PAIRS = [
    ['red', 'blue'],
    ['black', 'red'],
    ['turquoise', 'turquoise'],
    ['blue', 'white'],
    ['white', 'blue'],
    ['white', 'orange'],
    ['orange', 'green'],
    ['turquoise', 'green'],
    ['green', 'white']
];

p.preload = function() {
};

p.setup = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let canvas = p.createCanvas(w, h);
    canvas.parent("artwork-container");
    p.background(70, 35, 60);
    
    p.colorMode(p.HSB, 360, 100, 100, 100);

    initializeSketch();
};

function initializeSketch() {
    let numCircles = p.random(25, 45);

    for (let i=0; i<numCircles; i++) {
        
        const circle = {
            x: p.random(p.width),
            y: p.random(p.height),
            size: p.random(p.min(p.width, p.height) * 0.03, p.min(p.width, p.height) * 0.15), 
            fillAlpha: p.random(20, 30),
            strokeAlpha: p.random(10, 35),
            strokeWeight: p.random(1, 2),
            particleDesign: null,

            driftSeedX: p.random(1000),
            driftSeedY: p.random(1000),
            driftSpeed: p.random(0.0015, 0.006),
            driftAmp: p.random(0.15, 0.6),

            wasTouching: null,
            lastHitFrame: -9999,
            id: i,

            hue: p.random(0, 360),
            nightStrokeWeight: p.random(2, 3),

            glowLayers: 20, 
            glowSpread: 1.5,
        };


        let pair = p.random(PAIRS);
        circle.particleDesign = {
            coreColor: PARTICLE_PALETTE[pair[0]],
            haloColor: PARTICLE_PALETTE[pair[1]],
            fillAlpha: p.random(80, 100),
            haloAlpha: p.random(80, 100),
            haloFuzzMinRatio: p.random(0.15, 0.3),
            haloFuzzMaxRatio: p.random(0.4, 0.5),
        };
        
        const numParticles = p.floor(p.random(1, 5));
        for (let j = 0; j < numParticles; j++) {
            const angle = p.random(p.TWO_PI);
            const maxRadius = (circle.size / 2) * 0.7;
            const radius = p.sqrt(p.random()) * maxRadius;
            const particleX = circle.x + p.cos(angle) * radius;
            const particleY = circle.y + p.sin(angle) * radius;
            
            const circleRadius = circle.size / 2;
            const maxParticleSize = circleRadius * 0.7;
            const minParticleSize = circleRadius * 0.20;
            const particleSize = p.random(minParticleSize, maxParticleSize);
            
            particles.push({
                x: particleX,
                y: particleY,
                size: particleSize,
                design: circle.particleDesign,
                circle: circle
            });
        }
        
        circles.push(circle);
    }
}


// Reference for drawing shapes with Perlin noise from The Coding Train: https://www.youtube.com/watch?v=ZI1dmHv3MeM
function drawFuzzyParticle(particle) {
    let points = 30;
    let baseRadius = particle.size / 5;
    let t = p.frameCount * 0.01;

    let haloFuzzMin = particle.size * particle.design.haloFuzzMinRatio;
    let haloFuzzMax = particle.size * particle.design.haloFuzzMaxRatio;

    // ** HALO ** of the particle
    p.fill(particle.design.haloColor.h, particle.design.haloColor.s, particle.design.haloColor.b, particle.design.haloAlpha);
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / points) {
        let n = p.noise(particle.x * 0.02 + p.cos(a), particle.y * 0.02 + p.sin(a), t + 10);
        let fuzz = p.map(n, 0, 1, haloFuzzMin, haloFuzzMax);
        let r = baseRadius + fuzz;
        let x = particle.x + p.cos(a) * r;
        let y = particle.y + p.sin(a) * r;
        p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // ** CORE ** of the particle
    p.noStroke();
    p.fill(particle.design.coreColor.h, particle.design.coreColor.s, particle.design.coreColor.b, particle.design.fillAlpha);

    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / points) {
        let n = p.noise(particle.x * 0.01 + p.cos(a), particle.y * 0.01 + p.sin(a), t);
        let r = baseRadius * 0.55 + n * (magicNumber * particle.size / 50);
        let x = particle.x + p.cos(a) * r;
        let y = particle.y + p.sin(a) * r;
        p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
}


function updateCircleDrift() {
    const t = p.frameCount;
  
    for (let c of circles) {
      const vx = p.map(p.noise(c.driftSeedX, t * c.driftSpeed), 0, 1, -c.driftAmp, c.driftAmp);
      const vy = p.map(p.noise(c.driftSeedY, t * c.driftSpeed), 0, 1, -c.driftAmp, c.driftAmp);
  
      c.x += vx;
      c.y += vy;
  
      const r = c.size / 2;
      if (c.x < -r) c.x = p.width + r;
      if (c.x > p.width + r) c.x = -r;
      if (c.y < -r) c.y = p.height + r;
      if (c.y > p.height + r) c.y = -r;
  
      for (let pt of particles) {
        if (pt.circle === c) {
          pt.x += vx;
          pt.y += vy;
        }
      }
    }
}

function drawGlow() {
    for (let c of circles) {
        for (let i = 0; i < c.glowLayers; i++) {
            const progress = i / c.glowLayers;
            const alpha = p.map(progress, 0, 1, 50, 5);
            const sizeFactor = p.map(progress, 0, 1, 1.0, c.glowSpread);
            
            p.noFill();
            p.stroke(c.hue, 100, 100, alpha);
            p.strokeWeight(1);
            p.ellipse(c.x, c.y, c.size * sizeFactor);
        }
    }
}


function handleCircleCollisions() {
    const minFramesBetweenHits = 30;
    const touchThreshold = 0.5;

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            const a = circles[i]; 
            const b = circles[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = p.sqrt(dx*dx + dy*dy);
            const minDist = (a.size/2) + (b.size/2); 
            
            const isExactlyTouching = p.abs(dist - minDist) < touchThreshold;
            
            if (isExactlyTouching) {
                if (p.frameCount - a.lastHitFrame < minFramesBetweenHits) continue;
                if (p.frameCount - b.lastHitFrame < minFramesBetweenHits) continue;
                
                playHitSound(a, b);
                
                a.lastHitFrame = p.frameCount;
                b.lastHitFrame = p.frameCount;
            }
        }
    }
}

function playHitSound(a, b) {
    if (!audioStarted || !clinkSound) return;
    
    const avgSize = (a.size + b.size) * 0.5;
    const minSize = p.min(p.width, p.height) * 0.03;
    const maxSize = p.min(p.width, p.height) * 0.15;
    
    const rate = p.map(avgSize, minSize, maxSize, 1.3, 0.7);
    
    const impact = 0.50;
    const volume = p.constrain(impact, 0.1, 1.5);
    
    clinkSound.rate(rate);
    clinkSound.setVolume(volume);
    
    clinkSound.stop();
    clinkSound.play();
}

p.draw = function() {

    if (isNightMode) {
        p.background(10);
    } else {
        p.background(70, 35, 60);
    }

    updateCircleDrift();
    handleCircleCollisions();
    if (isNightMode) drawGlow(); 
    
    for (let i=0; i < circles.length; i++) {
        
        if (isNightMode) {
            p.noFill();
            p.stroke(circles[i].hue, 100, 100);
            p.strokeWeight(circles[i].nightStrokeWeight);
        } else {
            p.fill(0, 0, 90, circles[i].fillAlpha);
            p.stroke(0, 0, 100, circles[i].strokeAlpha);
            p.strokeWeight(circles[i].strokeWeight);
        }
        
        p.ellipse(circles[i].x, circles[i].y, circles[i].size, circles[i].size);
    }
    
    for (let i = 0; i < particles.length; i++) {
        drawFuzzyParticle(particles[i]);
    }
};


function toggleNightMode() {
    isNightMode = !isNightMode;
    console.log(isNightMode ? '🌙 Night Mode (Brighter)' : '☀️ Day Mode (Normal)');
    
    for (let circle of circles) {

        if (isNightMode) {
            if (circle.particleDesign.coreColor.h === 0 && circle.particleDesign.coreColor.s === 0) {
                if (circle.particleDesign.coreColor.b === 0) {
                    circle.particleDesign.coreColor.b = 100;
                } else {
                    circle.particleDesign.coreColor.b = 100;
                }
            } else {
                circle.particleDesign.coreColor.b = 100;
                circle.particleDesign.coreColor.s = 100;
            }

            circle.particleDesign.haloAlpha = p.min(100, circle.particleDesign.haloAlpha * 1.25);
            
        } else {
            if (circle.particleDesign.coreColor.h === 0 && circle.particleDesign.coreColor.s === 0) {
                if (circle.particleDesign.coreColor.b === 0 || circle.particleDesign.coreColor.b < 50) {
                    circle.particleDesign.coreColor.b = 0;
                } else {
                    circle.particleDesign.coreColor.b = 90;
                }
            } else {
                circle.particleDesign.coreColor.b = 90;  
                circle.particleDesign.coreColor.s = 90;  
            }
            
            circle.particleDesign.haloAlpha = p.constrain(circle.particleDesign.haloAlpha / 1.25, 80, 100);
        }
        
        for (let particle of particles) {
            if (particle.circle === circle) {
                particle.design = circle.particleDesign;
            }
        }
    }
}

p.mousePressed = function() {
    console.log('Mouse clicked at:', p.mouseX, p.mouseY);
    if (!audioStarted) {
        p.getAudioContext().resume().then(function() {
            audioStarted = true;
            console.log('Audio started!');
        });
    }
};

p.keyPressed = function() {
    if (p.key === 'n' || p.key === 'N') {
        toggleNightMode();
        console.log(isNightMode ? '🌙 Night Mode' : '☀️ Day Mode');
    }
};

};
