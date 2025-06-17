// Classe Particule
class Particle {
    constructor(x, y, angle) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.fromAngle(angle); // Direction initiale radiale
        this.vel.mult(random(1, 3)); // Vitesse aléatoire
        this.acc = createVector(0, 0);
        this.maxSpeed = 2;
        this.prevPos = this.pos.copy(); // Sauvegarde de la position précédente
    }
    
    applyForce(force) {
        this.acc.add(force);
    }
    
    follow(flowField) {
        let x = floor(this.pos.x / scale);
        let y = floor(this.pos.y / scale);
        let index = x + y * cols;
        let force = flowField[index];
        if (force) {
            this.applyForce(force);
        }
    }
    
    applyRadialForce() {
        let center = createVector(width / 2, height / 2);
        let dir = p5.Vector.sub(this.pos, center); // Vecteur direction vers l'extérieur
        let dist = dir.mag();
        if (dist > 0) {
            dir.normalize();
            let strength = 1.2; // Petite force radiale
            dir.mult(strength);
            this.applyForce(dir);
        }
    }
  
    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0); // Réinitialisation de l'accélération
        
        // Conserver la position précédente pour dessiner la trace
        this.prevPos.set(this.pos.x, this.pos.y);
  
        // Réinitialisation quand elle sort
        if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
            let angle = random(TWO_PI);
            this.pos.set(width / 2 + cos(angle) * radius, height / 2 + sin(angle) * radius);
            this.prevPos.set(this.pos.x, this.pos.y);
            this.vel = p5.Vector.fromAngle(angle);
            this.vel.mult(random(1, 3));
        }
    }
    
    show() {
        stroke(255, 0, 0, 80); // Rouge semi-transparent
        strokeWeight(2);
        line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y); // Traces persistantes
    }
  }